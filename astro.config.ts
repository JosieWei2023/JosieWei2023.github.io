import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // 1. 这里的网址必须全小写！URL 标准对此非常敏感
  site: "https://damao.ca", 
  
  // 2. 显式添加这一行，防止 sitemap 插件在生成链接时产生歧义
  trailingSlash: 'ignore',

  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      langs: [],
      wrap: true,
    },
  },
  
  // 3. 核心修改：调整加载顺序
  integrations: [
    // 第一步：先加载渲染器 (MDX)，确保页面被正确生成
    mdx(),
    
    // 第二步：加载样式
    UnoCSS({
      injectReset: true,
    }),
    
    // 第三步：所有页面生成完后，再生成 Sitemap
    // sitemap(),
    
    // 第四步：最后生成 robots.txt (因为它引用了 sitemap)
    // robotsTxt(), 
  ],
});