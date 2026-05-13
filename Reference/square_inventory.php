<?php

// ===== 設定 =====
define('SQUARE_ACCESS_TOKEN', 'EAAAl2JEjdtv33v46nNXCbFxFv4fomy1XAHZjAIw8xY2p08mEe_m-OdqxHomOrS9');
define('SQUARE_LOCATION_ID',  'L6Z9B2DG9SCVD');
define('SQUARE_API_BASE_URL', 'https://connect.squareupsandbox.com/v2');

// ===== API共通 =====
function squareRequest(string $method, string $endpoint, ?array $body = null): array {
    $ch = curl_init(SQUARE_API_BASE_URL . $endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_HTTPHEADER     => [
            'Square-Version: 2024-01-18',
            'Authorization: Bearer ' . SQUARE_ACCESS_TOKEN,
            'Content-Type: application/json',
        ],
    ]);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body ?? new stdClass()));
    }
    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) return ['__error' => 'cURL: ' . $curlError];
    $decoded = json_decode($response, true);
    if ($httpCode >= 400) return ['__error' => "HTTP {$httpCode}", '__details' => $decoded['errors'] ?? []];
    return $decoded;
}

// ===== データ取得 =====
function fetchInventoryData(): array {
    $catalogResult = squareRequest('GET', '/catalog/list?types=ITEM');
    if (isset($catalogResult['__error'])) {
        return ['error' => $catalogResult['__error'], 'details' => $catalogResult['__details'] ?? []];
    }

    $items        = $catalogResult['objects'] ?? [];
    $variationIds = [];
    $rows         = [];

    foreach ($items as $item) {
        if (($item['type'] ?? '') !== 'ITEM') continue;
        $itemData = $item['item_data'] ?? [];
        $name     = $itemData['name'] ?? '(名称不明)';

        foreach ($itemData['variations'] ?? [] as $variation) {
            $varId   = $variation['id'];
            $varData = $variation['item_variation_data'] ?? [];
            $varName = $varData['name'] ?? 'Regular';
            $price   = isset($varData['price_money'])
                       ? number_format($varData['price_money']['amount'] / 100) . ' ' . $varData['price_money']['currency']
                       : '—';

            $variationIds[] = $varId;
            $rows[$varId]   = [
                'item_name'      => $name,
                'variation_name' => $varName,
                'variation_id'   => $varId,
                'price'          => $price,
                'quantity'       => 0,
            ];
        }
    }

    if (!empty($variationIds)) {
        $invResult = squareRequest('POST', '/inventory/counts/batch-retrieve', [
            'catalog_object_ids' => $variationIds,
            'location_ids'       => [SQUARE_LOCATION_ID],
        ]);
        if (!isset($invResult['__error'])) {
            foreach ($invResult['counts'] ?? [] as $count) {
                $id = $count['catalog_object_id'];
                if (($count['state'] ?? '') === 'IN_STOCK' && isset($rows[$id])) {
                    $rows[$id]['quantity'] = (float)($count['quantity'] ?? 0);
                }
            }
        }
    }

    $rowList    = array_values($rows);
    $totalItems = count($items);
    $totalVars  = count($rows);
    $totalStock = array_sum(array_column($rowList, 'quantity'));
    $outOfStock = count(array_filter($rowList, fn($r) => $r['quantity'] <= 0));

    return [
        'rows'       => $rowList,
        'totalItems' => $totalItems,
        'totalVars'  => $totalVars,
        'totalStock' => $totalStock,
        'outOfStock' => $outOfStock,
        'fetchedAt'  => date('Y年m月d日 H:i:s'),
        'error'      => null,
    ];
}

// ===== JSONモード =====
if (isset($_GET['api'])) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(fetchInventoryData(), JSON_UNESCAPED_UNICODE);
    exit;
}

