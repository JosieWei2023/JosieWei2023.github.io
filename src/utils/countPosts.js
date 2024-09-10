import glob from "glob";
import path from "path";

export function countPosts() {
  const postsDir = path.join(process.cwd(), "src/pages/posts/*.{md,mdx}");
  return glob.sync(postsDir).length;
}
