[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/daeclijmnojoemooblcbfeeceopnkolo?style=flat-square)](https://chrome.google.com/webstore/detail/v2ex-plus/daeclijmnojoemooblcbfeeceopnkolo)
[![Edge Add-on](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Foejdifclmfffbginmbgndmkjbephefgd&style=flat-square)](https://microsoftedge.microsoft.com/addons/detail/v2ex-plus/oejdifclmfffbginmbgndmkjbephefgd)
[![Mozilla Add-on](https://img.shields.io/amo/v/%7B690c1618-4b2c-4905-bf58-1fc82bdfd6e7%7D?style=flat-square)](https://addons.mozilla.org/zh-CN/firefox/addon/v2ex-plus/)
![Publish Chrome](https://img.shields.io/github/actions/workflow/status/sciooga/v2ex-plus/publish-on-chrome-webstore.yml?label=publish%20chrome%20webstore&logo=github&logoColor=8d97a2&style=flat-square)
![Publish Edge](https://img.shields.io/github/actions/workflow/status/sciooga/v2ex-plus/publish-on-edge-add-ons.yml?label=publish%20edge%20add-on&logo=github&logoColor=8d97a2&style=flat-square)
[![License: GPLv3](https://img.shields.io/badge/license-GPLv3-blue?style=flat-square)](./COPYING)

<h1 align="center">V2EX Plus</h1>
<p align="center"><b>优雅便捷的 V2EX 扩展 · An Elegant V2EX Browser Extension</b></p>

<p align="center">
  <a href="#-安装">安装</a> ·
  <a href="#-功能特性">功能</a> ·
  <a href="#-开发">开发</a> ·
  <a href="#installation">Install</a> ·
  <a href="#features">Features</a> ·
  <a href="#development">Dev</a>
</p>

---

## 中文

### 📦 安装

| 浏览器 | 链接 |
|--------|------|
| Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/v2ex-plus/daeclijmnojoemooblcbfeeceopnkolo) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/v2ex-plus/) |
| Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/v2ex-plus/oejdifclmfffbginmbgndmkjbephefgd) |
| 离线安装 | [GitHub Releases](https://github.com/sciooga/v2ex-plus/releases) |

### ✨ 功能特性

#### 签到 & 通知

- **自动签到** — 每日自动完成签到任务，支持签到成功通知
- **未读消息提醒** — 实时轮询未读消息数，图标角标显示
- **登录状态检测** — 未登录时图标变灰并显示 `!` 提醒

#### 主题列表增强

- **主题预览** — 无需打开新页面，点击即可内联预览主题内容
- **主题忽略** — 一键忽略不感兴趣的主题
- **新窗口打开** — 所有主题链接默认在新标签页打开
- **vDaily 推荐** — 侧栏展示 vDaily 推荐主题和高赞回复

#### 主题详情增强

- **楼中楼（嵌套评论）** — 自动将 @回复 整理为嵌套对话，支持自动展开
- **会话详情** — 查看两个用户之间的完整对话上下文
- **悬浮查看关联回复** — 鼠标悬停在 @用户 上即可预览最近相关回复
- **高亮楼主回复** — 自定义颜色高亮楼主的回复，一眼识别
- **回复楼层号** — 回复时自动添加 `#楼层号`，方便追踪
- **表情面板** — 回复框集成 Emoji 表情选择器
- **Imgur 图床上传** — 支持选择文件、粘贴、拖拽上传图片到 Imgur
- **折叠超长内容** — 自动折叠过长的主题和回复，点击展开
- **翻页跳转** — 翻页时自动跳过主题正文，直接定位到回复区
- **自定义感谢爱心颜色** — 自定义回复感谢的爱心颜色
- **淡化新用户** — 注册不满 30 天的用户回复降低透明度
- **修复历史微博图片** — 自动修复 V2EX 中失效的微博图片外链

#### 用户相关

- **用户信息悬浮卡片** — 鼠标悬停头像查看用户详细信息（注册时间、在线状态、个人简介等）
- **关注 / 屏蔽用户** — 在悬浮卡片中一键关注或屏蔽
- **标记用户** — 标记关注的用户，全站高亮其头像（自定义颜色）
- **管理列表** — 管理标记用户、屏蔽用户、忽略主题

#### 搜索 & 快捷操作

- **sov2ex 全文搜索** — 替换 V2EX 自带搜索为 sov2ex 全文搜索引擎
- **`/` 快捷键搜索** — 按 `/` 键快速聚焦搜索框（GitHub 风格）
- **右键菜单搜索** — 选中文字后右键使用 sov2ex 搜索
- **划词 Base64 解码** — 选中 Base64 编码文字自动解码并弹出结果
- **双击回顶部** — 双击页面任意位置快速回到顶部
- **快捷键支持** — 可自定义快捷键打开 V2EX / 查看消息

### 🛠 开发

本项目为纯原生 JavaScript 扩展（Manifest V3），无需构建工具，源码即扩展。

```bash
# 克隆仓库
git clone https://github.com/sciooga/v2ex-plus.git
```

**加载扩展：**

| 浏览器 | 步骤 |
|--------|------|
| Chrome | 打开 `chrome://extensions` → 开启「开发者模式」→ 「加载已解压的扩展程序」→ 选择项目根目录 |
| Firefox | 打开 `about:debugging#/runtime/this-firefox` → 「临时载入附加组件」→ 选择 `manifest.json` |
| Edge | 打开 `edge://extensions` → 开启「开发人员模式」→ 「加载解压缩的扩展」→ 选择项目根目录 |

### 📁 项目结构

```
v2ex-plus/
├── manifest.json             # 扩展清单 (Manifest V3)
├── background.js             # Service Worker 入口
├── background/
│   ├── checkin.js            # 自动签到
│   └── notifications.js      # 未读消息轮询 & 角标
├── inject/                   # 内容脚本
│   ├── base64decode.js       # 划词 Base64 解码
│   ├── dbclickToTop.js       # 双击回顶部
│   ├── sov2ex.js             # sov2ex 搜索 & "/" 快捷键
│   ├── topicList/            # 主题列表增强
│   ├── topicDetail/          # 主题详情增强
│   └── userinfo/             # 用户信息悬浮卡片
├── pages/
│   ├── options/              # 设置页面
│   └── manage/               # 管理页面（标记 / 屏蔽 / 忽略）
├── spider/                   # vDaily 数据采集
├── rules.json                # 微博图片 Referer 修复规则
└── COPYING                   # GPLv3 许可证
```

---

## English

### Installation

| Browser | Link |
|---------|------|
| Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/v2ex-plus/daeclijmnojoemooblcbfeeceopnkolo) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/v2ex-plus/) |
| Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/v2ex-plus/oejdifclmfffbginmbgndmkjbephefgd) |
| Offline | [GitHub Releases](https://github.com/sciooga/v2ex-plus/releases) |

### Features

#### Check-in & Notifications

- **Auto Check-in** — Automatically completes the daily check-in task with optional success notifications
- **Unread Message Badge** — Polls for unread messages and displays the count on the extension icon
- **Login Status Detection** — Grays out the icon with a `!` badge when not logged in

#### Topic List Enhancements

- **Topic Preview** — Inline preview of topic content without leaving the list page
- **Topic Ignore** — One-click to ignore uninteresting topics
- **Open in New Tab** — All topic links open in a new tab by default
- **vDaily Recommendations** — Sidebar shows trending topics and top-liked replies from vDaily

#### Topic Detail Enhancements

- **Nested Comments** — Automatically organizes @-replies into threaded conversations with optional auto-expand
- **Conversation View** — View the full conversation context between two users in a chat-like modal
- **Hover @-mention Preview** — Hover over an @-mention to see the user's most recent related reply
- **OP Reply Highlighting** — Customizable background color for original poster's replies
- **Reply Floor Numbers** — Auto-appends `#floor` when replying, making it easy to track
- **Emoji Picker** — Built-in emoji selector in the reply box
- **Imgur Image Upload** — Upload images via file picker, paste, or drag-and-drop to Imgur
- **Fold Long Content** — Auto-folds excessively long topics and replies with expand button
- **Page-turn Jump** — Skips past the topic body to replies when navigating to page 2+
- **Custom Thank Heart Color** — Personalize the color of thank-heart icons
- **Fade New Users** — Reduces opacity of replies from users registered less than 30 days
- **Fix Legacy Weibo Images** — Automatically fixes broken Weibo-hosted images in V2EX posts

#### User Features

- **User Info Hover Card** — Hover over any avatar to see detailed user info (join date, online status, bio, etc.)
- **Follow / Block User** — Follow or block users directly from the hover card
- **Mark User** — Mark users of interest with a customizable colored border on their avatar site-wide
- **Management Pages** — Manage marked users, blocked users, and ignored topics

#### Search & Shortcuts

- **sov2ex Full-text Search** — Replaces V2EX's built-in search with the sov2ex full-text search engine
- **`/` to Search** — Press `/` to focus the search box instantly (GitHub-style)
- **Context Menu Search** — Right-click selected text to search with sov2ex
- **Base64 Decode on Select** — Select Base64-encoded text to auto-decode with a floating popup
- **Double-click to Top** — Double-click anywhere to scroll back to the top
- **Keyboard Shortcuts** — Customizable shortcuts to open V2EX or view messages

### Development

This is a pure vanilla JavaScript extension (Manifest V3) with no build tools — the source code **is** the extension.

```bash
# Clone the repository
git clone https://github.com/sciooga/v2ex-plus.git
```

**Load the extension:**

| Browser | Steps |
|---------|-------|
| Chrome | Open `chrome://extensions` → Enable "Developer mode" → "Load unpacked" → Select project root |
| Firefox | Open `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → Select `manifest.json` |
| Edge | Open `edge://extensions` → Enable "Developer mode" → "Load unpacked" → Select project root |

### Project Structure

```
v2ex-plus/
├── manifest.json             # Extension manifest (Manifest V3)
├── background.js             # Service worker entry point
├── background/
│   ├── checkin.js            # Auto check-in logic
│   └── notifications.js      # Unread message polling & badge
├── inject/                   # Content scripts
│   ├── base64decode.js       # Select-to-decode Base64
│   ├── dbclickToTop.js       # Double-click to scroll to top
│   ├── sov2ex.js             # sov2ex search & "/" shortcut
│   ├── topicList/            # Topic list enhancements
│   ├── topicDetail/          # Topic detail enhancements
│   └── userinfo/             # User info hover card
├── pages/
│   ├── options/              # Settings page
│   └── manage/               # Management (mark / block / ignore)
├── spider/                   # vDaily data collection
├── rules.json                # Weibo image referer fix rule
└── COPYING                   # GPLv3 license
```

---

## Tech Stack

| | |
|---|---|
| Language | Vanilla JavaScript (ES2017+) |
| Styling | Plain CSS |
| Manifest | Chrome Extension Manifest V3 |
| Build Tools | None — source is the distributable |
| CI/CD | GitHub Actions (Chrome Web Store, Firefox Add-ons, Edge Add-ons) |
| License | [GPLv3](./COPYING) |

## Credits

- [GPU](https://www.v2ex.com/member/GPU) — Co-maintainer & extension publishing
- [Sheep](http://sheephe.com) — Logo design
- All contributors who submitted code, feedback, and helped with testing

## License

```
Copyright (C) 2017-2020 v2ex-plus contributors
https://github.com/sciooga/v2ex-plus/graphs/contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```
