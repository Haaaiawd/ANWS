'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * 递归复制目录，返回已写入的文件路径数组（相对于 destDir）。
 *
 * @param {string} srcDir  源目录绝对路径
 * @param {string} destDir 目标目录绝对路径（不存在时自动创建）
 * @returns {Promise<string[]>} 已写入文件的绝对路径列表
 */
async function copyDir(srcDir, destDir) {
  const written = [];

  async function walk(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await walk(srcPath, destPath);
      } else if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
        written.push(destPath);
      }
      // 忽略 symlink 等特殊文件类型
    }
  }

  await walk(srcDir, destDir);
  return written;
}

module.exports = { copyDir };
