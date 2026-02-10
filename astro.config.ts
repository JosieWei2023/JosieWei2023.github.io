import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // 1. 改成全小写！这是最可能的报错原因
  site: "https://josiewei2023.github.io",

  // 2. 显式建议：统一 URL 结尾斜杠习惯（通常 GitHub Pages 推荐 'ignore' 或 'always'）
  // 加上这一行可以避免 sitemap 生成时的歧义
  trailingSlash: 'ignore', 

  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      langs: [],
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    // 3. 把 mdx 放到 sitemap 前面
    mdx(),
    
    // 4. robotsTxt 和 sitemap 放到最后
    // 注意：sitemap 最好放在 robotsTxt 之后，或者两者互换位置试试
    // 如果还是报错，可以先注释掉 robotsTxt() 排查是否是冲突
    sitemap(),
    robotsTxt(), 
  ],
});