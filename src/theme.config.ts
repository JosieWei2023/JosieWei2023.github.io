export const THEME_CONFIG: App.Locals["config"] = {
  /** blog title */
  title: "关心牙齿更关心你",
  /** your name */
  author: "空心菜菜子",
  /** website description */
  desc: "生活再也奴役不了我，我将被风吹成紫红的黄昏",
  /** your deployed domain */
  website: "https://github.com/JosieWei2023/JosieWei2023.github.io",
  /** your locale */
  locale: "en-us",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [
    {
      name: "github",
      href: "https://github.com/JosieWei2023",
    },
    {
      name: "rss",
      href: "/atom.xml",
    },
    {
      name: "twitter",
      href: "https://github.com/JosieWei2023",
    },
    {
      name: "mastodon",
      href: "https://github.com/JosieWei2023",
    },
  ],
  /** your header info */
  header: {
    twitter: "@kongxincainaizi",
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
    // {
    //   name: "About",
    //   href: "/about",
    // },
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [
    { name: "月球背面", path: "behindthemoon" },
    { name: "中国故事", path: "lifeinchina" },
    { name: "读书笔记", path: "bookreview" },
    { name: "有点搞笑", path: "funnylife" },
  ],
  /** your comment provider */
  comments: {
    disqus: {
      shortname: "typography-astro",
    },
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
    // twikoo: {
    //   envId: "https://twikoo-tau-flame.vercel.app",
    // }
  },
};
