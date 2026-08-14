import fs from 'fs';
import path from 'path';
import { fetchNeoDBShelf } from '../src/utils/neodb-client.js';

const today = new Date();
const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const year = lastMonthDate.getFullYear();
const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `report_period=${year}-${month}\n`);
}

const outputDir = path.join(process.cwd(), 'src/content/posts'); // 确认是 posts 目录
const fileName = `${year}-${month}-neodb-report.mdx`; 
const filePath = path.join(outputDir, fileName);

async function generateReport() {
  console.log(`开始生成 ${year}年${month}月 的书影音月报...`);

  const token = process.env.NEODB_TOKEN; 
  if (!token) {
    console.error("❌ 未找到 NEODB_TOKEN 环境变量！");
    process.exitCode = 1;
    return;
  }

  try {
    // 2. 分别抓取书、电影、剧集的数据，并合并到一个大数组里
    console.log("正在拉取数据...");
    const results = await Promise.all([
      fetchNeoDBShelf('book', token, { retries: 2 }),
      fetchNeoDBShelf('movie', token, { retries: 2 }),
      fetchNeoDBShelf('tv', token, { retries: 2 }),
    ]);

    const categories = ['book', 'movie', 'tv'];
    const failures = results
      .map((result, index) => ({ category: categories[index], result }))
      .filter(({ result }) => !result.ok);
    if (failures.length > 0) {
      const details = failures
        .map(({ category, result }) => `${category}: ${result.error}`)
        .join(', ');
      throw new Error(`NeoDB 抓取不完整 (${details})`);
    }

    const [booksData, moviesData, tvData] = results.map((result) => result.data);
    
    const allData = [...booksData, ...moviesData, ...tvData];

    // 3. 过滤出上个月的所有数据
    const monthlyRecords = allData.filter(record => {
      const recordDate = new Date(record.created_time);
      return recordDate.getFullYear() === year && (recordDate.getMonth() + 1) === Number(month);
    });

    if (monthlyRecords.length === 0) {
      console.log(`上个月 (${year}-${month}) 没有记录，跳过生成。`);
      return;
    }

    // 4. 给数据做分类
    const books = monthlyRecords.filter(r => r.item.category === 'book');
    const videos = monthlyRecords.filter(r => ['movie', 'tv'].includes(r.item.category));

    // 5. 拼装 MDX 头部 (使用你游记的 Frontmatter 格式)
    let mdxContent = `---
title: "月度书影音报告：${year}年${month}月"
pubDate: ${today.toISOString().split('T')[0]}
categories: ["读书笔记"]
description: "由 GitHub Actions 自动拉取的本月读书观影总结"
---
import NeoDB from '../../components/NeoDB.astro';

本月一共记录了 **${monthlyRecords.length}** 笔书影音足迹！

`;

const generateCards = (records) => {
      let cardsStr = '';
      
      records.forEach(record => {
        const fullUrl = `https://neodb.social${record.item.url}`;
        
        // 只需要输出这一行！组件自己会搞定简介和短评的排版！
        cardsStr += `<NeoDB dbUrl="${fullUrl}" />\n\n`;
      })
      
      return cardsStr;
    };  

    if (books.length > 0) {
      mdxContent += `### 📚 本月读过\n\n`;
      mdxContent += generateCards(books);
    }

    if (videos.length > 0) {
      mdxContent += `### 🎬 本月看过\n\n`;
      mdxContent += generateCards(videos);
    }

    // 6. 写入文件
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    console.log(`✅ 成功生成带分区的 MDX 月报：${fileName}`);

  } catch (error) {
    console.error('❌ 生成过程中发生意外错误:', error);
    process.exitCode = 1;
  }
}

generateReport();
