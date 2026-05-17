<?php $base_path = '..'; ?>
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>学苑祭応援パック購入予約 | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="第78回学苑祭の応援パック購入予約フォームのページです。5月18日から31日まで予約を受け付けています。">
        <link rel="canonical" href="https://gakuensai.net/pages/pack-reservation.php">

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/pack-reservation.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/header.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/footer.css">

        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php echo $base_path; ?>/materials/favicon/favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="<?php echo $base_path; ?>/materials/favicon/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $base_path; ?>/materials/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="<?php echo $base_path; ?>/materials/favicon/android-chrome-192x192.png">

        <link rel="manifest" href="<?php echo $base_path; ?>/materials/favicon/manifest.json">

    </head>
    <body>
        <!-- Header -->
         <?php include(__DIR__ . "/../includes/header.php"); ?>
        <!-- Main -->
         <main class="pack_res_main">
            <div class="pack_res_container">
                <div class="pack_res_ellipse"></div>
                <div class="pack_res_content">
                    <!-- Title -->
                    <p class="pack_res_label">Reservation Form</p>
                    <h1 class="pack_res_title">学苑祭応援パック<br>予約フォーム</h1>
                    <div class="pack_res_divider_center"></div>

                    <!-- Form -->
                    <form id="google-form" class="pack_res_form" novalidate>

                        <!-- 実施概要（プルダウンで収納） -->
                        <section class="pack_res_section">
                            <div class="pack_res_section_header">
                                <div class="section_step">1</div>
                                <h2 class="pack_res_section_title">実施概要</h2>
                            </div>
                            <div class="precautions_wrapper">
                                <p class="precautions_notice">
                                    応援パックは実施概要に基づき取り扱います。<br>内容をご確認の上、同意する場合はチェックボックスにチェックを入れてください。
                                </p>
                            </div>
                            <div class="precautions_wrapper_toggle">
                                <button type="button" class="precautions_toggle" id="precautions_toggle" aria-expanded="false" aria-controls="precautions_body">
                                    <span class="precautions_toggle_text">実施概要を表示する</span>
                                    <svg class="precautions_toggle_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div class="precautions_body" id="precautions_body">
                                    <!-- 商品概要 -->
                                    <section class="pr_summary_section" aria-label="商品概要">
                                        <dl class="pr_summary_list">
                                            <div class="pr_summary_item">
                                                <dt>商品名</dt>
                                                <dd>学苑祭応援パック</dd>
                                            </div>
                                            <div class="pr_summary_item">
                                                <dt>価格</dt>
                                                <dd>
                                                    <span class="pr_price">2,000<small>円</small></span>
                                                    <span class="pr_price_break">グッズ合計額 1,800円 ＋ 学苑祭運営支援分 200円</span>
                                                </dd>
                                            </div>
                                            <div class="pr_summary_item">
                                                <dt>販売場所</dt>
                                                <dd>1Fホール</dd>
                                            </div>
                                        </dl>
                                    </section>

                                    <!-- 注意事項 -->
                                    <section class="pr_notes_section" aria-labelledby="pr_notes_heading">
                                        <h4 id="pr_notes_heading" class="pr_notes_heading">注意事項</h4>
                                        <ol class="pr_notes">
                                            <li class="pr_note">
                                                <h5 class="pr_note_title"><span class="pr_note_num">1</span>申込</h5>
                                                <p>本パックは原則予約制です。公式サイト及びSNSに掲載しているGoogleフォームから予約が行えます。</p>
                                                <p class="pr_note_emphasis">募集期間：5/18(月)～5/31(金)</p>
                                            </li>
                                            <li class="pr_note">
                                                <h5 class="pr_note_title"><span class="pr_note_num">2</span>受け渡し・お支払い</h5>
                                                <ul class="pr_note_list">
                                                    <li>予約確認用QRコードを、Googleフォームに入力いただいたメールアドレス宣に送付します。当日には、グッズ販売ブースでそのQRコードをスタッフに提示していただき、本人確認を行います。</li>
                                                    <li>学苑祭当日は大変な混雑による通信の悪化が予想されます。QRコードは事前にスクリーンショットすることを推奨します。</li>
                                                    <li>代金は学苑祭当日の受け渡し時にお支払いいただきます。</li>
                                                </ul>
                                            </li>
                                            <li class="pr_note">
                                                <h5 class="pr_note_title"><span class="pr_note_num">3</span>数量</h5>
                                                <ul class="pr_note_list">
                                                    <li>学苑祭応援パックは<strong>100個のみの限定販売</strong>です。予約数が上限に達し次第、受付を終了します。</li>
                                                    <li>スマホやメール利用が難しい方への配慮として、学苑祭当日の応援パック販売も一定数実施予定です。ただし、数量には限りがあるため、確実に購入を希望される場合は事前予約フォームをご利用ください。</li>
                                                </ul>
                                            </li>
                                            <li class="pr_note">
                                                <h5 class="pr_note_title"><span class="pr_note_num">4</span>その他</h5>
                                                <ul class="pr_note_list">
                                                    <li>予約された方が入場終了時間までに来場されなかった場合、在庫状況に応じて通常販売へ回す場合があります。</li>
                                                    <li>通常のグッズ単品販売も別途実施予定です。</li>
                                                    <li>予約フォームを通じて取得したメールアドレスは、予約システムの運用のみに利用いたします。また、保有する必要がなくなった場合は、速やかに廃棄または消去します。</li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </section>
                                </div>
                                <label class="agree_row" for="agree1">
                                    <input type="checkbox" id="agree1" class="pack_res_checkbox" required>
                                    <span class="checkbox_custom"></span>
                                    <span class="checkbox_text">上記の内容に同意します。</span>
                                </label>
                            </div>
                        </section>

                        <!-- 購入予約 -->
                        <section class="pack_res_section">
                            <div class="pack_res_section_header">
                                <div class="section_step">2</div>
                                <h2 class="pack_res_section_title">購入予約</h2>
                            </div>
                            <img src="<?php echo $base_path; ?>/materials/goods_list.webp" class="pack_image" alt="A4クリアファイル 3種 / メモ帳 / ボールペン / ステッカー / アクキー">
                            <div class="form_fields">
                                <div class="form_group">
                                    <label for="pack_res_email" class="form_label">
                                        メールアドレス
                                        <span class="form_required">必須</span>
                                    </label>
                                    <input type="email" id="pack_res_email" class="form_input" placeholder="info@example.com" required>
                                </div>
                                <div class="form_group">
                                    <p class="form_label" id="qty_label">購入個数<span class="form_required">必須</span></p>
                                    <!-- カスタムドロップダウン -->
                                    <div class="custom_select" id="qty_custom_select" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="qty_label" aria-controls="qty_listbox">
                                        <button type="button" class="custom_select_trigger" id="qty_trigger" aria-expanded="false">
                                            <span class="custom_select_value" id="qty_display">個数を選択してください</span>
                                            <svg class="custom_select_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        <ul class="custom_select_dropdown" id="qty_listbox" role="listbox" aria-label="購入個数">
                                            <li class="custom_select_option" role="option" data-value="1" aria-selected="false">1個</li>
                                            <li class="custom_select_option" role="option" data-value="2" aria-selected="false">2個</li>
                                            <li class="custom_select_option" role="option" data-value="3" aria-selected="false">3個</li>
                                            <li class="custom_select_option" role="option" data-value="4" aria-selected="false">4個</li>
                                            <li class="custom_select_option" role="option" data-value="5" aria-selected="false">5個</li>
                                        </ul>
                                    </div>
                                    <!-- 値保持用hidden input（バリデーション・FormData送信に使用） -->
                                    <input type="hidden" id="pack_res_qty" name="pack_res_qty">
                                </div>
                                <div class="form_group">
                                    <p class="form_label">来場予定日<span class="form_required">必須</span></p>
                                    <div class="radio_group">
                                        <label class="radio_row" for="visit_day1">
                                            <input type="radio" id="visit_day1" name="pack_res_visit_date" class="pack_res_radio" value="1日目(6/20)" required>
                                            <span class="radio_custom"></span>
                                            <span class="radio_text">1日目（6/20）</span>
                                        </label>
                                        <label class="radio_row" for="visit_day2">
                                            <input type="radio" id="visit_day2" name="pack_res_visit_date" class="pack_res_radio" value="2日目(6/21)">
                                            <span class="radio_custom"></span>
                                            <span class="radio_text">2日目（6/21）</span>
                                        </label>
                                        <label class="radio_row" for="visit_day_tbd">
                                            <input type="radio" id="visit_day_tbd" name="pack_res_visit_date" class="pack_res_radio" value="未定">
                                            <span class="radio_custom"></span>
                                            <span class="radio_text">未定</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Submit -->
                        <div class="submit_wrapper">
                            <button id="submit_btn" type="submit" class="submit_button" disabled>
                                <span class="submit_text">送信する</span>
                                <svg class="submit_icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </form>

                    <!-- 送信完了メッセージ（初期非表示） -->
                    <div id="success_message" class="success_message" style="display:none;">
                        <div class="success_icon_wrapper">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a8c3f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2 class="success_title">送信が完了しました</h2>
                        <p class="success_desc">お問い合わせいただきありがとうございます。<br>内容を確認の上、必要に応じてご連絡いたします。</p>
                    </div>

                    <!-- 送信エラーメッセージ（初期非表示） -->
                    <div id="error_message" class="error_message" style="display:none;">
                        <div class="error_icon_wrapper">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c24b31" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h2 class="error_title">送信に失敗しました</h2>
                        <p class="error_desc">申し訳ございません。時間をおいて再度お試しください。</p>
                        <button id="retry_btn" type="button" class="retry_button">もう一度試す</button>
                    </div>

                    <div class="pack_res_divider_center"></div>
                    <a href="https://gakuensai.net" class="pack_res_back">
                        <span class="back_arrow">&larr;</span>
                        トップページに戻る
                    </a>
                </div>
                <img src="<?php echo $base_path; ?>/materials/kujira.webp" class="pack_res_kujira" alt="鯨イラスト">
            </div>
         </main>
        <!-- Footer -->
         <?php include(__DIR__ . "/../includes/footer.php"); ?>
        <!-- Script -->
         <script src="<?php echo $base_path; ?>/assets/js/menu.js"></script>
        <!-- お問い合わせフォーム送信用JS -->
         <script>
            (function() {
                // Google Forms エンドポイント
                var GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/u/0/d/1VRczi4n9JbpXPfEUTy9vs0jCB9GSdiV-BSKqXgQOHMY/formResponse';

                // Google Forms entry IDs（正しいIDを取得済み（フォームが公開されてないので動作確認はできていません））
                var ENTRY_EMAIL      = 'emailAddress';
                var ENTRY_PO_QTY        = 'entry.1765809917'; // 購入個数
                var ENTRY_VST_DATE     = 'entry.1487443438'; // 来場予定日
                var ENTRY_AGRT     = 'entry.1082289952'; // 同意チェック

                // DOM要素
                var form = document.getElementById('google-form');
                var checkPreCautions = document.getElementById('agree1');
                var submitBtn = document.getElementById('submit_btn');
                var successMessage = document.getElementById('success_message');
                var errorMessage = document.getElementById('error_message');
                var retryBtn = document.getElementById('retry_btn');

                // 注意事項のトグル
                var precautionsToggle = document.getElementById('precautions_toggle');
                var precautionsBody = document.getElementById('precautions_body');

                precautionsToggle.addEventListener('click', function() {
                    var isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isExpanded);
                    precautionsBody.classList.toggle('open');
                    var toggleText = this.querySelector('.precautions_toggle_text');
                    toggleText.textContent = isExpanded ? '実施概要を表示する' : '実施概要を閉じる';
                });

                // 送信ボタンの有効・無効を切り替え
                function toggleSubmitButton() {
                    submitBtn.disabled = !(checkPreCautions.checked);
                }
                checkPreCautions.addEventListener('change', toggleSubmitButton);

                // カスタムドロップダウン制御
                (function() {
                    var wrapper  = document.getElementById('qty_custom_select');
                    var trigger  = document.getElementById('qty_trigger');
                    var dropdown = document.getElementById('qty_listbox');
                    var display  = document.getElementById('qty_display');
                    var hiddenInput = document.getElementById('pack_res_qty');
                    var options  = dropdown.querySelectorAll('.custom_select_option');

                    function openDropdown() {
                        wrapper.setAttribute('aria-expanded', 'true');
                        trigger.setAttribute('aria-expanded', 'true');
                        wrapper.classList.add('open');
                    }

                    function closeDropdown() {
                        wrapper.setAttribute('aria-expanded', 'false');
                        trigger.setAttribute('aria-expanded', 'false');
                        wrapper.classList.remove('open');
                    }

                    trigger.addEventListener('click', function(e) {
                        e.stopPropagation();
                        wrapper.classList.contains('open') ? closeDropdown() : openDropdown();
                    });

                    options.forEach(function(opt) {
                        opt.addEventListener('click', function() {
                            var val   = this.getAttribute('data-value');
                            var label = this.textContent;
                            hiddenInput.value = val;
                            display.textContent = label;
                            display.classList.add('selected');
                            options.forEach(function(o) { o.setAttribute('aria-selected', 'false'); o.classList.remove('active'); });
                            this.setAttribute('aria-selected', 'true');
                            this.classList.add('active');
                            closeDropdown();
                        });
                    });

                    // ドロップダウン外クリックで閉じる
                    document.addEventListener('click', function(e) {
                        if (!wrapper.contains(e.target)) closeDropdown();
                    });

                    // Escキーで閉じる
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') closeDropdown();
                    });
                })();

                // リトライボタン
                retryBtn.addEventListener('click', function() {
                    errorMessage.style.display = 'none';
                    form.style.display = '';
                });

                // フォーム送信処理
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // バリデーション
                    var emailVal = document.getElementById('pack_res_email').value.trim();
                    var qtyVal = document.getElementById('pack_res_qty').value;
                    var visitDateEl = document.querySelector('input[name="pack_res_visit_date"]:checked');
                    var visitDateVal = visitDateEl ? visitDateEl.value : '';

                    if (!emailVal || !qtyVal || !visitDateVal) {
                        form.reportValidity();
                        return;
                    }

                    // 送信中状態
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');

                    // FormData を構築して fetch で送信
                    // Google Forms は CORS を許可しないため no-cors モードで送信
                    var formData = new FormData();
                    formData.append(ENTRY_AGRT, '上記の内容に同意します。');
                    formData.append(ENTRY_EMAIL, emailVal);
                    formData.append(ENTRY_PO_QTY, qtyVal);
                    formData.append(ENTRY_VST_DATE, visitDateVal);

                    fetch(GOOGLE_FORM_ACTION, {
                        method: 'POST',
                        mode: 'no-cors',
                        body: formData
                    }).then(function() {
                        // no-cors ではレスポンスを読めないが、ネットワークエラーでなければ成功とみなす
                        form.style.display = 'none';
                        successMessage.style.display = '';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }).catch(function(err) {
                        console.error('送信エラー:', err);
                        form.style.display = 'none';
                        errorMessage.style.display = '';
                        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }).finally(function() {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('loading');
                    });
                });
            })();
        </script>
    </body>
</html>
