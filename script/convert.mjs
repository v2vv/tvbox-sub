import { promises as fs } from "fs";
import { dirname } from "path";
import * as core from "@actions/core"; // 引入 @actions/core

// 获取命令行参数
const [, , subName, url, inputFileName, outputFileName] = process.argv;

// 参数验证
if (!subName || !url || !inputFileName || !outputFileName) {
  core.setFailed(
    "请提供输入文件名、输出文件名、要替换的旧字符串和新字符串。用法: node insertSpider.mjs <输入文件名> <输出文件名> <旧字符串> <新字符串>"
  );
  process.exit(1);
}

// 生成输出目录并确保存在
const outputDir = dirname(outputFileName);
await fs.mkdir(outputDir, { recursive: true });

// 检查输入文件是否存在
try {
  await fs.access(inputFileName);
} catch (error) {
  core.setFailed(`输入文件不存在: ${inputFileName}`);
  process.exit(1);
}

// 帮助函数：转义正则中的特殊字符
const escapeRegExp = (str) => str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

// 帮助函数：生成有效的 URL
const sanitizeUrl = (baseUrl, path) => `${baseUrl.replace(/\/$/, "")}/${path}`;

// 读取 JSON 文件
const data = await fs.readFile(inputFileName, "utf8");

// 处理数据的不同方式
const subHandler = {
  pg: (data) => {
    const updatedData = data
      .replace(
        new RegExp(escapeRegExp("./lib"), "g"),
        sanitizeUrl(url, "localPackages/pg/lib")
      )
      .replace(
        new RegExp(escapeRegExp("./js"), "g"),
        sanitizeUrl(url, "localPackages/pg/js")
      )
      .replace(
        new RegExp(escapeRegExp("./pg.jar"), "g"),
        sanitizeUrl(url, "localPackages/pg/pg.jar")
      );

    const jsonData = JSON.parse(updatedData);

    // 更新 JSON 数据中的部分字段
    jsonData.sites.forEach((site) => {
      site.spider = jsonData.spider;
    });

    delete jsonData.spider;
    return jsonData;
  },
};

// 确保 subName 有对应的 handler
if (!subHandler[subName]) {
  core.setFailed(`无效的 subName: ${subName}`);
  process.exit(1);
}

try {
  const updatedJsonData = subHandler[subName](data);

  // 写入修改后的 JSON 数据
  await fs.writeFile(outputFileName, JSON.stringify(updatedJsonData, null, 2));
  console.log(`已成功更新文件 ${outputFileName}`);
} catch (error) {
  core.setFailed(`操作失败: ${error.message}`);
  process.exit(1);
}