?><!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Square 在庫ダッシュボード</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0b0f1a;
    --surface:  #111827;
    --surface2: #1a2235;
    --border:   #1f2d45;
    --accent:   #00e5a0;
    --accent2:  #0099ff;
    --warn:     #ff9f43;
    --danger:   #ff4757;
    --text:     #e8eef8;
    --muted:    #6b7fa3;
    --mono:     'JetBrains Mono', monospace;
    --sans:     'Noto Sans JP', sans-serif;
    --display:  'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: .3;
    pointer-events: none;
    z-index: 0;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .orb1 {
    top: -180px; left: -180px;
    width: 560px; height: 560px;
    background: radial-gradient(circle, rgba(0,229,160,.08) 0%, transparent 70%);
  }
  .orb2 {
    bottom: -120px; right: -100px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(0,153,255,.07) 0%, transparent 70%);
  }

  .wrapper {
    position: relative; z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 60px;
  }

  /* ── header ── */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    padding: 36px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 36px;
  }

  .header-left { display: flex; align-items: center; gap: 16px; }

  .logo-badge {
    width: 46px; height: 46px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px;
    display: grid; place-items: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 0 24px rgba(0,229,160,.3);
  }

  h1 {
    font-family: var(--display);
    font-weight: 800;
    font-size: clamp(20px, 3vw, 26px);
    letter-spacing: -.5px;
    line-height: 1.1;
  }
  h1 small {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 400;
    color: var(--accent);
    letter-spacing: .1em;
    margin-top: 4px;
  }

  .header-right { display: flex; align-items: center; gap: 12px; }

  .location-chip {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 12px;
    letter-spacing: .05em;
  }
  .location-chip span { color: var(--accent2); }

  .btn-refresh {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--display);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: .04em;
    color: var(--bg);
    background: var(--accent);
    border: none; border-radius: 8px;
    padding: 9px 18px;
    cursor: pointer;
    transition: all .2s;
    box-shadow: 0 0 16px rgba(0,229,160,.25);
  }
  .btn-refresh:hover {
    background: #00ffb3;
    box-shadow: 0 0 28px rgba(0,229,160,.5);
    transform: translateY(-1px);
  }
  .btn-refresh:active { transform: translateY(0); }
  .btn-refresh:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .btn-refresh svg { transition: transform .5s; }
  .btn-refresh.loading svg { animation: spin .8s linear infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 24px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
    animation: fadeUp .4s ease both;
  }
  .stat-card:nth-child(2) { animation-delay: .05s; }
  .stat-card:nth-child(3) { animation-delay: .10s; }
  .stat-card:nth-child(4) { animation-delay: .15s; }
  .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0; transition: opacity .2s;
  }
  .stat-card:hover::before { opacity: 1; }

  .stat-label {
    font-family: var(--mono);
    font-size: 10px; letter-spacing: .12em;
    color: var(--muted); text-transform: uppercase;
    margin-bottom: 10px;
  }
  .stat-value {
    font-family: var(--display);
    font-size: 38px; font-weight: 800; line-height: 1;
    color: var(--text);
    transition: all .4s;
  }
  .stat-value.c-accent  { color: var(--accent); }
  .stat-value.c-accent2 { color: var(--accent2); }
  .stat-value.c-warn    { color: var(--warn); }
  .stat-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 34px; opacity: .1; }

  /* ── toolbar ── */
  .toolbar {
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    margin-bottom: 16px;
  }

  .search-wrap { position: relative; flex: 1; max-width: 340px; }
  .search-wrap svg {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--muted); pointer-events: none;
  }
  #searchInput {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px 9px 38px;
    color: var(--text);
    font-family: var(--sans); font-size: 14px;
    outline: none; transition: border-color .2s;
  }
  #searchInput:focus { border-color: var(--accent); }
  #searchInput::placeholder { color: var(--muted); }

  .filter-tabs { display: flex; gap: 6px; }
  .filter-tab {
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    letter-spacing: .06em;
    padding: 7px 14px; border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    cursor: pointer; transition: all .15s;
  }
  .filter-tab:hover { border-color: var(--accent); color: var(--accent); }
  .filter-tab.active { background: var(--accent); border-color: var(--accent); color: var(--bg); font-weight: 600; }

  /* ── table ── */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
  }

  table { width: 100%; border-collapse: collapse; }

  thead {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  th {
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); padding: 14px 20px;
    text-align: left; white-space: nowrap;
    cursor: pointer; user-select: none; transition: color .15s;
  }
  th:hover { color: var(--text); }
  th .sort-icon { margin-left: 4px; opacity: .4; font-style: normal; }
  th.sorted { color: var(--text); }
  th.sorted .sort-icon { opacity: 1; color: var(--accent); }

  tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background .15s;
    animation: fadeUp .3s ease both;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface2); }

  td { padding: 14px 20px; font-size: 14px; vertical-align: middle; }

  .td-name { font-weight: 500; }
  .td-var {
    font-family: var(--mono); font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px; padding: 3px 8px;
    display: inline-block;
  }
  .td-id { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: .03em; }
  .td-price { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--accent2); }

  .qty-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: var(--display); font-weight: 700; font-size: 15px;
    padding: 5px 13px; border-radius: 20px;
    min-width: 64px; justify-content: center;
  }
  .qty-badge.high   { background: rgba(0,229,160,.12);  color: var(--accent); }
  .qty-badge.medium { background: rgba(255,159,67,.12); color: var(--warn); }
  .qty-badge.zero   { background: rgba(255,71,87,.10);  color: var(--danger); }

  .qty-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .high   .qty-dot { background: var(--accent);  box-shadow: 0 0 6px var(--accent); }
  .medium .qty-dot { background: var(--warn);    box-shadow: 0 0 6px var(--warn); }
  .zero   .qty-dot { background: var(--danger);  box-shadow: 0 0 6px var(--danger); }

  /* ── states ── */
  .state-box { text-align: center; padding: 80px 24px; color: var(--muted); }
  .state-box .icon { font-size: 48px; margin-bottom: 16px; }
  .state-box p { font-size: 15px; }
  .state-box code {
    font-family: var(--mono); font-size: 12px; color: var(--danger);
    background: rgba(255,71,87,.08);
    padding: 8px 16px; border-radius: 6px;
    display: block; margin-top: 12px;
  }

  #loader {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    padding: 80px; color: var(--muted); font-family: var(--mono); font-size: 13px;
  }
  .spinner {
    width: 28px; height: 28px;
    border: 2px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin .7s linear infinite;
  }

  /* ── footer ── */
  footer {
    margin-top: 28px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
    font-family: var(--mono); font-size: 11px;
    color: var(--muted); letter-spacing: .05em;
  }
  .fetched-at { color: var(--accent); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .td-id, th:nth-child(4), td:nth-child(4) { display: none; }
    header { flex-direction: column; align-items: flex-start; }
  }
