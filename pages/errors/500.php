<!DOCTYPE html>
<html lang="ja">
<style>
        .header_frame,
        .header_bg,
        .header_bg.active {
            background: transparent !important;
            background-color: transparent !important;
        }
        .header_countdown {
            color: #ffffff !important;
        }
    </style>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>500 - 計器異常 | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="サーバーエラーが発生しました。第78回学苑祭の公式サイト。">

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="../../assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="../../assets/css/errors/error-common.css">
        <link rel="stylesheet" type="text/css" href="../../assets/css/header.css">
        <link rel="stylesheet" type="text/css" href="../../assets/css/footer.css">

        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../../materials/favicon/favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="../../materials/favicon/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="../../materials/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="../../materials/favicon/android-chrome-192x192.png">

        <link rel="manifest" href="../../materials/favicon/manifest.json">

    </head>
    <body>
        <?php $base_path = '../..'; ?>
        <!-- Header -->
         <?php include(__DIR__ . "/../../includes/header.php"); ?>
        <!-- Main -->
         <main class="error_main">
            <div class="error_container error_500">
                <!-- Sky Background -->
                <div class="error_sky"></div>

                <!-- Stars -->
                <div class="error_stars" id="error_stars"></div>

                <!-- Clouds -->
                <div class="error_clouds">
                    <div class="error_cloud"></div>
                    <div class="error_cloud"></div>
                    <div class="error_cloud"></div>
                </div>

                <!-- Floating Particles -->
                <div class="error_particles">
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                    <div class="error_particle"></div>
                </div>

                <!-- Content -->
                <div class="error_content">
                    <p class="error_code">Instrument Failure</p>
                    <p class="error_altitude">500</p>
                    <p class="error_altitude_unit">- SYSTEM ERROR -</p>

                    <h1 class="error_title">計器に一時的な<br>不具合が発生</h1>

                    <p class="error_message">
                        創造の限界高度を超えた衝撃で、<br>
                        コックピットの計器が一時的に乱れました。<br>
                        現在、地上のエンジニアが修復中です。
                    </p>

                    <div class="error_divider"></div>

                    <p class="error_date">
                        第78回学苑祭<br>
                        <span>2026.6.20 - 6.21</span>
                    </p>

                    <a href="https://gakuensai.net" class="error_back">
                        <span class="back_arrow">&larr;</span>
                        <span>地上に帰還する</span>
                    </a>
                </div>

                <!-- Horizon Line -->
                <div class="error_horizon"></div>
            </div>
         </main>
        <!-- Footer -->
         <?php include(__DIR__ . "/../../includes/footer.php"); ?>
        <!-- Script -->
         <script src="../../assets/js/menu.js"></script>
         <script src="../../assets/js/error-stars.js"></script>
    </body>
</html>
