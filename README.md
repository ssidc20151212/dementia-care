# 认知症照护专区独立项目

这是从 `tian-main` 首页认知症照护专区复制出来的独立静态项目。

## 本地预览

在当前目录运行：

```powershell
python -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/`。

项目包含截图中的 13 个工具入口、对应的照护工具页面，以及补齐的 `NPI-NH评估` 页面。各工具的记录默认保存在当前浏览器的 `localStorage` 中。

## 绑定域名

本项目已添加 GitHub Pages 自定义域名文件：

```text
ad.ssidc.org.cn
```

DNS 需要添加一条 CNAME 记录：主机记录 `ad`，记录值指向 GitHub Pages 仓库对应地址，例如 `ssidc20151212.github.io`。

2026-08-18 本地查询结果：`ad.ssidc.org.cn` 暂无 DNS 记录。

原项目 `tian-main` 未修改。当前目录尚未绑定或推送到新的 GitHub 仓库。