</style>
</head>
<body>
<div class="orb orb1"></div>
<div class="orb orb2"></div>

<div class="wrapper">
  <header>
    <div class="header-left">
      <div class="logo-badge">📦</div>
      <h1>
        在庫ダッシュボード
        <small>SQUARE SANDBOX · INVENTORY</small>
      </h1>
    </div>
    <div class="header-right">
      <div class="location-chip">LOC&thinsp;<span><?= htmlspecialchars(SQUARE_LOCATION_ID) ?></span></div>
      <button class="btn-refresh" id="refreshBtn" onclick="loadInventory()">
        <svg id="refreshIcon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        更新
      </button>
    </div>
  </header>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">アイテム数</div>
      <div class="stat-value c-accent2" id="s-items">—</div>
      <div class="stat-icon">🛍️</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">バリエーション</div>
      <div class="stat-value" id="s-vars">—</div>
      <div class="stat-icon">🔀</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">総在庫数</div>
      <div class="stat-value c-accent" id="s-stock">—</div>
      <div class="stat-icon">📊</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">在庫切れ</div>
      <div class="stat-value c-warn" id="s-zero">—</div>
      <div class="stat-icon">⚠️</div>
    </div>
  </div>

  <div class="toolbar">
    <div class="search-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="searchInput" placeholder="アイテム名・バリエーション名で検索…" oninput="renderTable()">
    </div>
    <div class="filter-tabs">
      <button class="filter-tab active" onclick="setFilter('all',this)">すべて</button>
      <button class="filter-tab"       onclick="setFilter('in',this)">在庫あり</button>
      <button class="filter-tab"       onclick="setFilter('zero',this)">在庫切れ</button>
    </div>
  </div>

  <div class="table-wrap">
    <div id="loader">
      <div class="spinner"></div>
      Square APIからデータを取得中…
    </div>
    <table id="inventoryTable" style="display:none">
      <thead>
        <tr>
          <th onclick="sortBy('item_name')"    id="th-item_name">アイテム名 <i class="sort-icon">↕</i></th>
          <th>バリエーション</th>
          <th onclick="sortBy('price')"        id="th-price">価格 <i class="sort-icon">↕</i></th>
          <th onclick="sortBy('variation_id')" id="th-variation_id">バリエーションID <i class="sort-icon">↕</i></th>
          <th onclick="sortBy('quantity')"     id="th-quantity" class="sorted">在庫数 <i class="sort-icon">↓</i></th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
    <div id="emptyState" style="display:none" class="state-box">
      <div class="icon">📭</div>
      <p>条件に一致するアイテムがありません</p>
    </div>
    <div id="errorState" style="display:none" class="state-box">
      <div class="icon">⚠️</div>
      <p>データの取得に失敗しました</p>
      <code id="errorMsg"></code>
    </div>
  </div>

  <footer>
    <span>Square Sandbox API &middot; <span id="footerCount">—</span> 件表示</span>
    <span>最終取得: <span class="fetched-at" id="fetchedAt">—</span></span>
  </footer>
