# 🚀 High-Performance Verified Proxy Pool

An automated, ultra-fast proxy collector and validator running 24/7. This repository hosts pre-verified, active public proxy lists categorized by protocol, optimized for web scraping, anonymity, and integration.

---

## 📊 Live Pool Statistics

<div align="center">

![Working Proxies](https://img.shields.io/badge/Verified%20Working-0-success?style=for-the-badge&logo=shield)
![Total Checked](https://img.shields.io/badge/Total%20Checked-0-blue?style=for-the-badge&logo=speedtest)
![Last Updated](https://img.shields.io/badge/Last%20Update-24.05.2026%2014:15:02-informational?style=for-the-badge&logo=clock)

</div>

### Protocol Distribution
| Protocol | Active Count | Raw Access Link |
| :--- | :---: | :--- |
| **🌐 HTTP / HTTPS** | `0` | [http.txt](https://raw.githubusercontent.com/stormsia/proxy_list/main/http.txt) |
| **🛡️ SOCKS4** | `0` | [socks4.txt](https://raw.githubusercontent.com/stormsia/proxy_list/main/socks4.txt) |
| **🔒 SOCKS5** | `0` | [socks5.txt](https://raw.githubusercontent.com/stormsia/proxy_list/main/socks5.txt) |
| **📦 All Combined** | `0` | [working_proxies.txt](https://raw.githubusercontent.com/stormsia/proxy_list/main/working_proxies.txt) |

### Performance Overview
- **Deduplication Audit Rate:** 100% Unique Addresses
- **Current Success Verification Rate:** `0.0%`
- **Validation Protocol:** Full HTTP Request/Response Round-trip check.

---

## 🛠️ Automated & Machine Integration (API)

These lists are optimized for automated scripts, CI/CD pipelines, and applications. You can access the live lists programmatically through raw HTTP or GitHub's REST API.

### 1. Direct Download (Raw CLI)
Use these simple shell commands to dynamically integrate the proxy lists directly into your servers:

```bash
# Download all working proxies
curl -o proxies.txt https://raw.githubusercontent.com/stormsia/proxy_list/main/working_proxies.txt

# Download categorized lists
curl -o http_proxies.txt https://raw.githubusercontent.com/stormsia/proxy_list/main/http.txt
curl -o socks5_proxies.txt https://raw.githubusercontent.com/stormsia/proxy_list/main/socks5.txt
```

### 2. Python Programmatic Fetch
You can quickly parse the lists in Python using the standard `urllib` or `requests`:

```python
import urllib.request

# Fetch and split the active SOCKS5 proxy list
url = "https://raw.githubusercontent.com/stormsia/proxy_list/main/socks5.txt"
with urllib.request.urlopen(url) as response:
    proxies = response.read().decode('utf-8').splitlines()

print(f"Loaded {len(proxies)} active SOCKS5 proxies.")
```

### 3. GitHub API Machine Endpoint
If your system integrates via GitHub API, fetch the file metadata and Base64 content using:
```http
GET https://api.github.com/repos/stormsia/proxy_list/contents/working_proxies.txt
Accept: application/vnd.github.v3+json
```

---

## ⚡ Setup and Architecture

This project is built for extreme speed and scalability:
1. **Scraping Layer (Python):** Gathers, deduplicates, and manages proxy lists asynchronously via database.
2. **Database Layer (SQLite + WAL):** High-speed concurrent transaction engine.
3. **Checking Engine (Rust):** Blazing-fast external multi-threaded validation checker.
4. **Publishing Layer:** Automatic formatting, splitting, and uploading to GitHub every 15 minutes.

### Docker Compose Quickstart
To host your own checker and publisher:
```bash
# Start the container in detached mode
docker compose up -d --build
```

---

## ⚠️ Disclaimer
These proxies are gathered from public directories. We do not host, control, or monitor proxy servers. Use at your own risk.

**MIT License** • Automated Update Loop: 15 minutes.
