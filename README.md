# 🚀 High-Performance Verified Proxy Pool

An automated, ultra-fast proxy collector and validator running 24/7. This repository hosts pre-verified, active public proxy lists categorized by protocol, optimized for web scraping, anonymity, and integration.

---

## 📊 Live Pool Statistics

<div align="center">

![Working Proxies](https://img.shields.io/badge/Verified%20Working-813-success?style=for-the-badge&logo=shield)
![Total Checked](https://img.shields.io/badge/Total%20Checked-104347-blue?style=for-the-badge&logo=speedtest)
![Last Updated](https://img.shields.io/badge/Last%20Update-24.05.2026%2016:27:30-informational?style=for-the-badge&logo=clock)

</div>

### Protocol Distribution
| Protocol | Active Count | Raw Access Link |
| :--- | :---: | :--- |
| **🌐 HTTP / HTTPS** | `247` | [http.txt](https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt) |
| **🛡️ SOCKS4** | `71` | [socks4.txt](https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt) |
| **🔒 SOCKS5** | `495` | [socks5.txt](https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt) |
| **📦 All Combined** | `813` | [working_proxies.txt](https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt) |

### Performance Overview
- **Deduplication Audit Rate:** 100% Unique Addresses
- **Current Success Verification Rate:** `0.78%`
- **Validation Protocol:** Full HTTP Request/Response Round-trip check.

---

## 🛠️ Automated & Machine Integration (API)

These lists are optimized for automated scripts, CI/CD pipelines, and applications. You can access the live lists programmatically through raw HTTP or GitHub's REST API.

### 1. Direct Download (Raw CLI)
Use these simple shell commands to dynamically integrate the proxy lists directly into your servers:

```bash
# Download all working proxies
curl -o proxies.txt https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt

# Download categorized lists
curl -o http_proxies.txt https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt
curl -o socks4_proxies.txt https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt
curl -o socks5_proxies.txt https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt
```

### 2. Python Programmatic Fetch
You can quickly parse the lists in Python using the standard `urllib` or `requests`:

```python
import urllib.request

# Base URL for raw access
base_url = "https://raw.githubusercontent.com/stormsia/proxy-list/main"

# Fetch and print active proxies for each protocol
for protocol in ["http", "socks4", "socks5"]:
    url = f"{base_url}/{protocol}.txt"
    try:
        with urllib.request.urlopen(url) as response:
            proxies = response.read().decode('utf-8').splitlines()
        print(f"Loaded {len(proxies)} active {protocol.upper()} proxies.")
    except Exception as e:
        print(f"Failed to fetch {protocol} list: {e}")
```

### 3. GitHub API Machine Endpoint
If your system integrates via GitHub API, fetch the file metadata and Base64 content using:
```http
GET https://api.github.com/repos/stormsia/proxy-list/contents/working_proxies.txt
Accept: application/vnd.github.v3+json
```



## ⚠️ Disclaimer
These proxies are gathered from public directories. We do not host, control, or monitor proxy servers. Use at your own risk.

**MIT License**
