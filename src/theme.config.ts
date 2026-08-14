export const THEME_CONFIG: App.Locals["config"] = {
  /** blog title */
  title: "大猫的部落格",
  /** your name */
  author: "伊丽莎白猫",
  /** website description */
  desc: "生活再也奴役不了我，我将被风吹成紫红的黄昏",
  /** your deployed domain */
  website: "https://damao.ca",
  /** your locale */
  locale: "en-us",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [],
  /** your header info */
  header: {
    twitter: "@damao",
  },
  /** your navigation links */
  navs: [
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    { name: "Now", href: "/now" },
    { name: "RSS", href: "/atom.xml" },
    // {
    //   name: "Friends",
    //   href: "/friends",
    // },
    // {
    //   name: "About",
    //   href: "/about",
    // },
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [
    { name: "月球背面", path: "behindthemoon" },
    { name: "身体与运动", path: "body" },
    { name: "山野与旅行", path: "travel" },
    { name: "书影音", path: "bookreview" },
    { name: "中国故事", path: "lifeinchina" },
    { name: "年度存档", path: "summary" },
    { name: "人间使用说明", path: "favorites" },
  ],
  /** your comment provider */
  comments: {
    // disqus: {
    //   shortname: "typography-astro",
    // },
    // giscus: {
    //   repo: 'moeyua/astro-theme-typography',
    //   repoId: 'R_kgDOKy9HOQ',
    //   category: 'General',
    //   categoryId: 'DIC_kwDOKy9HOc4CegmW',
    //   mapping: 'title',
    //   strict: '0',
    //   reactionsEnabled: '1',
    //   emitMetadata: '1',
    //   inputPosition: 'top',
    //   theme: 'light',
    //   lang: 'zh-CN',
    //   loading: 'lazy',
    // },
    twikoo: {
      // envId: "https://twikoo-cloudflare.josieblog.workers.dev",
      envId:
        "https://66fcb36d93a39132fea2bf6d--josiewei2023.netlify.app/.netlify/functions/twikoo",
    },
  },
};
