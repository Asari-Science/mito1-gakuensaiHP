/* ============================================================
 * Admin Panel — Visual Editor
 * - Renders table/card UI for each data type
 * - Edit dialog with type-aware form generation
 * - Drag-to-reorder, search, dirty-state tracking, save channel
 * ============================================================ */
(function() {
  'use strict';

  // ---------- State ----------
  var state = {};       // key -> { data, dirty, type }
  var leafletSide = {}; // key -> 'omote' | 'ura'
  var current = null;   // current modal context

  // ---------- DOM helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.substring(2), attrs[k]);
        } else if (attrs[k] === true) node.setAttribute(k, '');
        else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function(c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  // ---------- Toast ----------
  var toastTimer;
  function showToast(msg, type) {
    var t = $('#admin_toast');
    t.textContent = msg;
    t.className = 'admin_toast ' + (type || 'info') + ' show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 3200);
  }

  // ---------- Confirm dialog ----------
  function confirmDialog(opts) {
    return new Promise(function(resolve) {
      var ov = $('#admin_confirm_overlay');
      $('#admin_confirm_title').textContent = opts.title || '確認';
      $('#admin_confirm_msg').textContent   = opts.message || '';
      var okBtn = $('#admin_confirm_ok');
      var cnBtn = $('#admin_confirm_cancel');
      okBtn.textContent = opts.okText || '実行';
      cnBtn.textContent = opts.cancelText || 'キャンセル';
      okBtn.className   = 'admin_btn ' + (opts.okClass || 'admin_btn_danger');
      ov.hidden = false;
      requestAnimationFrame(function() { ov.classList.add('open'); });

      function close(result) {
        ov.classList.remove('open');
        setTimeout(function() { ov.hidden = true; }, 220);
        okBtn.onclick = null; cnBtn.onclick = null;
        ov.onclick = null;
        resolve(result);
      }
      okBtn.onclick = function() { close(true); };
      cnBtn.onclick = function() { close(false); };
      ov.onclick = function(e) { if (e.target === ov) close(false); };
    });
  }

  // ---------- Format helpers ----------
  function formatYen(n) {
    if (n == null || n === '') return '—';
    return '¥' + Number(n).toLocaleString('ja-JP');
  }

  // ---------- ID generator ----------
  function nextId(items, prefix) {
    var max = 0;
    items.forEach(function(it) {
      var m = String(it.id || '').match(new RegExp('^' + prefix + '(\\d+)$'));
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + String(max + 1).padStart(3, '0');
  }

  // ---------- Sidebar / panel switching ----------
  function switchPanel(key) {
    $$('.admin_sidebar_btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.panel === 'panel_' + key || b.dataset.panel === key);
    });
    $$('.admin_panel').forEach(function(p) {
      p.classList.toggle('active', p.id === 'panel_' + key || p.id === key);
    });
    // Close mobile sidebar
    $('#admin_sidebar').classList.remove('open');
    // Scroll content to top
    var content = $('.admin_content');
    if (content) content.scrollTop = 0;
  }

  $$('.admin_sidebar_btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var p = btn.dataset.panel.replace(/^panel_/, '');
      switchPanel(p);
    });
  });

  // ---------- Mobile menu ----------
  var menuBtn = $('#admin_menu_btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      $('#admin_sidebar').classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (window.innerWidth > 900) return;
      var sb = $('#admin_sidebar');
      if (!sb.classList.contains('open')) return;
      if (!sb.contains(e.target) && !menuBtn.contains(e.target)) {
        sb.classList.remove('open');
      }
    });
  }

  // ---------- Initialize state from window.ADMIN_INITIAL_DATA ----------
  var fileInfo = window.ADMIN_FILE_INFO || {};
  Object.keys(window.ADMIN_INITIAL_DATA || {}).forEach(function(key) {
    var raw = window.ADMIN_INITIAL_DATA[key];
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = []; }
    state[key] = {
      data: parsed,
      original: JSON.parse(JSON.stringify(parsed)),
      dirty: false,
      info: fileInfo[key]
    };
  });

  // ---------- Dirty-state ----------
  function setDirty(key, dirty) {
    state[key].dirty = !!dirty;
    var panel = document.getElementById('panel_' + key);
    if (panel) {
      var badge = panel.querySelector('[data-dirty-badge]');
      if (badge) badge.hidden = !dirty;
    }
  }

  function checkDirtyByDeepEqual(key) {
    var equal = JSON.stringify(state[key].data) === JSON.stringify(state[key].original);
    setDirty(key, !equal);
  }

  // ---------- Render: products (cafe / goods) ----------
  function renderProductTable(key, searchQ) {
    var panel = document.getElementById('panel_' + key);
    var tbody = panel.querySelector('[data-tbody]');
    var emptyEl = panel.querySelector('[data-empty]');
    var data = state[key].data || [];
    var q = (searchQ || '').toLowerCase().trim();
    var filtered = !q ? data : data.filter(function(it) {
      var hay = [it.title, it.description, it.seller, it.category].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (filtered.length === 0 && data.length === 0) {
      tbody.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="admin_table_nores">「' + esc(q) + '」に一致する項目がありません。</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(item) {
      var stock, price;
      if (item.variations && item.variations.length > 0) {
        stock = item.variations.reduce(function(s, v){ return s + (Number(v.stock)||0); }, 0);
        var ps = item.variations.map(function(v){ return Number(v.price)||0; });
        var min = Math.min.apply(null, ps), max = Math.max.apply(null, ps);
        price = min === max ? formatYen(min) : formatYen(min) + '〜' + formatYen(max);
      } else {
        stock = Number(item.stock) || 0;
        price = formatYen(item.price);
      }
      var pay = item.cashless
        ? '<span class="admin_pill ok">キャッシュレス</span>'
        : '<span class="admin_pill cash">現金のみ</span>';
      var img = item.photo
        ? '<img src="' + esc(item.photo) + '" alt="" class="admin_table_thumb" loading="lazy">'
        : '<div class="admin_table_thumb admin_table_thumb_placeholder"></div>';
      var variationLbl = item.variations && item.variations.length > 0
        ? '<span class="admin_pill var">全' + item.variations.length + '種</span>'
        : '';

      return '<tr data-id="' + esc(item.id) + '">' +
        '<td class="col_drag"><span class="admin_drag_handle" aria-label="ドラッグして並べ替え" title="ドラッグして並べ替え">⋮⋮</span></td>' +
        '<td class="col_id"><code>' + esc(item.id) + '</code></td>' +
        '<td class="col_photo">' + img + '</td>' +
        '<td class="col_title"><span class="admin_table_title">' + esc(item.title) + '</span><br><small class="admin_table_sub">' + esc((item.description||'').slice(0, 40)) + (item.description && item.description.length > 40 ? '…' : '') + '</small></td>' +
        '<td class="col_cat"><span class="admin_pill cat">' + esc(item.category) + '</span> ' + variationLbl + '</td>' +
        '<td class="col_price"><strong>' + price + '</strong></td>' +
        '<td class="col_seller">' + esc(item.seller) + '</td>' +
        '<td class="col_pay">' + pay + '</td>' +
        '<td class="col_stock">' + stock + '</td>' +
        '<td class="col_actions">' +
          '<button type="button" class="admin_table_btn" data-row-edit>編集</button>' +
          '<button type="button" class="admin_table_btn delete" data-row-delete>削除</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    bindRowEvents(panel, key);
    enableDragSort(panel, key);
  }

  // ---------- Render: kikaku ----------
  function renderKikakuGrid(key, searchQ) {
    var panel = document.getElementById('panel_' + key);
    var grid = panel.querySelector('[data-tbody]');
    var emptyEl = panel.querySelector('[data-empty]');
    var data = state[key].data || [];
    var q = (searchQ || '').toLowerCase().trim();
    var filtered = !q ? data : data.filter(function(it) {
      var hay = [it.title, it.titleKana, it.group, it.location, it.genre, it.pr, it.description].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (filtered.length === 0 && data.length === 0) {
      grid.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="admin_table_nores admin_kikaku_empty">「' + esc(q) + '」に一致する企画がありません。</div>';
      return;
    }

    grid.innerHTML = filtered.map(function(item) {
      var dayLbl = item.day === 'day1' ? 'Day1' : item.day === 'day2' ? 'Day2' : '両日';
      var kanaHtml = item.titleKana ? '<p class="admin_kikaku_kana">' + esc(item.titleKana) + '</p>' : '';
      return '<article class="admin_kikaku_card" data-id="' + esc(item.id) + '">' +
        '<div class="admin_kikaku_card_top">' +
          '<span class="admin_pill cat">' + esc(item.genre || '—') + '</span>' +
          '<span class="admin_pill day">' + dayLbl + '</span>' +
          '<code class="admin_kikaku_id">' + esc(item.id) + '</code>' +
        '</div>' +
        kanaHtml +
        '<h3 class="admin_kikaku_title">' + esc(item.title) + '</h3>' +
        '<p class="admin_kikaku_group">' + esc(item.group || '') + '</p>' +
        '<p class="admin_kikaku_pr">' + esc(item.pr || '') + '</p>' +
        '<p class="admin_kikaku_loc">' +
          '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          esc(item.location || '—') + '</p>' +
        '<div class="admin_kikaku_actions">' +
          '<button type="button" class="admin_table_btn" data-row-edit>編集</button>' +
          '<button type="button" class="admin_table_btn delete" data-row-delete>削除</button>' +
        '</div>' +
      '</article>';
    }).join('');

    bindRowEvents(panel, key);
  }

  // ---------- Render: leaflet ----------
  function renderLeafletTable(key, searchQ) {
    var panel = document.getElementById('panel_' + key);
    var side  = leafletSide[key] || 'omote';
    leafletSide[key] = side;
    var tbody = panel.querySelector('[data-tbody]');
    var emptyEl = panel.querySelector('[data-empty]');
    var data = state[key].data || {};
    var arr  = Array.isArray(data[side]) ? data[side] : [];
    var q = (searchQ || '').toLowerCase().trim();
    var filtered = !q ? arr : arr.filter(function(it) {
      var hay = [it.title, it.category, (it.keywords||[]).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (filtered.length === 0 && arr.length === 0) {
      tbody.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin_table_nores">「' + esc(q) + '」に一致する項目がありません。</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(item) {
      var kw = (item.keywords || []).slice(0, 3).map(function(k){ return '<span class="admin_pill kw">' + esc(k) + '</span>'; }).join(' ');
      var more = (item.keywords || []).length > 3 ? '<span class="admin_table_sub">+' + ((item.keywords || []).length - 3) + '</span>' : '';
      return '<tr data-id="' + esc(item.id) + '">' +
        '<td class="col_id"><code>' + esc(item.id) + '</code></td>' +
        '<td class="col_title"><strong>' + esc(item.title) + '</strong></td>' +
        '<td class="col_cat"><span class="admin_pill cat">' + esc(item.category || '—') + '</span></td>' +
        '<td class="col_xy">' + (typeof item.x === 'number' ? item.x.toFixed(2) : '—') + '</td>' +
        '<td class="col_xy">' + (typeof item.y === 'number' ? item.y.toFixed(2) : '—') + '</td>' +
        '<td class="col_kw">' + kw + ' ' + more + '</td>' +
        '<td class="col_actions">' +
          '<button type="button" class="admin_table_btn" data-row-edit>編集</button>' +
          '<button type="button" class="admin_table_btn delete" data-row-delete>削除</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    bindRowEvents(panel, key);
  }

  // ---------- Render: timetable JSON ----------
  function renderTimetable(key) {
    var panel = document.getElementById('panel_' + key);
    var ta    = panel.querySelector('[data-json-textarea]');
    var prev  = panel.querySelector('[data-timetable-preview]');
    if (ta && ta.value === '') {
      ta.value = JSON.stringify(state[key].data, null, 2);
    }
    if (prev) renderTimetablePreview(prev, state[key].data);
  }

  function renderTimetablePreview(container, data) {
    if (!data || !data.schedules) {
      container.innerHTML = '<p class="admin_table_nores">プレビューを表示できません（スキーマ不整合）。</p>';
      return;
    }
    var html = '';
    Object.keys(data.schedules).forEach(function(weather) {
      var lbl = (data.weatherLabels && data.weatherLabels[weather]) || weather;
      html += '<div class="admin_timetable_block"><h3>' + esc(lbl) + '</h3>';
      var days = (data.schedules[weather] && data.schedules[weather].days) || [];
      days.forEach(function(d) {
        html += '<div class="admin_timetable_day"><h4>' + esc(d.label || d.id) + ' <small>(' + esc(d.date || '') + ')</small></h4>';
        var stages = (d.stages || []).map(function(s) {
          var cnt = (d.events || []).filter(function(e){ return e.stageId === s.id; }).length;
          return '<span class="admin_pill cat">' + esc(s.name) + ' (' + cnt + '件)</span>';
        }).join(' ');
        html += '<div class="admin_timetable_stages">' + stages + '</div></div>';
      });
      html += '</div>';
    });
    container.innerHTML = html;
  }

  // ---------- Bind row events (edit/delete) ----------
  function bindRowEvents(panel, key) {
    panel.querySelectorAll('[data-row-edit]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var row = btn.closest('[data-id]');
        if (row) openEditModal(key, row.dataset.id, false);
      });
    });
    panel.querySelectorAll('[data-row-delete]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var row = btn.closest('[data-id]');
        if (row) deleteItem(key, row.dataset.id);
      });
    });
    // Click whole row/card to edit
    panel.querySelectorAll('[data-id]').forEach(function(row) {
      row.addEventListener('click', function(e) {
        if (e.target.closest('button') || e.target.closest('.admin_drag_handle')) return;
        openEditModal(key, row.dataset.id, false);
      });
      row.style.cursor = 'pointer';
    });
  }

  // ---------- Drag-to-reorder (products only) ----------
  function enableDragSort(panel, key) {
    var tbody = panel.querySelector('[data-tbody]');
    if (!tbody) return;
    var dragRow = null;
    tbody.querySelectorAll('tr').forEach(function(row) {
      var handle = row.querySelector('.admin_drag_handle');
      if (!handle) return;
      handle.draggable = true;
      handle.addEventListener('dragstart', function(e) {
        dragRow = row;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', row.dataset.id); } catch(err) {}
      });
      handle.addEventListener('dragend', function() {
        if (dragRow) dragRow.classList.remove('dragging');
        dragRow = null;
        // Re-order data array
        var newOrder = $$('tr[data-id]', tbody).map(function(r){ return r.dataset.id; });
        var data = state[key].data;
        data.sort(function(a, b){ return newOrder.indexOf(a.id) - newOrder.indexOf(b.id); });
        checkDirtyByDeepEqual(key);
      });
    });
    tbody.addEventListener('dragover', function(e) {
      if (!dragRow) return;
      e.preventDefault();
      var target = e.target.closest('tr[data-id]');
      if (!target || target === dragRow) return;
      var rect = target.getBoundingClientRect();
      var midpoint = rect.top + rect.height / 2;
      if (e.clientY < midpoint) {
        target.parentNode.insertBefore(dragRow, target);
      } else {
        target.parentNode.insertBefore(dragRow, target.nextSibling);
      }
    });
  }

  // ---------- Delete ----------
  function deleteItem(key, id) {
    confirmDialog({
      title: '削除の確認',
      message: 'ID「' + id + '」を削除します。元に戻すには「元に戻す」ボタンを押してください。',
      okText: '削除する'
    }).then(function(ok) {
      if (!ok) return;
      var info = state[key].info;
      if (info.type === 'leaflet') {
        var side = leafletSide[key] || 'omote';
        state[key].data[side] = (state[key].data[side] || []).filter(function(it){ return it.id !== id; });
      } else {
        state[key].data = state[key].data.filter(function(it){ return it.id !== id; });
      }
      checkDirtyByDeepEqual(key);
      renderPanel(key);
      showToast('項目を削除しました（保存ボタンで反映）', 'info');
    });
  }

  // ---------- Edit modal ----------
  function openEditModal(key, id, isNew) {
    var info = state[key].info;
    var data = state[key].data;
    var item = null;

    if (isNew) {
      if (info.type === 'product') {
        item = { id: nextId(data, key === 'cafe_menu' ? 'C' : 'G'), photo: '../materials/enjitsu78th.webp', title: '', description: '', price: 0, seller: '', cashless: true, category: '', stock: null, locationId: '', variationId: '' };
      } else if (info.type === 'kikaku') {
        item = { id: nextId(data, 'K'), title: '', titleKana: '', genre: '', group: '', location: '', locationPin: '', pr: '', description: '', images: [], day: 'both' };
      } else if (info.type === 'leaflet') {
        var side = leafletSide[key] || 'omote';
        var arr  = data[side] || [];
        item = { id: 'poi-' + (arr.length + 1), title: '', category: '', description: '', keywords: [], x: 0.5, y: 0.5 };
      }
    } else {
      if (info.type === 'leaflet') {
        var side2 = leafletSide[key] || 'omote';
        item = (data[side2] || []).find(function(it){ return it.id === id; });
      } else {
        item = data.find(function(it){ return it.id === id; });
      }
      if (item) item = JSON.parse(JSON.stringify(item)); // working copy
    }
    if (!item) return;

    current = { key: key, id: id, isNew: isNew, item: item, type: info.type };
    $('#admin_modal_title').textContent = isNew ? '新規追加' : '編集: ' + (item.title || item.id);
    $('#admin_modal_delete').hidden = isNew;
    $('#admin_modal_body').innerHTML = '';
    $('#admin_modal_body').appendChild(buildEditForm(info.type, item));

    var ov = $('#admin_modal_overlay');
    ov.hidden = false;
    requestAnimationFrame(function() { ov.classList.add('open'); });
    document.body.classList.add('admin_modal_open');
  }

  function closeEditModal() {
    var ov = $('#admin_modal_overlay');
    ov.classList.remove('open');
    setTimeout(function() { ov.hidden = true; }, 220);
    document.body.classList.remove('admin_modal_open');
    current = null;
  }

  // ---------- Form builders ----------
  function field(label, inputEl, opts) {
    opts = opts || {};
    return el('div', { class: 'admin_form_group' + (opts.full ? ' full' : '') }, [
      el('label', { html: esc(label) + (opts.required ? ' <span class="req">*</span>' : '') }),
      inputEl,
      opts.hint ? el('small', { class: 'admin_form_hint', html: opts.hint }) : null
    ]);
  }

  function input(name, value, type) {
    var i = el('input', { type: type || 'text', name: name, value: value == null ? '' : value, class: 'admin_input' });
    return i;
  }

  function textarea(name, value, rows) {
    return el('textarea', { name: name, class: 'admin_input', rows: rows || 3 }, [value || '']);
  }

  function select(name, options, value) {
    var s = el('select', { name: name, class: 'admin_input' });
    options.forEach(function(opt) {
      var o = el('option', { value: opt.value }, opt.label);
      if (String(opt.value) === String(value)) o.selected = true;
      s.appendChild(o);
    });
    return s;
  }

  function checkbox(name, label, checked) {
    var input = el('input', { type: 'checkbox', name: name });
    if (checked) input.checked = true;
    return el('label', { class: 'admin_form_check' }, [input, document.createTextNode(' ' + label)]);
  }

  // Square 設定からロケーション選択肢を作る
  function locationOptions(currentVal) {
    var cfg  = window.ADMIN_SQUARE_CFG || {};
    var ids  = (cfg.location_ids || []).slice();
    var opts = [{ value: '', label: '— Square連携しない —' }];
    ids.forEach(function(id) { opts.push({ value: id, label: id }); });
    // 既存値がリストに無くても保持
    if (currentVal && ids.indexOf(currentVal) === -1) {
      opts.push({ value: currentVal, label: currentVal + ' (未登録)' });
    }
    return opts;
  }

  function buildEditForm(type, item) {
    var wrap = el('div', { class: 'admin_form' });
    if (type === 'product') {
      wrap.appendChild(field('ID', input('id', item.id), { hint: '英数字。例: C001' }));
      wrap.appendChild(field('商品名', input('title', item.title), { required: true }));
      wrap.appendChild(field('カテゴリ', input('category', item.category), { required: true, hint: '例: 飲み物 / 食べ物 / デザート' }));
      wrap.appendChild(field('販売場所', input('seller', item.seller), { required: true }));
      wrap.appendChild(field('写真パス', input('photo', item.photo), { full: true, hint: 'pages/cafe.php からの相対パス。例: ../materials/enjitsu78th.webp' }));
      wrap.appendChild(field('説明', textarea('description', item.description, 3), { full: true }));

      // Variations toggle
      var hasVar = !!(item.variations && item.variations.length > 0);
      var varToggle = checkbox('has_variations', 'バリエーション(種類)を設定する', hasVar);
      wrap.appendChild(el('div', { class: 'admin_form_group full' }, [varToggle]));

      // Single price/stock + Square IDs
      var single = el('div', { class: 'admin_form_single' + (hasVar ? ' hidden' : '') });
      var singleRow1 = el('div', { class: 'admin_form_row' }, [
        field('金額 (円)', input('price', item.price, 'number')),
        field('在庫数 (任意)', input('stock', item.stock, 'number'), { hint: 'Squareから自動取得する場合は空欄' })
      ]);
      single.appendChild(singleRow1);
      var singleRow2 = el('div', { class: 'admin_form_row' }, [
        field('Square Location ID', select('locationId', locationOptions(item.locationId || ''), item.locationId || ''),
              { hint: '在庫を取得する店舗' }),
        field('Square Variation ID', input('variationId', item.variationId || ''),
              { hint: 'カタログDBから取得して貼り付け' })
      ]);
      single.appendChild(singleRow2);
      wrap.appendChild(single);

      // Variations table
      var varWrap = el('div', { class: 'admin_form_group full admin_form_variations' + (hasVar ? '' : ' hidden') });
      varWrap.appendChild(el('label', { text: 'バリエーション (種類ごとの金額・在庫 + Square ID)' }));
      varWrap.appendChild(el('small', { class: 'admin_form_hint', html: '味などのバリエーションごとに Variation ID を割り当てます。空欄の場合は親アイテムの Location ID を継承します。' }));
      var varList = el('div', { class: 'admin_var_list', 'data-var-list': '' });
      varWrap.appendChild(varList);
      var addBtn = el('button', { type: 'button', class: 'admin_btn admin_btn_outline', style: 'margin-top:8px;font-size:12px;padding:7px 14px;' }, '+ バリエーション追加');
      addBtn.addEventListener('click', function() { addVarRow(varList, { name: '', price: 0, stock: null, locationId: '', variationId: '' }); });
      varWrap.appendChild(addBtn);

      // 親アイテム共通の Location ID
      var varCommonRow = el('div', { class: 'admin_form_group full', style: 'margin-top:10px;' }, [
        field('共通 Location ID (各バリエーションに継承)',
              select('parent_locationId', locationOptions(item.locationId || ''), item.locationId || ''))
      ]);
      varWrap.appendChild(varCommonRow);

      wrap.appendChild(varWrap);

      (item.variations || []).forEach(function(v) { addVarRow(varList, v); });
      if (hasVar && (!item.variations || item.variations.length === 0)) addVarRow(varList, { name: '', price: 0, stock: null, locationId: '', variationId: '' });

      varToggle.querySelector('input').addEventListener('change', function(e) {
        if (e.target.checked) {
          single.classList.add('hidden');
          varWrap.classList.remove('hidden');
          if (!varList.children.length) addVarRow(varList, { name: '', price: 0, stock: null, locationId: '', variationId: '' });
        } else {
          single.classList.remove('hidden');
          varWrap.classList.add('hidden');
        }
      });

      // Cashless
      wrap.appendChild(el('div', { class: 'admin_form_group full' }, [
        checkbox('cashless', 'キャッシュレス決済対応', item.cashless)
      ]));
    }

    if (type === 'kikaku') {
      wrap.appendChild(field('ID', input('id', item.id), { hint: '例: K001' }));
      wrap.appendChild(field('企画名', input('title', item.title), { required: true, full: true }));
      wrap.appendChild(field('企画名 読み仮名', input('titleKana', item.titleKana), { full: true, hint: 'ひらがな表記。例: あまがけるきっさ（カード・モーダルに小さく表示されます）' }));
      wrap.appendChild(field('ジャンル', select('genre', [
        { value: '', label: '選択してください' },
        { value: '喫茶', label: '喫茶' },
        { value: 'アトラクション（ホラー）', label: 'アトラクション（ホラー）' },
        { value: 'アトラクション（ホラー以外）', label: 'アトラクション（ホラー以外）' },
        { value: '創作展示', label: '創作展示' },
        { value: '映像作品', label: '映像作品' },
        { value: 'ステージ', label: 'ステージ' },
        { value: '縁日', label: '縁日' }
      ], item.genre), { required: true }));
      wrap.appendChild(field('団体名', input('group', item.group), { required: true }));
      wrap.appendChild(field('場所', input('location', item.location), { required: true, full: true }));
      wrap.appendChild(field('地図ピンID', input('locationPin', item.locationPin), { full: true, hint: '例: omote:cafe-area / ura:goods-shop（任意）' }));
      wrap.appendChild(field('開催日', select('day', [
        { value: 'both', label: '両日' },
        { value: 'day1', label: 'Day1のみ' },
        { value: 'day2', label: 'Day2のみ' }
      ], item.day || 'both')));
      wrap.appendChild(field('PR文 (短い)', textarea('pr', item.pr, 2), { full: true, hint: 'カードに表示される短いキャッチコピー' }));
      wrap.appendChild(field('詳細説明', textarea('description', item.description, 5), { full: true }));
      wrap.appendChild(field('画像ファイル (1行1ファイル)', textarea('images', (item.images || []).join('\n'), 3), { full: true, hint: 'materials/kikakuimg/ 内のファイル名を1行ずつ。例: sample_cafe1.webp' }));
    }

    if (type === 'leaflet') {
      wrap.appendChild(field('ID', input('id', item.id), { required: true, hint: '英数字ハイフン。例: cafe-area' }));
      wrap.appendChild(field('名称', input('title', item.title), { required: true }));
      wrap.appendChild(field('カテゴリ', input('category', item.category), { hint: '例: ステージ / 喫茶 / 展示' }));
      wrap.appendChild(field('X座標 (0.0〜1.0)', input('x', item.x, 'number'), { hint: '画像左上を(0,0)、右下を(1,1)とする' }));
      wrap.appendChild(field('Y座標 (0.0〜1.0)', input('y', item.y, 'number')));
      wrap.appendChild(field('説明 (HTML可)', textarea('description', item.description, 4), { full: true, hint: '<a>, <br>, <strong> 等のHTMLが使用可能' }));
      wrap.appendChild(field('検索キーワード (1行1個)', textarea('keywords', (item.keywords || []).join('\n'), 4), { full: true }));
    }

    return wrap;
  }

  function addVarRow(container, v) {
    var cfg = window.ADMIN_SQUARE_CFG || {};
    var locIds = (cfg.location_ids || []).slice();
    var curLoc = v.locationId || '';
    // location select
    var locSel = document.createElement('select');
    locSel.className = 'admin_input';
    locSel.name = 'var_locationId';
    var opt0 = document.createElement('option');
    opt0.value = ''; opt0.textContent = '(共通)';
    locSel.appendChild(opt0);
    locIds.forEach(function(id) {
      var o = document.createElement('option');
      o.value = id; o.textContent = id;
      if (id === curLoc) o.selected = true;
      locSel.appendChild(o);
    });
    if (curLoc && locIds.indexOf(curLoc) === -1) {
      var oExtra = document.createElement('option');
      oExtra.value = curLoc; oExtra.textContent = curLoc + ' (未登録)'; oExtra.selected = true;
      locSel.appendChild(oExtra);
    }

    var row = el('div', { class: 'admin_var_row admin_var_row_square' }, [
      el('input', { type: 'text', class: 'admin_input', placeholder: '種類名', name: 'var_name', value: v.name || '' }),
      el('input', { type: 'number', class: 'admin_input', placeholder: '金額', name: 'var_price', value: v.price == null ? 0 : v.price }),
      el('input', { type: 'number', class: 'admin_input', placeholder: '在庫(任意)', name: 'var_stock', value: v.stock == null ? '' : v.stock }),
      locSel,
      el('input', { type: 'text', class: 'admin_input', placeholder: 'Variation ID', name: 'var_variationId', value: v.variationId || '' }),
      el('button', { type: 'button', class: 'admin_var_remove', 'aria-label': '削除' }, '×')
    ]);
    row.querySelector('.admin_var_remove').addEventListener('click', function() { row.remove(); });
    container.appendChild(row);
  }

  // ---------- Apply edit (collect form -> data) ----------
  function applyEdit() {
    if (!current) return;
    var key = current.key;
    var item = current.item;
    var body = $('#admin_modal_body');
    var get = function(n) {
      var el = body.querySelector('[name="' + n + '"]');
      return el ? el.value : '';
    };
    var getCheck = function(n) {
      var el = body.querySelector('[name="' + n + '"][type="checkbox"]');
      return !!(el && el.checked);
    };

    if (current.type === 'product') {
      item.id          = get('id').trim();
      item.title       = get('title').trim();
      item.category    = get('category').trim();
      item.seller      = get('seller').trim();
      item.photo       = get('photo').trim();
      item.description = get('description').trim();
      item.cashless    = getCheck('cashless');

      if (!item.id || !item.title || !item.category || !item.seller) {
        showToast('必須項目を入力してください', 'error'); return;
      }

      var hasVar = getCheck('has_variations');
      if (hasVar) {
        var rows = body.querySelectorAll('.admin_var_row');
        var variations = [];
        rows.forEach(function(r) {
          var n = r.querySelector('[name="var_name"]').value.trim();
          var p = parseInt(r.querySelector('[name="var_price"]').value, 10) || 0;
          var sRaw = r.querySelector('[name="var_stock"]').value;
          var s = (sRaw === '' || sRaw == null) ? null : (parseInt(sRaw, 10) || 0);
          var lid = (r.querySelector('[name="var_locationId"]').value || '').trim();
          var vid = (r.querySelector('[name="var_variationId"]').value || '').trim();
          if (n) variations.push({ name: n, price: p, stock: s, locationId: lid, variationId: vid });
        });
        if (!variations.length) { showToast('バリエーションを1件以上入力してください', 'error'); return; }
        item.variations  = variations;
        // 親アイテムは共通 locationId だけ保持
        item.locationId  = (get('parent_locationId') || '').trim();
        delete item.price;
        delete item.stock;
        delete item.variationId;
      } else {
        item.price = parseInt(get('price'), 10) || 0;
        var sRawTop = get('stock');
        item.stock = (sRawTop === '' || sRawTop == null) ? null : (parseInt(sRawTop, 10) || 0);
        item.locationId  = (get('locationId') || '').trim();
        item.variationId = (get('variationId') || '').trim();
        delete item.variations;
      }
    } else if (current.type === 'kikaku') {
      item.id           = get('id').trim();
      item.title        = get('title').trim();
      item.titleKana    = get('titleKana').trim();
      item.genre        = get('genre').trim();
      item.group        = get('group').trim();
      item.location     = get('location').trim();
      item.locationPin  = get('locationPin').trim();
      item.day          = get('day') || 'both';
      item.pr           = get('pr').trim();
      item.description  = get('description').trim();
      item.images       = get('images').split('\n').map(function(s){ return s.trim(); }).filter(Boolean);

      if (!item.id || !item.title || !item.genre || !item.group || !item.location) {
        showToast('必須項目を入力してください', 'error'); return;
      }
    } else if (current.type === 'leaflet') {
      item.id          = get('id').trim();
      item.title       = get('title').trim();
      item.category    = get('category').trim();
      item.description = get('description').trim();
      item.x = parseFloat(get('x')); if (isNaN(item.x)) item.x = 0;
      item.y = parseFloat(get('y')); if (isNaN(item.y)) item.y = 0;
      item.x = Math.max(0, Math.min(1, item.x));
      item.y = Math.max(0, Math.min(1, item.y));
      item.keywords = get('keywords').split('\n').map(function(s){ return s.trim(); }).filter(Boolean);

      if (!item.id || !item.title) { showToast('IDと名称は必須です', 'error'); return; }
    }

    var data = state[key].data;
    if (current.type === 'leaflet') {
      var side = leafletSide[key] || 'omote';
      if (!Array.isArray(data[side])) data[side] = [];
      if (current.isNew) {
        data[side].push(item);
      } else {
        var idx = data[side].findIndex(function(it){ return it.id === current.id; });
        if (idx >= 0) data[side][idx] = item;
      }
    } else {
      if (current.isNew) {
        data.push(item);
      } else {
        var idx2 = data.findIndex(function(it){ return it.id === current.id; });
        if (idx2 >= 0) data[idx2] = item;
      }
    }

    checkDirtyByDeepEqual(key);
    renderPanel(key);
    closeEditModal();
    showToast(current.isNew ? '項目を追加しました（保存ボタンで反映）' : '変更を反映しました（保存ボタンで反映）', 'info');
  }

  // ---------- Render dispatcher ----------
  function renderPanel(key) {
    var info = state[key].info;
    var panel = document.getElementById('panel_' + key);
    if (!panel) return;
    var qInput = panel.querySelector('[data-table-search]');
    var q = qInput ? qInput.value : '';
    if (info.type === 'product') renderProductTable(key, q);
    else if (info.type === 'kikaku') renderKikakuGrid(key, q);
    else if (info.type === 'leaflet') renderLeafletTable(key, q);
    else if (info.type === 'json') renderTimetable(key);
  }

  // ---------- Save ----------
  function savePanel(key) {
    var info = state[key].info;
    var payload;
    if (info.type === 'json') {
      var ta = document.querySelector('#panel_' + key + ' [data-json-textarea]');
      try {
        var obj = JSON.parse(ta.value);
        // Update internal state too
        state[key].data = obj;
        state[key].original = JSON.parse(JSON.stringify(obj));
        payload = JSON.stringify(obj);
      } catch (e) {
        showToast('JSON形式エラー: ' + e.message, 'error');
        return;
      }
    } else {
      payload = JSON.stringify(state[key].data);
    }
    $('#admin_save_key').value = key;
    $('#admin_save_payload').value = payload;
    $('#admin_save_form').submit();
  }

  // ---------- Reload (revert) ----------
  function reloadPanel(key) {
    if (!state[key].dirty) {
      showToast('変更はありません', 'info');
      return;
    }
    confirmDialog({
      title: '変更を破棄しますか？',
      message: '保存していない変更がすべて元に戻ります。',
      okText: '破棄する',
      okClass: 'admin_btn_danger'
    }).then(function(ok) {
      if (!ok) return;
      state[key].data = JSON.parse(JSON.stringify(state[key].original));
      setDirty(key, false);
      // Reset JSON textarea if present
      var ta = document.querySelector('#panel_' + key + ' [data-json-textarea]');
      if (ta) ta.value = JSON.stringify(state[key].data, null, 2);
      renderPanel(key);
      showToast('変更を元に戻しました', 'info');
    });
  }

  // ---------- Wire up panel actions ----------
  $$('.admin_panel').forEach(function(panel) {
    var key = panel.dataset.key;
    if (!key) return;
    panel.querySelectorAll('[data-action]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var act = btn.dataset.action;
        if (act === 'add')         openEditModal(key, null, true);
        else if (act === 'save')   savePanel(key);
        else if (act === 'reload') reloadPanel(key);
        else if (act === 'format-json') {
          var ta = panel.querySelector('[data-json-textarea]');
          try {
            var obj = JSON.parse(ta.value);
            ta.value = JSON.stringify(obj, null, 2);
            showToast('JSONを整形しました', 'info');
          } catch(e) { showToast('JSON形式エラー: ' + e.message, 'error'); }
        }
      });
    });
    // Search input
    var search = panel.querySelector('[data-table-search]');
    if (search) {
      search.addEventListener('input', function() { renderPanel(key); });
    }
    // Leaflet subtabs
    panel.querySelectorAll('[data-leaflet-side]').forEach(function(tab) {
      tab.addEventListener('click', function() {
        leafletSide[key] = tab.dataset.leafletSide;
        panel.querySelectorAll('[data-leaflet-side]').forEach(function(t) {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        renderPanel(key);
      });
    });
    // JSON textarea dirty tracking
    var ta = panel.querySelector('[data-json-textarea]');
    if (ta) {
      ta.addEventListener('input', function() {
        try {
          var obj = JSON.parse(ta.value);
          state[key].data = obj;
          checkDirtyByDeepEqual(key);
          var prev = panel.querySelector('[data-timetable-preview]');
          if (prev) renderTimetablePreview(prev, obj);
        } catch (e) {
          // Invalid JSON; mark dirty by raw text difference
          setDirty(key, ta.value !== JSON.stringify(state[key].original, null, 2));
        }
      });
    }
  });

  // Modal global buttons
  $('#admin_modal_close').addEventListener('click', closeEditModal);
  $('#admin_modal_cancel').addEventListener('click', closeEditModal);
  $('#admin_modal_overlay').addEventListener('click', function(e) {
    if (e.target === e.currentTarget) closeEditModal();
  });
  $('#admin_modal_apply').addEventListener('click', applyEdit);
  $('#admin_modal_delete').addEventListener('click', function() {
    if (!current || current.isNew) return;
    var key = current.key, id = current.id;
    closeEditModal();
    deleteItem(key, id);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var ov = $('#admin_modal_overlay');
      if (ov && !ov.hidden) closeEditModal();
    }
  });

  // ---------- Square: API設定パネル ----------
  var squareFetchBtn = $('#admin_square_fetch_locs');
  if (squareFetchBtn) {
    squareFetchBtn.addEventListener('click', function() {
      var resultCard = $('#admin_square_loc_result');
      var listEl     = $('#admin_square_loc_list');
      squareFetchBtn.disabled = true;
      squareFetchBtn.textContent = '取得中…';
      fetch('square.php?proxy=locations', { credentials: 'same-origin', cache: 'no-store' })
        .then(function(r) { return r.json(); })
        .then(function(json) {
          resultCard.hidden = false;
          if (json.error) {
            listEl.innerHTML = '<p class="admin_table_nores">取得失敗: ' + esc(json.error) + '</p>';
            return;
          }
          var locs = json.locations || [];
          if (!locs.length) {
            listEl.innerHTML = '<p class="admin_table_nores">店舗が見つかりませんでした。</p>';
            return;
          }
          var html = '<div class="admin_table_wrap"><table class="admin_table"><thead><tr>' +
            '<th>店舗名</th><th>Location ID</th><th>住所</th><th>通貨</th><th>状態</th><th></th>' +
            '</tr></thead><tbody>';
          locs.forEach(function(l) {
            html += '<tr>' +
              '<td><strong>' + esc(l.name || '—') + '</strong></td>' +
              '<td><code>' + esc(l.id) + '</code></td>' +
              '<td>' + esc(l.address || '—') + '</td>' +
              '<td>' + esc(l.currency || '—') + '</td>' +
              '<td><span class="admin_pill ' + (l.status === 'ACTIVE' ? 'ok' : 'cash') + '">' + esc(l.status || '—') + '</span></td>' +
              '<td><button type="button" class="admin_table_btn" data-add-loc="' + esc(l.id) + '">+ 追加</button></td>' +
            '</tr>';
          });
          html += '</tbody></table></div>';
          listEl.innerHTML = html;
          // 「追加」ボタン
          listEl.querySelectorAll('[data-add-loc]').forEach(function(btn) {
            btn.addEventListener('click', function() {
              var id = btn.dataset.addLoc;
              var ta = document.querySelector('#panel_square_settings textarea[name="location_ids"]');
              if (!ta) return;
              var cur = (ta.value || '').split(/[\s,]+/).map(function(s){return s.trim();}).filter(Boolean);
              if (cur.indexOf(id) === -1) {
                cur.push(id);
                ta.value = cur.join('\n');
                showToast(id + ' を追加しました（「Square設定を保存」で確定）', 'info');
              } else {
                showToast('既に追加されています', 'info');
              }
            });
          });
        })
        .catch(function(e) {
          resultCard.hidden = false;
          listEl.innerHTML = '<p class="admin_table_nores">取得失敗: ' + esc(e.message) + '</p>';
        })
        .finally(function() {
          squareFetchBtn.disabled = false;
          squareFetchBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> 利用可能な店舗を取得';
        });
    });
  }

  // ---------- Square: カタログDBダッシュボード ----------
  var dashLocSel = $('#admin_square_dash_loc');
  var dashRefresh = $('#admin_square_dash_refresh');
  var dashSearch  = $('#admin_square_dash_search');
  var dashResult  = $('#admin_square_dash_result');
  var dashEmpty   = $('#admin_square_dash_empty');
  var dashTbody   = dashResult ? dashResult.querySelector('tbody') : null;
  var dashCount   = $('#admin_square_dash_count');
  var dashCache   = []; // 現在表示中のフラット行

  function fetchSquareCatalog(locationId) {
    if (!locationId) return;
    if (dashResult) dashResult.hidden = true;
    if (dashEmpty)  dashEmpty.hidden = true;
    if (dashTbody)  dashTbody.innerHTML = '<tr><td colspan="6" class="admin_table_nores">読み込み中…</td></tr>';
    if (dashResult) dashResult.hidden = false;

    fetch('square.php?proxy=catalog&location_id=' + encodeURIComponent(locationId),
          { credentials: 'same-origin', cache: 'no-store' })
      .then(function(r) { return r.json(); })
      .then(function(json) {
        if (json.error) {
          dashTbody.innerHTML = '<tr><td colspan="6" class="admin_table_nores">取得失敗: ' + esc(json.error) + '</td></tr>';
          return;
        }
        var rows = [];
        (json.items || []).forEach(function(it) {
          (it.variations || []).forEach(function(v) {
            rows.push({
              item_name: it.item_name,
              variation_name: v.variation_name,
              price: v.price,
              currency: v.currency,
              variation_id: v.variation_id,
              quantity: v.quantity,
              track: v.track_inventory
            });
          });
        });
        dashCache = rows;
        renderDashTable();
      })
      .catch(function(e) {
        dashTbody.innerHTML = '<tr><td colspan="6" class="admin_table_nores">取得失敗: ' + esc(e.message) + '</td></tr>';
      });
  }

  function renderDashTable() {
    if (!dashTbody) return;
    var q = ((dashSearch && dashSearch.value) || '').toLowerCase().trim();
    var rows = dashCache.filter(function(r) {
      if (!q) return true;
      return (r.item_name + ' ' + r.variation_name + ' ' + r.variation_id).toLowerCase().indexOf(q) !== -1;
    });
    if (dashCount) dashCount.textContent = rows.length + ' / ' + dashCache.length + ' 件';
    if (!rows.length) {
      dashTbody.innerHTML = '<tr><td colspan="6" class="admin_table_nores">該当する商品がありません</td></tr>';
      return;
    }
    dashTbody.innerHTML = rows.map(function(r) {
      var priceStr = r.price != null
        ? '¥' + Number(r.price / 100).toLocaleString('ja-JP')
        : '—';
      var qtyCls = r.quantity <= 0 ? 'cash' : (r.quantity < 5 ? 'var' : 'ok');
      return '<tr>' +
        '<td><strong>' + esc(r.item_name) + '</strong></td>' +
        '<td>' + esc(r.variation_name) + '</td>' +
        '<td>' + priceStr + '</td>' +
        '<td><code style="font-size:11px;">' + esc(r.variation_id) + '</code></td>' +
        '<td><span class="admin_pill ' + qtyCls + '">' + r.quantity + '</span></td>' +
        '<td><button type="button" class="admin_table_btn" data-copy-vid="' + esc(r.variation_id) + '">IDコピー</button></td>' +
      '</tr>';
    }).join('');
    dashTbody.querySelectorAll('[data-copy-vid]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.dataset.copyVid;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(id).then(function() {
            showToast('Variation ID をコピーしました: ' + id, 'info');
          }).catch(function() {
            showToast(id, 'info');
          });
        } else {
          // fallback
          var ta = document.createElement('textarea');
          ta.value = id;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); showToast('Variation ID をコピーしました', 'info'); }
          catch(e) { showToast(id, 'info'); }
          document.body.removeChild(ta);
        }
      });
    });
  }

  if (dashLocSel) {
    dashLocSel.addEventListener('change', function() {
      var v = dashLocSel.value;
      if (v) fetchSquareCatalog(v);
    });
  }
  if (dashRefresh) {
    dashRefresh.addEventListener('click', function() {
      if (dashLocSel && dashLocSel.value) fetchSquareCatalog(dashLocSel.value);
      else showToast('店舗を選択してください', 'error');
    });
  }
  if (dashSearch) {
    dashSearch.addEventListener('input', renderDashTable);
  }

  // ---------- Initial render ----------
  Object.keys(state).forEach(function(key) {
    renderPanel(key);
  });

  // Show flash from server
  if (window.ADMIN_FLASH) {
    var parts = window.ADMIN_FLASH.split(':');
    showToast(parts.slice(1).join(':'), parts[0]);
  }

  // Warn before leaving with unsaved changes
  window.addEventListener('beforeunload', function(e) {
    var hasDirty = Object.keys(state).some(function(k){ return state[k].dirty; });
    if (hasDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
})();
