const API_BASE_URL = 'https://neodb.social/api/me/shelf';
const DEFAULT_TIMEOUT_MS = 4_000;

const itemRequests = new Map();
const shelfRequests = new Map();

function failure(error) {
  return { ok: false, data: null, error };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isNeoDBRecord(value) {
  return (
    isObject(value) &&
    isObject(value.item) &&
    typeof value.item.title === 'string' &&
    typeof value.item.url === 'string' &&
    typeof value.item.category === 'string' &&
    typeof value.item.cover_image_url === 'string' &&
    typeof value.created_time === 'string'
  );
}

function getItemId(dbUrl) {
  try {
    const url = new URL(dbUrl);
    if (url.hostname !== 'neodb.social') return null;
    return url.pathname.split('/').filter(Boolean).at(-1) ?? null;
  } catch {
    return null;
  }
}

async function fetchJSON(url, token, options = {}) {
  if (!token) return failure('missing NEODB_TOKEN');

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options.retries ?? 0;
  let lastError = 'unknown error';

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable) return failure(lastError);
      } else {
        return { ok: true, data: await response.json(), error: null };
      }
    } catch (error) {
      lastError =
        error instanceof Error && error.name === 'AbortError'
          ? `timeout after ${timeoutMs}ms`
          : error instanceof Error
            ? error.message
            : String(error);
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  return failure(lastError);
}

export function fetchNeoDBItem(dbUrl, token, options = {}) {
  const itemId = getItemId(dbUrl);
  if (!itemId) return Promise.resolve(failure('invalid NeoDB URL'));

  const cacheKey = itemId;
  if (!itemRequests.has(cacheKey)) {
    itemRequests.set(
      cacheKey,
      fetchJSON(`${API_BASE_URL}/item/${itemId}`, token, options).then((result) => {
        if (!result.ok) return result;
        return isNeoDBRecord(result.data)
          ? result
          : failure('invalid item response');
      }),
    );
  }

  return itemRequests.get(cacheKey);
}

export function fetchNeoDBShelf(category, token, options = {}) {
  const limit = options.limit;
  const cacheKey = `${category}:${limit ?? 'all'}`;

  if (!shelfRequests.has(cacheKey)) {
    const query = new URLSearchParams({ category, page: '1' });
    shelfRequests.set(
      cacheKey,
      fetchJSON(`${API_BASE_URL}/complete?${query}`, token, options).then((result) => {
        if (!result.ok) return { ...result, data: [] };

        if (!isObject(result.data) || !Array.isArray(result.data.data)) {
          return { ...failure('invalid shelf response'), data: [] };
        }

        const records = result.data.data.filter(isNeoDBRecord);
        return {
          ok: true,
          data: typeof limit === 'number' ? records.slice(0, limit) : records,
          error: null,
        };
      }),
    );
  }

  return shelfRequests.get(cacheKey);
}
