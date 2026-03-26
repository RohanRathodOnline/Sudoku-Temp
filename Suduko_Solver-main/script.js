const grid = document.getElementById("grid");
const msg = document.getElementById("message");
const movesEl = document.getElementById("moves");
const hintsEl = document.getElementById("hints");
const timerEl = document.getElementById("timer");

function createBgNumbers() {
  const layer = document.getElementById('bgNumbers');
  const total = 28;
  const digits = ['1','2','3','4','5','6','7','8','9'];

  for (let i = 0; i < total; i++) {
    const span = document.createElement('span');
    span.className = 'bg-num';
    span.textContent = digits[Math.floor(Math.random() * digits.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (14 + Math.random() * 34) + 'px';
    span.style.animationDuration = (8 + Math.random() * 12) + 's';
    span.style.animationDelay = (-Math.random() * 20) + 's';
    span.style.setProperty('--drift', ((Math.random() * 2 - 1) * 120) + 'px');
    layer.appendChild(span);
  }
}

createBgNumbers();

let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let solution = Array.from({ length: 9 }, () => Array(9).fill(0));
let moves = 0;
let hints = 3;
let seconds = 0;
let timer;

function isValid(b, r, c, n) {
  for (let i = 0; i < 9; i++) {
    if (b[r][i] === n || b[i][c] === n) return false;
  }
  let sr = Math.floor(r / 3) * 3;
  let sc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (b[sr + i][sc + j] === n) return false;
  return true;
}

function solve(b) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (b[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(b, r, c, n)) {
            b[r][c] = n;
            if (solve(b)) return true;
            b[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateBoard() {
  board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);
  solution = board.map(r => r.slice());

  // remove numbers
  for (let i = 0; i < 40; i++) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    board[r][c] = 0;
  }
}

function render() {
  grid.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((val, c) => {
      let cell = document.createElement("input");
      cell.className = "cell";
      cell.value = val || "";

      if (val !== 0) {
        cell.disabled = true;
        cell.classList.add("fixed");
      }

      cell.addEventListener("input", e => {
        let v = e.target.value.replace(/[^1-9]/g, "");
        e.target.value = v;
        board[r][c] = v ? +v : 0;
        moves++;
        movesEl.textContent = moves;
      });

      grid.appendChild(cell);
    });
  });
}

function newGame() {
  generateBoard();
  render();
  moves = 0;
  hints = 3;
  movesEl.textContent = 0;
  hintsEl.textContent = 3;
  msg.textContent = "New Game Started";

  clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    let m = String(Math.floor(seconds / 60)).padStart(2, "0");
    let s = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
  }, 1000);
}

function hint() {
  if (hints <= 0) {
    msg.textContent = "No hints left!";
    return;
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        board[r][c] = solution[r][c];
        hints--;
        hintsEl.textContent = hints;
        render();
        return;
      }
    }
  }
}

function checkBoard() {
  let correct = true;
  document.querySelectorAll(".cell").forEach((cell, i) => {
    let r = Math.floor(i / 9);
    let c = i % 9;
    if (board[r][c] !== solution[r][c]) {
      cell.classList.add("error");
      correct = false;
    }
  });
  msg.textContent = correct ? "Correct!" : "Wrong values";
}

function solveBoard() {
  board = solution.map(r => r.slice());
  render();
  msg.textContent = "Solved";
}

newGame();