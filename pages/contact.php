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

        <link rel="stylesheet" type="text/css" href="../assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/contact.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/header.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/footer.css">

        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="../materials/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="../materials/favicon/android-chrome-192x192.png">

        <link rel="manifest" href="../materials/favicon/manifest.json">

    </head>
    <body>
        <?php $base_path = '..'; ?>
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
                    <form id="google-form" action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdgZahMeoPP4Oik63LPFNpGrHjXDIUCex1hgeh9YeO3hp-NYg/formResponse" method="POST" target="hidden_iframe">
                        <section id="disclaimer" class="disclaimer">
                            <div class="disclaimer_container">
                                <h2 class="box_title">免責事項</h2>
                                <p>
                                    当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当ブログのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。本サイトのお問い合わせフォームで送信された内容は、担当教員に共有いたします。回答は必ずしも保証されたものではありません。
                                </p>
                            </div>
                            <div class="agreeButton">
                                <input type="checkbox" name="entry.1199177229" value="同意する" id="agree1" required>
                                <label for="agree1">同意する</label>
                            </div>
                        </section>
                        <section id="privacy_policy" class="privacy_policy">
                            <div class="privacy_policy_container">
                                <h2 class="box_title">プライバシーポリシー</h2>
                                <div id="policy_box" class="policy_box">
                                    <p>
                                        学苑祭ホームページ（以下「学苑祭ＨＰ」という）では，個人情報の取得，利用，提供，管理等について，「茨城県個人情報の保護に関する条例」を参考にし、次の通り適切に取り扱うとともに，皆様に安心して利用いただけるホームページづくりに努めてまいります。<br><br>
                                        個人情報とは<br>
                                        学苑祭HPを通じて提供を受けた、住所、氏名、電話番号、E-mailアドレス等、個人が特定され得る情報をいいます。<br><br>
                                        個人情報の収集について<br>
                                        学苑祭HPを通じて個人情報を収集する際は、利用者ご本人の意思による情報提供を原則とします。個人情報の収集は、その収集目的を明確にし、その目的を達成するために必要な範囲内で行います。また学苑祭HP上で公開する個人情報は、公開することを明示した上で取得します。<br><br>
                                        個人情報の利用制限<br>
                                        取得した個人情報は、あらかじめ明示した収集目的の範囲内で利用いたします。個人情報を利用者ご本人の同意なく明示した収集目的以外で利用・提供することはありません。ただし、例外として、各法令で定める場合を除きます。<br><br>
                                        個人情報の管理<br>
                                        取得した個人情報は、厳重に管理し、漏洩、不正流用、改ざん等の防止に適切な対策を講じ、正確性の確保に努めてまいります。
                                    </p>
                                </div>
                                <div class="agreeButton">
                                    <input type="checkbox" name="entry.1984305978" value="同意する" id="agree2" disabled required>
                                    <label for="agree2">同意する</label>
                                </div>
                            </div>
                        </section>
                        <section id="contact_contents">
                            <div class="contact_name_box">
                                <h3 class="">お名前</h3>
                                <input type="text" name="entry.715739101" id="name" class="name" placeholder="苑実太朗" required>
                            </div>
                            <div class="contact_mail_box">
                                 <h3 class="">メールアドレス</h3>
                                <input type="email" name="entry.1581029366" id="email" class="email" placeholder="info@example.com" required>
                            </div>
                            <div class="contact_tel_box">
                                <h3 class="">電話番号（任意）</h3>
                                <input type="tel" name="entry.1166544972" id="phonenumber" class="phonenumber" placeholder="XXXYYYYZZZZ">
                            </div>
                            <div class="contact_detail">
                                <h3 class="">内容</h3>
                                <textarea name="entry.1072328491" id="detail" class="detail" placeholder="ここに内容を入力してください..." required></textarea>
                            </div>
                            <div class="send_button">
                                <input id="submit_btn" type="submit" value="送信" disabled>
                            </div>
                        </section>
                    </form>
                    
                    <div class="contact_divider_center"></div>
                    <a href="https://gakuensai.net" class="contact_back">
                        <span class="back_arrow">&larr;</span>
                        トップページに戻る
                    </a>
                </div>
                <img src="../materials/kujira.webp" class="contact_kujira" alt="鯨イラスト">
            </div>
         </main>
        <!-- Footer -->
         <?php include(__DIR__ . "/../includes/footer.php"); ?>
        <!-- Script -->
         <script src="../assets/js/menu.js"></script>
        <!-- プライバシーポリシー用js -->
         <script>
            const policyBox = document.getElementById('policy_box');
            const checkbox = document.getElementById('agree2');

            const checkDisclaimer = document.getElementById('agree1');
            const checkPolicy = document.getElementById('agree2');
            const submitBtn = document.getElementById('submit_btn');

            policyBox.addEventListener('scroll', function() {
                // スクロール量が一番下に達したかを判定
                if (policyBox.scrollHeight - policyBox.scrollTop <= policyBox.clientHeight + 2) {
                checkbox.disabled = false; // 一番下まで読んだらロック解除
                }
            });

            // ボタンの有効・無効を切り替える関数
            function toggleSubmitButton() {
                // 免責事項とプライバシーポリシーの「両方」がチェックされているか判定
                if (checkDisclaimer.checked && checkPolicy.checked) {
                    submitBtn.disabled = false; // ロック解除（ボタンを押せるようにする）
                } else {
                    submitBtn.disabled = true;  // ロック（ボタンを押せないようにする）
                }
            }
            
            // チェックボックスの状態が変わった時（クリックされた時）に関数を実行
            checkDisclaimer.addEventListener('change', toggleSubmitButton);
            checkPolicy.addEventListener('change', toggleSubmitButton);
        </script>
    </body>
</html>
