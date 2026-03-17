import fs from 'fs';
import path from 'path';

const today = new Date();
const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const year = lastMonthDate.getFullYear();
const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');

const outputDir = path.join(process.cwd(), 'src/content/blog');
const fileName = `${year}-${month}-neodb-report.mdx`; 
const filePath = path.join(outputDir, fileName);

async function generateReport() {
  console.log(`开始生成 ${year}年${month}月 的书影音月报...`);

  const NEODB_API_URL = 'https://neodb.social/api/me/shelf/timeline';
  const token = process.env.NEODB_TOKEN; 

  try {
    const response = await fetch(NEODB_API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);
    const data = await response.json();
    
    // 1. 过滤出上个月的所有数据
    const monthlyRecords = data.data.filter(record => {
      const recordDate = new Date(record.created_time);
      return recordDate.getFullYear() === year && (recordDate.getMonth() + 1) === Number(month);
    });

    if (monthlyRecords.length === 0) {
      console.log('上个月没有记录，跳过生成。');
      return;
    }

    // --- 重点更新：给数据做分类 ---
    const books = monthlyRecords.filter(r => r.item.category === 'book');
    const videos = monthlyRecords.filter(r => ['movie', 'tv'].includes(r.item.category));
    // 如果你平时还标记播客或游戏，可以加一个“其他”分区
    const others = monthlyRecords.filter(r => !['book', 'movie', 'tv'].includes(r.item.category));

    // 2. 拼装 MDX 头部
    let mdxContent = `---
title: "月度书影音报告：${year}年${month}月"
date: ${today.toISOString().split('T')[0]}
tags: ["读书笔记"]
description: "由 GitHub Actions 自动拉取的本月读书观影总结。"
---
import NeoDBCard from '../src/components/NeoDBCard.astro';

本月一共记录了 **${monthlyRecords.length}** 笔书影音短评！

`;

    // 3. 提取一个生成卡片的复用函数，让代码更干净
    const generateCards = (records) => {
      let cardsStr = '';
      records.forEach(record => {
        const safeRecord = {
          item: {
            title: record.item.title,
            cover_image_url: record.item.cover_image_url,
            url: record.item.url,
            category: record.item.category
          },
          created_time: record.created_time,
          rating_grade: record.rating_grade,
          comment_text: record.comment_text
        };
        // 记得用 JSON.stringify 传递对象给 Astro 组件
        cardsStr += `<NeoDBCard record={${JSON.stringify(safeRecord)}} />\n\n`;
      });
      return cardsStr;
    };

    // 4. 按分区写入内容
    if (books.length > 0) {
      mdxContent += `### 📚 本月读过\n\n`;
      mdxContent += generateCards(books);
    }

    if (videos.length > 0) {
      mdxContent += `### 🎬 本月看过\n\n`;
      mdxContent += generateCards(videos);
    }

    if (others.length > 0) {
      mdxContent += `### 🎧 本月听过/玩过\n\n`;
      mdxContent += generateCards(others);
    }

    // 5. 写入文件
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    console.log(`✅ 成功生成带分区的 MDX 月报：${fileName}`);

  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

generateReport();