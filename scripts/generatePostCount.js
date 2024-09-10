import fs from 'fs';
import path from 'path';
import glob from 'glob';

// Count posts
const postsDir = path.join(process.cwd(), 'src/pages/posts/*.{md,mdx}');
const postCount = glob.sync(postsDir).length;

// Save the count to a JSON file
const outputDir = path.join(process.cwd(), 'src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
fs.writeFileSync(path.join(outputDir, 'postCount.json'), JSON.stringify({ count: postCount }));
