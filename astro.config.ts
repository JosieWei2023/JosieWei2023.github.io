import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // 1. 改为全小写，避免 Linux 环境下的比对错误
  site: "https://josiewei2023.github.io",

  // 2. 显式声明路径结尾策略，减少 Sitemap 歧义
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
    // 3. mdx 必须放在最前面！让它先处理内容
    mdx(),
    
    UnoCSS({
      injectReset: true,
    }),
    
    // 4. sitemap 和 robotsTxt 放到最后，处理生成好的页面
    sitemap(),
    robotsTxt(), 
  ],
});