</div>

<script>
let allRows    = [];
let sortKey    = 'quantity';
let sortAsc    = false;
let filterMode = 'all';

async function loadInventory() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.classList.add('loading');

  show('loader');
  hide('inventoryTable');
  hide('emptyState');
  hide('errorState');

  try {
    const res  = await fetch('?api=1');
    const data = await res.json();

    if (data.error) {
      hide('loader');
      show('errorState');
      document.getElementById('errorMsg').textContent =
        data.error + (data.details?.length ? ' — ' + JSON.stringify(data.details[0]) : '');
      return;
    }

    allRows = data.rows || [];
    animateValue('s-items', data.totalItems);
    animateValue('s-vars',  data.totalVars);
    animateValue('s-stock', data.totalStock);
    animateValue('s-zero',  data.outOfStock);
    document.getElementById('fetchedAt').textContent = data.fetchedAt;

    hide('loader');
    renderTable();
  } catch (e) {
    hide('loader');
    show('errorState');
    document.getElementById('errorMsg').textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

function animateValue(id, target) {
  const el = document.getElementById(id);
  const start = 0, duration = 600;
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setFilter(mode, el) {
  filterMode = mode;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTable();
}

function sortBy(key) {
  sortAsc = sortKey === key ? !sortAsc : (key !== 'quantity');
  sortKey = key;
  document.querySelectorAll('th').forEach(th => {
    th.classList.remove('sorted');
    const ic = th.querySelector('.sort-icon');
    if (ic) ic.textContent = '↕';
  });
  const th = document.getElementById('th-' + key);
  if (th) { th.classList.add('sorted'); th.querySelector('.sort-icon').textContent = sortAsc ? '↑' : '↓'; }
  renderTable();
}

function renderTable() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  let rows = allRows.filter(r => {
    const matchSearch = !q || r.item_name.toLowerCase().includes(q) || r.variation_name.toLowerCase().includes(q);
    const matchFilter = filterMode === 'in' ? r.quantity > 0 : filterMode === 'zero' ? r.quantity <= 0 : true;
    return matchSearch && matchFilter;
  });

  rows.sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const tbody = document.getElementById('tbody');
  if (rows.length === 0) {
    hide('inventoryTable'); show('emptyState');
    document.getElementById('footerCount').textContent = '0';
    return;
  }

  hide('emptyState'); show('inventoryTable');
  tbody.innerHTML = rows.map((r, i) => {
    const cls   = r.quantity <= 0 ? 'zero' : r.quantity <= 5 ? 'medium' : 'high';
    const delay = Math.min(i * 0.03, 0.3).toFixed(2);
    return `<tr style="animation-delay:${delay}s">
      <td class="td-name">${esc(r.item_name)}</td>
      <td><span class="td-var">${esc(r.variation_name)}</span></td>
      <td class="td-price">${esc(r.price)}</td>
      <td class="td-id">${esc(r.variation_id)}</td>
      <td><span class="qty-badge ${cls}"><span class="qty-dot"></span>${r.quantity.toLocaleString()}</span></td>
    </tr>`;
  }).join('');

  document.getElementById('footerCount').textContent = rows.length;
}

function show(id) { const el = document.getElementById(id); if(el) el.style.display = ''; }
function hide(id) { const el = document.getElementById(id); if(el) el.style.display = 'none'; }
function esc(s) {
  return String(s ?? '—')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

loadInventory();
</script>
</body>
</html>
