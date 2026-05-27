console.log = function() {}; // コンソールの出力を無効化
const BLACK = 0, WHITE = 1, EMPTY = -1, BOARD_SIZE = 8;
const canvas = document.getElementById('board');
const ctx = canvas ? canvas.getContext('2d') : null;
const logEl = document.getElementById('log');
const infoEl = document.getElementById('info');
const btnBlack = document.getElementById('btn-black');
const btnWhite = document.getElementById('btn-white');

let game = null;
let humanColor = null;
let aiColor = null;
let aiWorker = null;
let currentTurnCount = 0;

function appendLog(text) {
    if (!logEl) return;
    logEl.value += text;
    logEl.scrollTop = logEl.scrollHeight;
}

class OthelloGame {
    constructor() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
        this.board[3][3] = WHITE; this.board[4][4] = WHITE;
        this.board[3][4] = BLACK; this.board[4][3] = BLACK;
        this.currentTurn = BLACK;
    }

    getOpponent(player) { return player === BLACK ? WHITE : BLACK; }
    isOnBoard(r, c) { return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE; }

    getFlippableDiscs(r, c, player) {
        if (this.board[r][c] !== EMPTY) return [];
        const opponent = this.getOpponent(player);
        const flippable = [];
        const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

        for (let [dr, dc] of directions) {
            let nr = r + dr, nc = c + dc;
            let tempFlips = [];
            while (this.isOnBoard(nr, nc) && this.board[nr][nc] === opponent) {
                tempFlips.push([nr, nc]);
                nr += dr; nc += dc;
            }
            if (this.isOnBoard(nr, nc) && this.board[nr][nc] === player && tempFlips.length > 0) {
                flippable.push(...tempFlips);
            }
        }
        return flippable;
    }

    getLegalMoves(player) {
        const moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (this.getFlippableDiscs(r, c, player).length > 0) moves.push([r, c]);
            }
        }
        return moves;
    }

    applyMove(r, c, player) {
        if (r === -1 && c === -1) {
            this.currentTurn = this.getOpponent(this.currentTurn);
            return true;
        }
        const flips = this.getFlippableDiscs(r, c, player);
        if (flips.length === 0) return false;

        this.board[r][c] = player;
        for (let [fr, fc] of flips) this.board[fr][fc] = player;
        this.currentTurn = this.getOpponent(this.currentTurn);
        return true;
    }

    countDiscs() {
        let b = 0, w = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (this.board[r][c] === BLACK) b++;
                else if (this.board[r][c] === WHITE) w++;
            }
        }
        return [b, w];
    }
}

function initSystem() {
    if (!ctx) return;
    
    // pages/othello.php から見た相対パス（../）を使用してWorkerを読み込む
    aiWorker = new Worker('../assets/js/othello/worker.js');
    
    aiWorker.onmessage = function(e) {
        if (e.data.type === 'ready') {
            if (infoEl) infoEl.innerText = "手番を選択して開始してください";
            if (btnBlack) btnBlack.disabled = false;
            if (btnWhite) btnWhite.disabled = false;
        } else if (e.data.type === 'log') {
            appendLog(e.data.text);
        } else if (e.data.type === 'result') {
            handleAiMove(e.data.move);
        }
    };
    drawBoard();
}

function startGame(color) {
    game = new OthelloGame();
    humanColor = color;
    aiColor = color === BLACK ? WHITE : BLACK;
    currentTurnCount = 0;
    
    if (logEl) logEl.value = "--- ゲーム開始 ---\n";
    if (btnBlack && btnWhite) {
        btnBlack.style.display = 'none';
        btnWhite.style.display = 'none';
    }

    updateGUI();
    checkTurn();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1a1207"; // 枠線をサイト共通の墨色に
    ctx.lineWidth = 1;
    for (let i = 1; i < BOARD_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * 50, 0); ctx.lineTo(i * 50, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 50); ctx.lineTo(400, i * 50); ctx.stroke();
    }
}

function updateGUI() {
    drawBoard();
    if (!game || !ctx) return;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (game.board[r][c] !== EMPTY) {
                ctx.fillStyle = game.board[r][c] === BLACK ? "#1a1207" : "#fcfcfc";
                ctx.beginPath(); ctx.arc(c * 50 + 25, r * 50 + 25, 20, 0, Math.PI * 2); ctx.fill();
                // 石の輪郭にわずかなコントラストを付与
                ctx.strokeStyle = game.board[r][c] === BLACK ? "rgba(255,255,255,0.1)" : "rgba(26,18,7,0.1)";
                ctx.stroke();
            }
        }
    }

    if (game.currentTurn === humanColor) {
        // お茶の緑の上で視認性の高い黄色ガイド
        ctx.fillStyle = "rgba(241, 196, 15, 0.85)"; 
        for (let [r, c] of game.getLegalMoves(humanColor)) {
            ctx.beginPath(); ctx.arc(c * 50 + 25, r * 50 + 25, 7, 0, Math.PI * 2); ctx.fill();
        }
    }

    const [b, w] = game.countDiscs();
    const turnText = game.currentTurn === humanColor ? "あなたの手番です" : "AIが思考中...";
    if (infoEl) infoEl.innerText = `黒: ${b}  白: ${w} | ${turnText}`;
}

function checkTurn() {
    const legalMoves = game.getLegalMoves(game.currentTurn);
    const opponentMoves = game.getLegalMoves(game.getOpponent(game.currentTurn));

    if (legalMoves.length === 0 && opponentMoves.length === 0) {
        const [b, w] = game.countDiscs();
        let msg = `終局！ 黒: ${b} 対 白: ${w}\n`;
        msg += b > w ? "あなたの勝ちです！" : w > b ? "AIの勝ちです！" : "引き分け！";
        setTimeout(() => alert(msg), 100);
        
        if (btnBlack && btnWhite) {
            btnBlack.style.display = 'inline-block';
            btnWhite.style.display = 'inline-block';
        }
        return;
    }

    if (legalMoves.length === 0) {
        game.applyMove(-1, -1, game.currentTurn);
        updateGUI();
        checkTurn();
        return;
    }

    if (game.currentTurn === aiColor) {
        appendLog(`\n[AIのターン開始]\n`);
        
        let boardStr = "";
        for(let r=0; r<8; r++) {
            for(let c=0; c<8; c++) {
                boardStr += game.board[r][c] === BLACK ? "0" : game.board[r][c] === WHITE ? "1" : ".";
            }
        }
        
        aiWorker.postMessage({
            type: 'compute',
            myId: aiColor === BLACK ? 0 : 1,
            boardStr: boardStr,
            turn: Math.floor(currentTurnCount / 2)
        });
    }
}

function handleAiMove(moveIndex) {
    let r = -1, c = -1;
    if (moveIndex !== -1) {
        r = Math.floor(moveIndex / 8);
        c = moveIndex % 8;
    }
    
    if (game.applyMove(r, c, aiColor)) {
        currentTurnCount++;
        updateGUI();
        checkTurn();
    }
}

if (canvas) {
    canvas.addEventListener('click', (e) => {
        if (!game || game.currentTurn !== humanColor) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const c = Math.floor(((e.clientX - rect.left) * scaleX) / 50);
        const r = Math.floor(((e.clientY - rect.top) * scaleY) / 50);

        if (game.applyMove(r, c, humanColor)) {
            currentTurnCount++;
            updateGUI();
            checkTurn();
        }
    });
}

if (btnBlack) btnBlack.addEventListener('click', () => startGame(BLACK));
if (btnWhite) btnWhite.addEventListener('click', () => startGame(WHITE));

initSystem();
