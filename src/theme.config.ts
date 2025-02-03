export const THEME_CONFIG: App.Locals["config"] = {
  /** blog title */
  title: "Footprints on the Moon",
  /** your name */
  author: "空心菜菜子",
  /** website description */
  desc: "生活再也奴役不了我，我将被风吹成紫红的黄昏",
  /** your deployed domain */
  website: "https://josiewei2023.github.io/",
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
    // {
    //   name: "twitter",
    //   href: "https://github.com/JosieWei2023",
    // },
    {
      name: "mastodon",
      href: "https://m.cmx.im/@maoware",
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
    { name: "中国故事", path: "lifeinchina" },
    { name: "读书笔记", path: "bookreview" },
    { name: "有点搞笑", path: "funnylife" },
    { name: "记梦器", path: "dreamlog" },
    { name: "年终总结", path: "summary" },
    { name: "游记", path: "travel" },
    { name: "日常", path: "daily" },
    { name: "收藏夹", path: "favorites" },
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
