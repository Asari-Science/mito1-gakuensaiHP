<?php $base_path = '..'; ?>
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>お問い合わせ | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="第78回学苑祭のお問い合わせフォーム入力ページです。当学苑祭に対するご意見・ご感想等ありましたらぜひご記入ください。">

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $base_path; ?>/assets/css/contact.css">
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
         <main class="contact_main">
            <div class="contact_container">
                <div class="contact_ellipse"></div>
                <div class="contact_content">
                    <!-- Title -->
                    <p class="contact_label">Contact</p>
                    <h1 class="contact_title">お問い合わせ</h1>
                    <div class="contact_divider_center"></div>

                    <p class="contact_intro">
                        当学苑祭に対するご意見・ご感想等がございましたら、<br class="pc_br">以下のフォームよりお気軽にお問い合わせください。
                    </p>

                    <!-- Form -->
                    <form id="google-form" class="contact_form" novalidate>

                        <!-- 免責事項（プルダウンで収納） -->
                        <section class="contact_section">
                            <div class="contact_section_header">
                                <div class="section_step">1</div>
                                <h2 class="contact_section_title">免責事項の確認</h2>
                            </div>
                            <div class="disclaimer_wrapper">
                                <button type="button" class="disclaimer_toggle" id="disclaimer_toggle" aria-expanded="false" aria-controls="disclaimer_body">
                                    <span class="disclaimer_toggle_text">免責事項を表示する</span>
                                    <svg class="disclaimer_toggle_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div class="disclaimer_body" id="disclaimer_body">
                                    <p class="disclaimer_text">
                                        当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当ブログのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。本サイトのお問い合わせフォームで送信された内容は、担当教員に共有いたします。回答は必ずしも保証されたものではありません。
                                    </p>
                                </div>
                                <label class="agree_row" for="agree1">
                                    <input type="checkbox" id="agree1" class="contact_checkbox" required>
                                    <span class="checkbox_custom"></span>
                                    <span class="checkbox_text">免責事項に同意する</span>
                                </label>
                            </div>
                        </section>

                        <!-- プライバシーポリシー（リンク形式） -->
                        <section class="contact_section">
                            <div class="contact_section_header">
                                <div class="section_step">2</div>
                                <h2 class="contact_section_title">プライバシーポリシーの確認</h2>
                            </div>
                            <div class="privacy_link_wrapper">
                                <p class="privacy_link_desc">
                                    お問い合わせの前に、当サイトの<a href="<?php echo $base_path; ?>/pages/privacy.php" target="_blank" rel="noopener noreferrer" class="privacy_inline_link">プライバシーポリシー<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="external_icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>をご確認ください。
                                </p>
                                <label class="agree_row" for="agree2">
                                    <input type="checkbox" id="agree2" class="contact_checkbox" required>
                                    <span class="checkbox_custom"></span>
                                    <span class="checkbox_text">プライバシーポリシーに同意する</span>
                                </label>
                            </div>
                        </section>

                        <!-- お問い合わせ内容 -->
                        <section class="contact_section">
                            <div class="contact_section_header">
                                <div class="section_step">3</div>
                                <h2 class="contact_section_title">お問い合わせ内容</h2>
                            </div>
                            <div class="form_fields">
                                <div class="form_group">
                                    <label for="contact_name" class="form_label">
                                        お名前
                                        <span class="form_required">必須</span>
                                    </label>
                                    <input type="text" id="contact_name" class="form_input" placeholder="苑実太朗" required>
                                </div>
                                <div class="form_group">
                                    <label for="contact_email" class="form_label">
                                        メールアドレス
                                        <span class="form_required">必須</span>
                                    </label>
                                    <input type="email" id="contact_email" class="form_input" placeholder="info@example.com" required>
                                </div>
                                <div class="form_group">
                                    <label for="contact_tel" class="form_label">
                                        電話番号
                                        <span class="form_optional">任意</span>
                                    </label>
                                    <input type="tel" id="contact_tel" class="form_input" placeholder="090XXXXYYYY">
                                </div>
                                <div class="form_group">
                                    <label for="contact_detail" class="form_label">
                                        内容
                                        <span class="form_required">必須</span>
                                    </label>
                                    <textarea id="contact_detail" class="form_textarea" placeholder="ここに内容を入力してください..." rows="6" required></textarea>
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
                            <p class="submit_note">※ 回答は必ずしも保証されるものではありません</p>
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

                    <div class="contact_divider_center"></div>
                    <a href="https://gakuensai.net" class="contact_back">
                        <span class="back_arrow">&larr;</span>
                        トップページに戻る
                    </a>
                </div>
                <img src="<?php echo $base_path; ?>/materials/kujira.webp" class="contact_kujira" alt="鯨イラスト">
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
                var GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdgZahMeoPP4Oik63LPFNpGrHjXDIUCex1hgeh9YeO3hp-NYg/formResponse';

                // Google Forms entry IDs（実際のフォームから取得済み）
                var ENTRY_DISCLAIMER = 'entry.1344695929';
                var ENTRY_PRIVACY    = 'entry.139436178';
                var ENTRY_NAME       = 'entry.440310066';
                var ENTRY_EMAIL      = 'entry.1162366081';
                var ENTRY_TEL        = 'entry.1689851239';
                var ENTRY_DETAIL     = 'entry.254231395';

                // DOM要素
                var form = document.getElementById('google-form');
                var checkDisclaimer = document.getElementById('agree1');
                var checkPrivacy = document.getElementById('agree2');
                var submitBtn = document.getElementById('submit_btn');
                var successMessage = document.getElementById('success_message');
                var errorMessage = document.getElementById('error_message');
                var retryBtn = document.getElementById('retry_btn');

                // 免責事項のトグル
                var disclaimerToggle = document.getElementById('disclaimer_toggle');
                var disclaimerBody = document.getElementById('disclaimer_body');

                disclaimerToggle.addEventListener('click', function() {
                    var isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isExpanded);
                    disclaimerBody.classList.toggle('open');
                    var toggleText = this.querySelector('.disclaimer_toggle_text');
                    toggleText.textContent = isExpanded ? '免責事項を表示する' : '免責事項を閉じる';
                });

                // 送信ボタンの有効・無効を切り替え
                function toggleSubmitButton() {
                    submitBtn.disabled = !(checkDisclaimer.checked && checkPrivacy.checked);
                }
                checkDisclaimer.addEventListener('change', toggleSubmitButton);
                checkPrivacy.addEventListener('change', toggleSubmitButton);

                // リトライボタン
                retryBtn.addEventListener('click', function() {
                    errorMessage.style.display = 'none';
                    form.style.display = '';
                });

                // フォーム送信処理
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // バリデーション
                    var nameVal = document.getElementById('contact_name').value.trim();
                    var emailVal = document.getElementById('contact_email').value.trim();
                    var detailVal = document.getElementById('contact_detail').value.trim();
                    var telVal = document.getElementById('contact_tel').value.trim();

                    if (!nameVal || !emailVal || !detailVal) {
                        form.reportValidity();
                        return;
                    }

                    // 送信中状態
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');

                    // FormData を構築して fetch で送信
                    // Google Forms は CORS を許可しないため no-cors モードで送信
                    var formData = new FormData();
                    formData.append(ENTRY_DISCLAIMER, '同意する');
                    formData.append(ENTRY_PRIVACY, '同意する');
                    formData.append(ENTRY_NAME, nameVal);
                    formData.append(ENTRY_EMAIL, emailVal);
                    formData.append(ENTRY_TEL, telVal);
                    formData.append(ENTRY_DETAIL, detailVal);

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
