# ⚡ Список бесплатных рабочих прокси (HTTP, SOCKS4, SOCKS5) — Обновление каждую минуту

<div align="center">

[**English**](README.md) • [**Русский**](README.ru.md) • [**简体中文**](README.zh.md)

### *Сверхбыстрый публичный пул прокси без мертвых нод, проверяемый 24/7 движком Hydra.*


<!-- Row 1: Repository Lifecycle & Engine Status (All 20px flat-square) -->
[![Last Update](https://img.shields.io/badge/Last%20Update-2026--11--26%2000%3A59%20UTC-10b981?style=flat-square&logo=clockify&logoColor=white)](https://github.com/stormsia/proxy-list/commits/main)
[![Update Frequency](https://img.shields.io/badge/Цикл%20обновления-Каждую%20минуту-0284c7?style=flat-square&logo=clockify&logoColor=white)](#-system-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-d97706?style=flat-square&logo=open-source-initiative&logoColor=white)](LICENSE)
[![Proxies Checked by Hydra](https://raw.githubusercontent.com/stormsia/hydra/main/assets/badges/proxies-checked-by-hydra.svg)](https://github.com/stormsia/hydra)

<br/>

<!-- Row 2: Live Proxy Inventory & Protocol Breakdown (All 20px flat-square) -->
[![Total Active](https://img.shields.io/badge/Total%20Active-884%20Nodes-10b981?style=flat-square)](working_proxies.txt)
[![HTTP / HTTPS](https://img.shields.io/badge/HTTP%20%2F%20HTTPS-428-3b82f6?style=flat-square)](http.txt)
[![SOCKS4](https://img.shields.io/badge/SOCKS4-0-8b5cf6?style=flat-square)](socks4.txt)
[![SOCKS5](https://img.shields.io/badge/SOCKS5-456-ec4899?style=flat-square)](socks5.txt)
[![Proxies by Hydra](https://raw.githubusercontent.com/stormsia/hydra/main/assets/badges/proxies-by-hydra-pill-20.svg)](https://github.com/stormsia/hydra)

<br/>

[**Verified with Hydra**](#-verified-with-hydra) • [**Raw Endpoints**](#-direct-raw-endpoints) • [**Quickstart**](#-quickstart--download-guides) • [**JSON Schema**](#-json-dataset-schema-dataproxiesjson) • [**Architecture**](#-system-architecture) • [**Contributing**](#-contributing) • [**License**](#-license)

</div>

---

Высокопроизводительный, непрерывно тестируемый open-source пул прокси, созданный для веб-скрейперов, ботов автоматизации, исследователей безопасности и разработчиков. Каждую минуту наш автоматический демон собирает кандидатов в прокси и прогоняет их через строгую многоэтапную проверку сокетов и протоколов.

Все списки публикуются в виде прямых текстовых файлов и обогащенного JSON через глобальный CDN GitHub — **100% бесплатно, без авторизации, без API-ключей и без лимитов**.

---

## ⚡ Проверено с помощью Hydra

Все прокси в этом репозитории непрерывно проверяются и валидируются [**Hydra**](https://github.com/stormsia/hydra) — сверхбыстрым асинхронным движком валидации и управления жизненным циклом прокси на Rust.

<div align="center">

[![Proxies Checked by Hydra](https://raw.githubusercontent.com/stormsia/hydra/main/assets/badges/proxies-checked-by-hydra.svg)](https://github.com/stormsia/hydra)

*Непрерывный аудит здоровья сокетов и протоколов*

<br/>

<img src="assets/telemetry-overview.svg?t=1795654776" alt="Live Hydra Proxy Pool Telemetry" width="100%" />

<br/>

*Телеметрия пересчитывается и визуализируется в каждом цикле проверки напрямую из данных движка Hydra.*

</div>


> [!IMPORTANT]
> **Гарантия актуальности:** Каждый опубликованный в этом репозитории прокси подтвержден как активный в рамках последнего 1-минутного цикла проверки. Мы никогда не накручиваем счетчики мертвыми или неотвечающими IP-адресами.

<details>
<summary><b>📈 Детальные квантили задержки и географическое распределение (Нажмите, чтобы раскрыть)</b></summary>

<br/>

### Распределение задержки (RTT)
```mermaid
xychart-beta
    title "Распределение задержки RTT по активным нодам"
    x-axis ["< 2с (Быстрые)", "2с - 5с (Норма)", "5с - 10с (Высокая)", "> 10с (Очередь)"]
    y-axis "Количество нод" 0 --> 450
    bar [348, 303, 198, 35]
```

### Топ географических локаций
| Страна | Код | Доля | Ноды | Основные протоколы |
| :--- | :---: | :--- | :---: | :--- |
| **Соединенные Штаты** | `US` | `██░░░░░░░░░░░░░░░░` 11.2% | 99 | HTTP, SOCKS5 |
| **Швейцария** | `CH` | `██░░░░░░░░░░░░░░░░` 9.6% | 85 | HTTP |
| **Вьетнам** | `VN` | `█░░░░░░░░░░░░░░░░░` 6.9% | 61 | HTTP, SOCKS5 |
| **Россия** | `RU` | `█░░░░░░░░░░░░░░░░░` 5.2% | 46 | HTTP, SOCKS5 |
| **Сингапур** | `SG` | `█░░░░░░░░░░░░░░░░░` 4.8% | 42 | HTTP, SOCKS5 |
| **Турция** | `TR` | `█░░░░░░░░░░░░░░░░░` 4.0% | 35 | HTTP, SOCKS5 |
</details>

---

## 📡 Прямые RAW ссылки

Используйте эти прямые CDN-ссылки в ваших скрейперах, CLI-скриптах автоматизации, пайплайнах CI/CD и микросервисах для мгновенного доступа:

| Протокол / Датасет | Формат | Активных | Пример строки | Назначение | Прямая ссылка CDN | Локальный файл |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **🌐 HTTP / HTTPS** | `URI` | `428 nodes` | `http://128.140.113.110:5153` | Веб-скрейперы, cURL, REST API | [**Скачать RAW**](https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt) | [`http.txt`](http.txt) |
| **🛡️ SOCKS4** | `URI` | `0 nodes` | `socks4://host:port` | Маршрутизация TCP, обход фаерволов | [**Скачать RAW**](https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt) | [`socks4.txt`](socks4.txt) |
| **🔒 SOCKS5** | `URI` | `456 nodes` | `socks5://176.65.132.138:1080` | Клиенты высокой анонимности, UDP/TCP туннелирование | [**Скачать RAW**](https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt) | [`socks5.txt`](socks5.txt) |
| **📦 All Combined** | `URI` | `884 nodes` | `protocol://host:port` | Ротаторы прокси, универсальные пулы | [**Скачать RAW**](https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt) | [`working_proxies.txt`](working_proxies.txt) |
| **🗺️ Enriched Telemetry** | `JSON` | `884 objects` | `[{"ip":"...","country":"DE",...}]` | Гео-маршрутизация, фильтрация по ASN и задержке | [**Скачать RAW**](https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json) | [`data/proxies.json`](data/proxies.json) |

> [!NOTE]
> Если прокси из файлов `http.txt`, `socks5.txt` или `working_proxies.txt` содержит логин и пароль, она отдаётся в формате `protocol://user:password@host:port`, а не `protocol://host:port`.

> [!TIP]
> Нужны структурированные метаданные, такие как **код страны**, **организация/ASN**, **уровень анонимности Elite** и **метрики миллисекундной задержки**? Используйте [`data/proxies.json`](https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json) для программной фильтрации нод перед отправкой трафика.

---

## 🚀 Быстрый старт и примеры интеграции

Примеры интеграции для использования текстовых списков и структурированного JSON в популярных языках и средах. Все эндпоинты поддерживают прямой HTTP `GET` без авторизации, API-ключей или сложной конфигурации.

---

### 🐚 Примеры для Bash и cURL

```bash
# 1. Скачать полный список проверенных активных прокси в локальный файл
curl -sSfL "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt" -o working_proxies.txt

# 2. Выбрать случайный HTTP-прокси и отправить через него запрос
RANDOM_HTTP=$(curl -sSfL "https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt" | shuf -n 1)
echo "Тестирование HTTP: ${RANDOM_HTTP}"
curl -s --connect-timeout 5 -x "${RANDOM_HTTP}" https://httpbin.org/ip

# 3. Выбрать случайный SOCKS5-прокси и отправить запрос (с удаленным DNS-резолвингом)
RANDOM_SOCKS5=$(curl -sSfL "https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt" | shuf -n 1)
echo "Тестирование SOCKS5: ${RANDOM_SOCKS5}"
curl -s --connect-timeout 5 -x "${RANDOM_SOCKS5}" https://httpbin.org/ip

# 4. Потоковая фильтрация JSON датасета через jq (SOCKS5, задержка < 500 мс)
curl -sSfL "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json" | \
  jq -r '.[] | select(.protocol == "socks5" and .rtt_total_ms != null and .rtt_total_ms < 500) | .url'
```

---

<details open>
<summary><b>🐍 Python (Requests, Httpx Async & JSON Filtering)</b></summary>

#### A. Standard HTTP Rotation (`requests` — Zero External Dependencies)
```python
import random
import requests

# Use http.txt for native, zero-dependency HTTP/HTTPS CONNECT routing
ENDPOINT = "https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt"

resp = requests.get(ENDPOINT, timeout=10)
resp.raise_for_status()

proxies = [line.strip() for line in resp.text.splitlines() if line.strip()]
selected = random.choice(proxies)
print(f"Routing through: {selected}")

# Standard HTTP proxy routing
origin = requests.get(
    "https://httpbin.org/ip",
    proxies={"http": selected, "https": selected},
    timeout=5,
).json()
print("Egress IP:", origin)
```
> **Примечание для SOCKS5:** Для маршрутизации через SOCKS-прокси в библиотеке `requests` установите PySocks (`pip install "requests[socks]"`) и используйте схему `socks5h://`, чтобы DNS-запросы разрешались удаленно на стороне прокси-сервера.

#### B. Asynchronous Concurrent Verification (`httpx` + `asyncio`)
```python
import asyncio
import httpx

HTTP_LIST_URL = "https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt"

async def test_node(client: httpx.AsyncClient, proxy_url: str):
    try:
        async with httpx.AsyncClient(proxy=proxy_url, timeout=5.0) as p_client:
            res = await p_client.get("https://httpbin.org/ip")
            if res.status_code == 200:
                return proxy_url, res.json().get("origin")
    except Exception:
        pass
    return proxy_url, None

async def main():
    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(HTTP_LIST_URL)
        res.raise_for_status()
        proxies = [line.strip() for line in res.text.splitlines() if line.strip()]

    # Validate first 5 nodes concurrently
    tasks = [test_node(client, p) for p in proxies[:5]]
    results = await asyncio.gather(*tasks)

    for proxy, origin in results:
        status = f"ONLINE (Egress: {origin})" if origin else "UNREACHABLE"
        print(f"[{status}] {proxy}")

if __name__ == "__main__":
    asyncio.run(main())
```

#### C. Rich JSON Ingestion & Strict Attribute Filtering
```python
import requests

JSON_URL = "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json"
dataset = requests.get(JSON_URL, timeout=15).json()

# Filter: SOCKS5, Elite Anonymity, Measured Latency < 600ms, Uptime >= 80%
qualified = [
    p for p in dataset
    if p.get("protocol") == "socks5"
    and p.get("anon") == "elite"
    and p.get("rtt_total_ms") is not None
    and p["rtt_total_ms"] < 600
    and (p.get("uptime_pct") or 0.0) >= 80.0
]

print(f"Discovered {len(qualified)} qualified SOCKS5 nodes:")
for node in qualified[:5]:
    print(f"  {node['url']} | Country: {node['country']} | RTT: {node['rtt_total_ms']}ms")
```
</details>

---

<details>
<summary><b>🟨 JavaScript / TypeScript / Node.js (Native Fetch, Node 18+)</b></summary>

```typescript
interface ProxyRecord {
  id: string;
  ip: string;
  port: number;
  url: string;
  protocol: "http" | "socks4" | "socks5";
  has_auth: boolean;
  auth_user: string | null;
  auth_pass: string | null;
  state: "alive" | "cold_queue" | "cooldown" | "dead_permanent";
  supports_https: boolean;
  out_ip: string | null;
  country: string | null;
  asn: number | null;
  asn_org: string | null;
  anon: "transparent" | "anonymous" | "elite" | null;
  rtt_tcp_ms: number | null;
  rtt_handshake_ms: number | null;
  rtt_total_ms: number | null;
  uptime_pct: number | null;
  stability_pct: number | null;
  stability_window_min: number;
  checks_total: number;
  checks_success: number;
  dead_strikes: number;
  last_error: string | null;
  remark: string | null;
  first_seen_at: number;
  last_checked_at: number;
  next_check_at: number;
}

const TXT_URL = "https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt";
const JSON_URL = "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json";

// 1. Fetch text list (Node 18+ native fetch, zero dependencies)
async function fetchRawList(): Promise<string[]> {
  const res = await fetch(TXT_URL, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const text = await res.text();
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

// 2. Fetch and filter typed JSON feed
async function fetchHighSlaProxies(): Promise<ProxyRecord[]> {
  const res = await fetch(JSON_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const feed = (await res.json()) as ProxyRecord[];

  return feed.filter(
    (node) =>
      node.state === "alive" &&
      node.rtt_total_ms !== null &&
      node.rtt_total_ms < 500 &&
      (node.uptime_pct ?? 0) >= 90
  );
}

async function run() {
  const lines = await fetchRawList();
  console.log(`Loaded ${lines.length} HTTP proxies.`);

  const nodes = await fetchHighSlaProxies();
  console.log(`Matched ${nodes.length} sub-500ms nodes with >=90% uptime.`);
}

run().catch(console.error);
```
</details>

---

<details>
<summary><b>🔷 Go (Golang)</b></summary>

```go
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type ProxyRecord struct {
	ID                 string   `json:"id"`
	IP                 string   `json:"ip"`
	Port               int      `json:"port"`
	URL                string   `json:"url"`
	Protocol           string   `json:"protocol"`
	HasAuth            bool     `json:"has_auth"`
	AuthUser           *string  `json:"auth_user"`
	AuthPass           *string  `json:"auth_pass"`
	State              string   `json:"state"`
	SupportsHTTPS      bool     `json:"supports_https"`
	OutIP              *string  `json:"out_ip"`
	Country            *string  `json:"country"`
	ASN                *int     `json:"asn"`
	ASNOrg             *string  `json:"asn_org"`
	Anon               *string  `json:"anon"`
	RTTTotalMs         *int     `json:"rtt_total_ms"`
	UptimePct          *float64 `json:"uptime_pct"`
	StabilityPct       *float64 `json:"stability_pct"`
	StabilityWindowMin int      `json:"stability_window_min"`
	ChecksTotal        int      `json:"checks_total"`
	ChecksSuccess      int      `json:"checks_success"`
	DeadStrikes        int      `json:"dead_strikes"`
	LastError          *string  `json:"last_error"`
	Remark             *string  `json:"remark"`
	FirstSeenAt        int64    `json:"first_seen_at"`
	LastCheckedAt      int64    `json:"last_checked_at"`
	NextCheckAt        int64    `json:"next_check_at"`
}

func main() {
	client := &http.Client{Timeout: 15 * time.Second}

	// 1. Ingest Raw TXT
	txtURL := "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt"
	resp, err := client.Get(txtURL)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		panic(fmt.Sprintf("TXT fetch failed: HTTP %d", resp.StatusCode))
	}

	var rawLines []string
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		if line := scanner.Text(); line != "" {
			rawLines = append(rawLines, line)
		}
	}
	fmt.Printf("Loaded %d raw proxy lines.\n", len(rawLines))

	// 2. Ingest Rich JSON with Nullable Fields
	jsonURL := "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json"
	jsonResp, err := client.Get(jsonURL)
	if err != nil {
		panic(err)
	}
	defer jsonResp.Body.Close()

	if jsonResp.StatusCode != http.StatusOK {
		panic(fmt.Sprintf("JSON fetch failed: HTTP %d", jsonResp.StatusCode))
	}

	var dataset []ProxyRecord
	if err := json.NewDecoder(jsonResp.Body).Decode(&dataset); err != nil {
		panic(err)
	}

	var fastAlive []ProxyRecord
	for _, p := range dataset {
		if p.State == "alive" && p.Protocol == "socks5" && p.RTTTotalMs != nil && *p.RTTTotalMs < 500 {
			fastAlive = append(fastAlive, p)
		}
	}
	fmt.Printf("Filtered %d alive SOCKS5 nodes with latency < 500ms.\n", len(fastAlive))
}
```
</details>

---

<details>
<summary><b>🦀 Rust (Reqwest + Tokio + Serde)</b></summary>

```rust
use reqwest::Client;
use serde::Deserialize;
use std::time::Duration;

#[derive(Debug, Deserialize)]
pub struct ProxyRecord {
    pub id: String,
    pub ip: String,
    pub port: u16,
    pub url: String,
    pub protocol: String,
    pub has_auth: bool,
    pub auth_user: Option<String>,
    pub auth_pass: Option<String>,
    pub state: String,
    pub supports_https: bool,
    pub out_ip: Option<String>,
    pub country: Option<String>,
    pub asn: Option<u32>,
    pub asn_org: Option<String>,
    pub anon: Option<String>,
    pub rtt_tcp_ms: Option<u32>,
    pub rtt_handshake_ms: Option<u32>,
    pub rtt_total_ms: Option<u32>,
    pub uptime_pct: Option<f64>,
    pub stability_pct: Option<f64>,
    pub stability_window_min: u32,
    pub checks_total: u64,
    pub checks_success: u64,
    pub dead_strikes: u32,
    pub last_error: Option<String>,
    pub remark: Option<String>,
    pub first_seen_at: i64,
    pub last_checked_at: i64,
    pub next_check_at: i64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .timeout(Duration::from_secs(15))
        .build()?;

    // 1. Fetch & Deserialize JSON dataset
    let json_url = "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json";
    let records: Vec<ProxyRecord> = client
        .get(json_url)
        .send()
        .await?
        .error_for_status()?
        .json()
        .await?;

    let fast_nodes: Vec<&ProxyRecord> = records
        .iter()
        .filter(|p| p.state == "alive" && p.rtt_total_ms.is_some_and(|rtt| rtt < 500))
        .collect();

    println!("Total nodes: {}, Low latency (<500ms): {}", records.len(), fast_nodes.len());

    // 2. Example: Route traffic through chosen proxy
    if let Some(target) = fast_nodes.first() {
        println!("Routing verification request via: {}", target.url);
        let proxy = reqwest::Proxy::all(&target.url)?;
        let routed_client = Client::builder()
            .proxy(proxy)
            .timeout(Duration::from_secs(5))
            .build()?;

        let origin = routed_client
            .get("https://httpbin.org/ip")
            .send()
            .await?
            .text()
            .await?;
        println!("Egress echo: {}", origin.trim());
    }

    Ok(())
}
```
</details>

---

<details>
<summary><b>🐘 PHP (Native cURL Routing & JSON Decoder)</b></summary>

```php
<?php
declare(strict_types=1);

function httpGet(string $url): string {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT      => 'ProxyEngineClient/1.0',
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false || $status !== 200) {
        throw new RuntimeException("HTTP Request failed with status: {$status}");
    }
    return $body;
}

// 1. Ingest Plain Text
$txtUrl = 'https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt';
$rawLines = array_filter(array_map('trim', explode("\n", httpGet($txtUrl))));
echo "Loaded " . count($rawLines) . " HTTP proxy endpoints.\n";

// 2. Ingest Rich JSON
$jsonUrl = 'https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json';
$dataset = json_decode(httpGet($jsonUrl), true, 512, JSON_THROW_ON_ERROR);

$fastNodes = array_filter($dataset, function (array $item): bool {
    return ($item['state'] ?? '') === 'alive'
        && isset($item['rtt_total_ms'])
        && $item['rtt_total_ms'] < 500;
});
echo "Found " . count($fastNodes) . " low-latency proxies in JSON feed.\n";

// 3. Route request through first proxy
if (!empty($rawLines)) {
    $targetProxy = reset($rawLines);
    $ch = curl_init('https://httpbin.org/ip');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_PROXY          => $targetProxy,
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    echo "Echo Response: " . ($result !== false ? $result : "Failed") . "\n";
}
```
</details>

---

<details>
<summary><b>🔷 C# / .NET (HttpClient & SocketsHttpHandler)</b></summary>

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public sealed class ProxyRecord
{
    [JsonPropertyName("id")] public string Id { get; set; } = string.Empty;
    [JsonPropertyName("ip")] public string Ip { get; set; } = string.Empty;
    [JsonPropertyName("port")] public int Port { get; set; }
    [JsonPropertyName("url")] public string Url { get; set; } = string.Empty;
    [JsonPropertyName("protocol")] public string Protocol { get; set; } = string.Empty;
    [JsonPropertyName("has_auth")] public bool HasAuth { get; set; }
    [JsonPropertyName("auth_user")] public string? AuthUser { get; set; }
    [JsonPropertyName("auth_pass")] public string? AuthPass { get; set; }
    [JsonPropertyName("state")] public string State { get; set; } = string.Empty;
    [JsonPropertyName("supports_https")] public bool SupportsHttps { get; set; }
    [JsonPropertyName("out_ip")] public string? OutIp { get; set; }
    [JsonPropertyName("country")] public string? Country { get; set; }
    [JsonPropertyName("asn")] public int? Asn { get; set; }
    [JsonPropertyName("asn_org")] public string? AsnOrg { get; set; }
    [JsonPropertyName("anon")] public string? Anon { get; set; }
    [JsonPropertyName("rtt_total_ms")] public int? RttTotalMs { get; set; }
    [JsonPropertyName("uptime_pct")] public double? UptimePct { get; set; }
    [JsonPropertyName("first_seen_at")] public long FirstSeenAt { get; set; }
    [JsonPropertyName("last_checked_at")] public long LastCheckedAt { get; set; }
}

public static class Program
{
    private static readonly HttpClient HttpClient = new() { Timeout = TimeSpan.FromSeconds(15) };

    public static async Task Main()
    {
        string jsonUrl = "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json";
        using var response = await HttpClient.GetAsync(jsonUrl);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync();
        var dataset = await JsonSerializer.DeserializeAsync<List<ProxyRecord>>(stream);

        var fastSocks = dataset?
            .Where(p => p.State == "alive" && p.Protocol == "socks5" && p.RttTotalMs is < 500)
            .OrderBy(p => p.RttTotalMs)
            .ToList();

        Console.WriteLine($"Discovered {fastSocks?.Count ?? 0} low-latency SOCKS5 nodes.");

        // Native proxy routing in modern .NET 6+
        if (fastSocks != null && fastSocks.Count > 0)
        {
            var target = fastSocks[0];
            var handler = new SocketsHttpHandler
            {
                Proxy = new WebProxy(target.Url),
                ConnectTimeout = TimeSpan.FromSeconds(5)
            };
            using var routedClient = new HttpClient(handler);
            var ip = await routedClient.GetStringAsync("https://httpbin.org/ip");
            Console.WriteLine($"Egress verified: {ip.Trim()}");
        }
    }
}
```
</details>

---

<details>
<summary><b>💻 PowerShell (Windows & Core)</b></summary>

```powershell
# 1. Download raw list directly to disk
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt" -OutFile "proxies.txt"

# 2. Fetch and parse JSON directly into PowerShell objects
$proxies = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json" -TimeoutSec 15

# 3. Filter for low-latency SOCKS5 nodes (strict null guard against $null -lt 500 bug)
$fastSocks = $proxies | Where-Object {
    $_.protocol -eq "socks5" -and 
    $_.state -eq "alive" -and 
    $null -ne $_.rtt_total_ms -and 
    $_.rtt_total_ms -lt 500
}

Write-Host "Discovered $($fastSocks.Count) low-latency SOCKS5 proxies."
$fastSocks | Select-Object -First 5 -Property url, country, rtt_total_ms, uptime_pct | Format-Table -AutoSize

# 4. Test execution through an HTTP proxy
$httpNode = $proxies | Where-Object { $_.protocol -eq "http" -and $null -ne $_.rtt_total_ms } | Select-Object -First 1
if ($httpNode) {
    Write-Host "Verifying HTTP proxy: $($httpNode.url)"
    Invoke-RestMethod -Uri "https://httpbin.org/ip" -Proxy $httpNode.url -TimeoutSec 5
}
```
</details>

---

## 📋 JSON Dataset Schema (`data/proxies.json`)

The rich JSON dataset published at [`data/proxies.json`](https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json) is generated directly by the [Hydra proxy engine](https://github.com/stormsia/hydra) and conforms to its REST API specification.

### 🔍 Field Specification

| Field Name | Type | Nullable | Example Value | Description & Constraints |
| :--- | :---: | :---: | :--- | :--- |
| `id` | `string` | No | `"46.232.249.209:40001:DE:"` | Unique deduplication key formatted as `ip:port` or `ip:port:user:pass`. |
| `ip` | `string` | No | `"46.232.249.209"` | Inbound IPv4 or IPv6 address of the proxy host. |
| `port` | `integer` | No | `40001` | Inbound TCP listening port (`1`–`65535`). |
| `url` | `string` | No | `"socks5://DE@46.232.249.209:40001"` | Canonical URI formatted for direct client consumption. Includes embedded credentials if required. |
| `protocol` | `string` | No | `"socks5"` | Network protocol: `"http"`, `"socks4"`, or `"socks5"`. |
| `has_auth` | `boolean` | No | `true` | Indicates whether the proxy mandates authentication. |
| `auth_user` | `string` | **Yes** | `"DE"` | Username credential. `null` if unauthenticated. |
| `auth_pass` | `string` | **Yes** | `null` | Password credential. `null` if unauthenticated or passwordless. |
| `state` | `string` | No | `"alive"` | Lifecycle state: `"alive"`, `"cold_queue"`, `"cooldown"`, `"dead_permanent"`. Published feeds contain only `"alive"`. |
| `supports_https`| `boolean` | No | `true` | For HTTP proxies: indicates HTTP CONNECT tunneling capability. Always `true` for SOCKS. |
| `out_ip` | `string` | **Yes** | `"104.28.193.121"` | Egress exit IP observed by destination echo judges. Supports dual-stack IPv4/IPv6 exit tracking. |
| `country` | `string` | **Yes** | `"DE"` | ISO 3166-1 alpha-2 two-letter country code. `null` if GeoIP resolution is unavailable. |
| `asn` | `integer` | **Yes** | `13335` | Autonomous System Number. `null` if unmapped. |
| `asn_org` | `string` | **Yes** | `"CLOUDFLARENET"` | Autonomous System Organization / ISP name. `null` if unmapped. |
| `anon` | `string` | **Yes** | `"anonymous"` | Anonymity tier: `"elite"` (no headers/IP leaked), `"anonymous"` (proxy detected, IP masked), `"transparent"` (real IP exposed), or `null`. |
| `rtt_tcp_ms` | `integer` | **Yes** | `47` | Round-trip latency for initial TCP 3-way handshake in milliseconds. |
| `rtt_handshake_ms`| `integer` | **Yes** | `1123` | Protocol negotiation duration (SOCKS greeting or TLS/CONNECT) in milliseconds. |
| `rtt_total_ms` | `integer` | **Yes** | `2066` | Full end-to-end request-response round-trip latency in milliseconds. Primary sorting key. |
| `uptime_pct` | `float` | **Yes** | `77.77778` | Lifetime percentage of successful health checks over the node's observed existence (`0.0`–`100.0`). |
| `stability_pct` | `float` | **Yes** | `66.66667` | Short-term reliability rating within the rolling inspection window (`0.0`–`100.0`). |
| `stability_window_min` | `integer` | No | `5` | Length of the rolling stability measurement window in minutes. |
| `checks_total` | `integer` | No | `36` | Cumulative total validation checks dispatched to this node. |
| `checks_success`| `integer` | No | `28` | Total successful validation checks completed. |
| `dead_strikes` | `integer` | No | `0` | Consecutive failed checks since last healthy response. Purged when threshold exceeded. |
| `last_error` | `string` | **Yes** | `null` | Detailed socket or protocol error string from the last failure, or `null`. |
| `remark` | `string` | **Yes** | `null` | Operational note or tagging metadata, or `null`. |
| `first_seen_at` | `integer` | No | `1795204391` | Unix epoch timestamp (seconds) when proxy was first indexed. |
| `last_checked_at`| `integer` | No | `1795210415` | Unix epoch timestamp (seconds) of the most recent validation check. |
| `next_check_at` | `integer` | No | `1795210475` | Unix epoch timestamp (seconds) of the next scheduled verification run. |

---

### 📦 Payload Sample (Real Engine Output)

```json
[
  {
    "id": "116.203.139.209:5678",
    "ip": "116.203.139.209",
    "port": 5678,
    "url": "http://116.203.139.209:5678",
    "protocol": "http",
    "has_auth": false,
    "auth_user": null,
    "auth_pass": null,
    "state": "alive",
    "supports_https": false,
    "out_ip": "2001:67c:e60:c0c:192:42:116:68",
    "country": "NL",
    "asn": 215125,
    "asn_org": "Church of Cyberology",
    "anon": "anonymous",
    "rtt_tcp_ms": 788,
    "rtt_handshake_ms": 0,
    "rtt_total_ms": 939,
    "uptime_pct": 38.68195,
    "stability_pct": 100.0,
    "stability_window_min": 5,
    "checks_total": 349,
    "checks_success": 135,
    "dead_strikes": 0,
    "last_error": null,
    "remark": null,
    "first_seen_at": 1795147277,
    "last_checked_at": 1795210445,
    "next_check_at": 1795210505
  },
  {
    "id": "46.232.249.209:40001:DE:",
    "ip": "46.232.249.209",
    "port": 40001,
    "url": "socks5://DE@46.232.249.209:40001",
    "protocol": "socks5",
    "has_auth": true,
    "auth_user": "DE",
    "auth_pass": null,
    "state": "alive",
    "supports_https": true,
    "out_ip": "104.28.193.121",
    "country": "DE",
    "asn": 13335,
    "asn_org": "CLOUDFLARENET",
    "anon": "anonymous",
    "rtt_tcp_ms": 47,
    "rtt_handshake_ms": 1123,
    "rtt_total_ms": 2066,
    "uptime_pct": 77.77778,
    "stability_pct": 66.66667,
    "stability_window_min": 5,
    "checks_total": 36,
    "checks_success": 28,
    "dead_strikes": 0,
    "last_error": null,
    "remark": null,
    "first_seen_at": 1795204391,
    "last_checked_at": 1795210415,
    "next_check_at": 1795210475
  }
]
```

---

## 🏗️ Архитектура системы

The harvesting, validation, and CDN deployment pipeline runs autonomously 24/7 without manual intervention:

```mermaid
flowchart TD
    subgraph INGESTION["1. Multi-Source Ingestion"]
        S1["🌐 Open Proxy Registries"]
        S2["📡 DHT & P2P Feeds"]
        S3["🔍 Community Scrapers"]
    end

    subgraph HYDRA["2. Hydra Verification Engine (Rust)"]
        H1["⚡ TCP SYN/ACK Connect<br/><code>Measure rtt_tcp_ms</code>"]
        H2["🔐 TLS / HTTP CONNECT Handshake<br/><code>Measure rtt_handshake_ms</code>"]
        H3["🎯 Multi-Judge Echo Cluster<br/><code>Detect Anonymity & Egress IP</code>"]
        H4["⚖️ Strict SLA Filtering<br/><code>Purge dead / latency > 3000ms</code>"]
    end

    subgraph SYNC["3. Automated Sync & CI/CD"]
        G1["⏰ Daemon Scheduler<br/><code>Runs Every Minute</code>"]
        G2["💾 Git Commit & Push<br/><code>Zero-Downtime Atomic Master Push</code>"]
    end

    subgraph DISTRIBUTION["4. Global Edge CDN Delivery"]
        D1["📄 Raw Plain-Text Endpoints<br/><code>http.txt</code> • <code>socks4.txt</code> • <code>socks5.txt</code>"]
        D2["📦 Unified Working Pool<br/><code>working_proxies.txt</code>"]
        D3["🗺️ Enriched Telemetry Dataset<br/><code>data/proxies.json</code>"]
    end

    subgraph CONSUMERS["5. Client Applications"]
        C1["🤖 Web Scrapers & Spiders"]
        C2["🛡️ Anonymity Gateways"]
        C3["⚙️ Production Bots & Microservices"]
    end

    INGESTION --> HYDRA
    H1 --> H2 --> H3 --> H4
    H4 -->|100% Verified Alive| SYNC
    G1 --> G2
    G2 --> DISTRIBUTION
    DISTRIBUTION --> CONSUMERS
```

---

## 🔍 Repository Topics

`proxy`, `proxies`, `proxy-list`, `free-proxy`, `free-proxy-list`, `free-proxies`, `working-proxies`, `public-proxy`, `public-proxies`, `socks5`, `socks5-proxy`, `http-proxy`, `https-proxy`, `socks4`, `socks4-proxy`, `proxy-pool`, `rotating-proxies`, `anonymous-proxy`, `proxy-scraper`, `web-scraping`

---

## 🤝 Участие в разработке

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for details on submitting new public proxy feeds or reporting issues.

---

## ⚠️ Disclaimer

> [!NOTE]
> All proxies in this list are aggregated from publicly reachable resources on the open internet and verified automatically by the Hydra engine for network reachability and latency.
> We do not operate, own, or inspect traffic routing through these third-party nodes. Always ensure compliance with your local laws, internal security policies, and the Terms of Service of any target destination before routing traffic through public proxies.

---

## 📄 Лицензия

This repository and its automated data feeds are open source under the [MIT License](LICENSE).

<div align="center">

Powered by high-concurrency Rust validation with [**Hydra**](https://github.com/stormsia/hydra)

</div>
