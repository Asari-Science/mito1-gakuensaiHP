<?php
// ヘッダー・フッター内のルート基準のパスを、下層ページ（../）用に安全に自動変換する関数
function get_fixed_include($include_path) {
    ob_start();
    $base_path = '..'; // header.php 等で使われる変数としてセット
    include($include_path);
    $html = ob_get_clean();
    
    // src="materials/ や src="./materials/ などの記述をすべて ../materials/ に置換
    $html = str_replace('src="materials/', 'src="../materials/', $html);
    $html = str_replace('src="./materials/', 'src="../materials/', $html);
    $html = str_replace('src=\'materials/', 'src=\'../materials/', $html);
    $html = str_replace('src=\'./materials/', 'src=\'../materials/', $html);
    
    // アセットやリンクのパスも同様に補正
    $html = str_replace('src="assets/', 'src="../assets/', $html);
    $html = str_replace('src="./assets/', 'src="../assets/', $html);
    $html = str_replace('href="pages/', 'href="../pages/', $html);
    $html = str_replace('href="./pages/', 'href="../pages/', $html);
    $html = str_replace('href="index.php"', 'href="../index.php"', $html);
    
    return $html;
}
?>
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Othello - オセロの源流 | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="第78回学苑祭「天翔る」イースターエッグ。水戸中学校出身の考案者・長谷川五郎氏の記憶を辿る。">
        <link rel="canonical" href="https://gakuensai.net/pages/othello.php">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="../assets/css/reset.css">
        <link rel="stylesheet" href="../assets/css/header.css">
        <link rel="stylesheet" href="../assets/css/footer.css">
        <link rel="stylesheet" href="../assets/css/othello.css">

        <meta name="msapplication-square70x70logo" content="../materials/favicon/site-tile-70x70.png">
        <meta name="msapplication-square150x150logo" content="../materials/favicon/site-tile-150x150.png">
        <meta name="msapplication-wide310x150logo" content="../materials/favicon/site-tile-310x150.png">
        <meta name="msapplication-square310x310logo" content="../materials/favicon/site-tile-310x310.png">
        <meta name="msapplication-TileColor" content="#0078d7">
        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="apple-touch-icon" sizes="57x57" href="../materials/favicon/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="../materials/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="../materials/favicon/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="../materials/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="../materials/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="../materials/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="../materials/favicon/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="../materials/favicon/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="../materials/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="36x36" href="../materials/favicon/android-chrome-36x36.png">
        <link rel="icon" type="image/png" sizes="48x48" href="../materials/favicon/android-chrome-48x48.png">
        <link rel="icon" type="image/png" sizes="72x72" href="../materials/favicon/android-chrome-72x72.png">
        <link rel="icon" type="image/png" sizes="96x96" href="../materials/favicon/android-chrome-96x96.png">
        <link rel="icon" type="image/png" sizes="128x128" href="../materials/favicon/android-chrome-128x128.png">
        <link rel="icon" type="image/png" sizes="144x144" href="../materials/favicon/android-chrome-144x144.png">
        <link rel="icon" type="image/png" sizes="152x152" href="../materials/favicon/android-chrome-152x152.png">
        <link rel="icon" type="image/png" sizes="192x192" href="../materials/favicon/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="256x256" href="../materials/favicon/android-chrome-256x256.png">
        <link rel="icon" type="image/png" sizes="384x384" href="../materials/favicon/android-chrome-384x384.png">
        <link rel="icon" type="image/png" sizes="512x512" href="../materials/favicon/android-chrome-512x512.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../materials/favicon/icon-16x16.png">
        <link rel="icon" type="image/png" sizes="24x24" href="../materials/favicon/icon-24x24.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../materials/favicon/icon-32x32.png">
        <link rel="manifest" href="../materials/favicon/manifest.json">
        <meta name="theme-color" content="#f6dc9f">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="学苑祭">
    </head>
    <body>
        <?php echo get_fixed_include(__DIR__ . "/../includes/header.php"); ?>

        <main>
            <section class="othello_section">
                <div class="othello_container">
                    
                    <div class="othello_header_block">
                        <p class="othello_subtitle">Mito Intelligence Easter Egg</p>
                        <h1 class="othello_title">オセロの源流</h1>
                        <div class="othello_decorator_line"></div>
                        <p class="othello_desc">
                            オセロ（Othello）の考案者である長谷川五郎氏は、<br>
                            現在の水戸一高である旧制水戸中学校の出身です。<br>
                            学苑祭の片隅に隠されたこの盤上で、穏やかな思考の海を漂いましょう。。
                        </p>
                    </div>

                    <div class="othello_game_box">
                        <p id="info" class="othello_info">AIシステム起動中...</p>
                        
                        <div class="canvas_wrapper">
                            <canvas id="board" width="400" height="400"></canvas>
                        </div>
                        
                        <div class="othello_controls">
                            <button id="btn-black" class="othello_btn" disabled>黒で参戦（先手）</button>
                            <button id="btn-white" class="othello_btn" disabled>白で参戦（後手）</button>
                        </div>

                        <textarea id="log" style="display: none;"></textarea>
                    </div>

                </div>
            </section>
         </main>

        <?php echo get_fixed_include(__DIR__ . "/../includes/footer.php"); ?>

        <script src="../assets/js/menu.js"></script>
        <script src="../assets/js/loading.js"></script>
        <script src="../assets/js/othello/main.js"></script>
    </body>
</html>
