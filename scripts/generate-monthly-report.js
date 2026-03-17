import fs from 'fs';
import path from 'path';

const today = new Date();
const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const year = lastMonthDate.getFullYear();
const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');

const outputDir = path.join(process.cwd(), 'src/content/posts'); // 确认是 posts 目录
const fileName = `${year}-${month}-neodb-report.mdx`; 
const filePath = path.join(outputDir, fileName);

// 1. 抓取数据的通用函数 (直接抄你 Now 页面的作业！)
async function fetchNeoDB(category, token) {
  try {
    const res = await fetch(`https://neodb.social/api/me/shelf/complete?category=${category}&page=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
        console.error(`❌ NeoDB 抓取失败 (${category}): HTTP ${res.status}`);
        return [];
    }
    
    const json = await res.json();
    return json.data || []; // 这里不需要 slice(0,4)，我们要拿到这个月所有的！
  } catch (error) {
    console.error(`❌ NeoDB 请求出错 (${category}):`, error);
    return [];
  }
}

async function generateReport() {
  console.log(`开始生成 ${year}年${month}月 的书影音月报...`);

  const token = process.env.NEODB_TOKEN; 
  if (!token) {
    console.error("❌ 未找到 NEODB_TOKEN 环境变量！");
    return;
  }

  try {
    // 2. 分别抓取书、电影、剧集的数据，并合并到一个大数组里
    console.log("正在拉取数据...");
    const booksData = await fetchNeoDB('book', token);
    const moviesData = await fetchNeoDB('movie', token);
    const tvData = await fetchNeoDB('tv', token);
    
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
      }
      
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
  }
}

generateReport();