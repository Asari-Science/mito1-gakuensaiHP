<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>404 Not Found | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="お探しのページは見つかりませんでした。第78回学苑祭の公式サイト。">

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="../assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/404.css">
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
         <main class="notfound_main">
            <div class="notfound_container">
                <div class="notfound_ellipse"></div>
                <div class="notfound_content">
                    <p class="notfound_label">404 Not Found</p>
                    <h1 class="notfound_title">ページが<br>見つかりません</h1>
                    <p class="notfound_message">
                        お探しのページは存在しないか、<br>
                        移動した可能性があります。
                    </p>
                    <div class="notfound_divider"></div>
                    <p class="notfound_date">
                        第78回学苑祭<br>
                        <span>2026.6.20 - 6.21</span>
                    </p>
                    <a href="https://gakuensai.net" class="notfound_back">
                        <span class="back_arrow">&larr;</span>
                        トップページに戻る
                    </a>
                </div>
                <img src="../materials/kujira.webp" class="notfound_kujira" alt="鯨イラスト">
            </div>
         </main>
        <!-- Footer -->
         <?php include(__DIR__ . "/../includes/footer.php"); ?>
        <!-- Script -->
         <script src="../assets/js/menu.js"></script>
    </body>
</html>
