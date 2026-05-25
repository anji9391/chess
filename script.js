/* =====================
   MULTIPLAYER
===================== */

/* =====================
   MULTIPLAYER
===================== */

const socket =
io();

let roomCode =
null;

let playerColor =
null;

let onlineGame =
false;

let gameStarted =
false;
/* ROOM UI */

const roomInput =
document.querySelector(
'.room-box input'
);

const joinBtn =
document.querySelector(
'.join-btn'
);

/* EXIT BUTTON */

const exitBtn =
document.getElementById(
"exitRoom"
);

exitBtn.addEventListener(
"click",
()=>{

/* INFORM OTHER PLAYER */

socket.emit(
"leaveRoom",
roomCode
);

/* RESET GAME */

pieces =
JSON.parse(
JSON.stringify(
startBoard
)
);

currentTurn =
"white";

selectedPiece =
null;

legalMoves =
[];

moveHistory =
[];

/* RESET ROOM */

roomCode =
null;

playerColor =
null;

onlineGame =
false;

gameStarted =
false;

/* RESET UI */

roomInput.value =
"";

roomInput.disabled =
false;

joinBtn.disabled =
false;

joinBtn.innerText =
"Join";

/* STATUS */

document.getElementById(
"networkStatus"
).innerText =
"🔴 Offline";

/* MESSAGE */

showMessage(
"PLAYER LEFT"
);

/* REDRAW */

drawBoard();

hideCheckmate();

});
/* CREATE ROOM */

const roomTitle =
document.querySelector(
".room-box h3"
);

roomTitle.innerHTML =
"🎮 Create Room";

/* CLICK CREATE ROOM */

roomTitle.addEventListener(
"click",
()=>{

if(
!socket
)
return;

/* PREVENT DOUBLE ROOM */

if(
onlineGame
)
return;

socket.emit(
"createRoom"
);

}
);
/* ROOM CREATED */

socket.on(
'roomCreated',
(data)=>{

roomCode =
data.roomCode;

playerColor =
data.color;

onlineGame =
true;

roomInput.value =
roomCode;

/* BUTTON UI */

joinBtn.innerText =
"Waiting...";

joinBtn.disabled =
true;

roomInput.disabled =
true;

showMessage(
`ROOM:
${roomCode}`
);

});

/* JOIN */

joinBtn.addEventListener(
"click",
()=>{

if(
!socket
)
return;

const code =
roomInput.value
.trim()
.toUpperCase();

/* CREATE ROOM */

if(
code === ""
){

socket.emit(
"createRoom"
);

return;
}

/* JOIN ROOM */

socket.emit(
"joinRoom",
code

);

}
);
/* JOINED */
socket.on(
"roomJoined",
(data)=>{
onlineGame =
true;
document.getElementById(
"networkStatus"
).innerText =
"🟢 Online";

roomCode =
data.roomCode;

playerColor =
data.color;

/* BUTTON UI */

joinBtn.innerText =
"Joined";

joinBtn.disabled =
true;

joinBtn.style.opacity =
"0.7";

roomInput.disabled =
true;

showMessage(

`CONNECTED
${playerColor}`

);

console.log(
"Joined Room:",
roomCode
);

}
);
/* START */

socket.on(
"startGame",
()=>{

gameStarted =
true;

onlineGame =
true;

/* ONLINE LABEL */

document.getElementById(
"networkStatus"
).innerText =
"🟢 Online";

/* BUTTON */

joinBtn.innerText =
"Joined";

showMessage(
"GAME STARTED"
);

});

/* ROOM ERROR */

socket.on(
'roomError',
(msg)=>{

showMessage(
msg
);

});
const board =
document.getElementById(
"board"
);
const gameMessage =
document.getElementById(
"gameMessage"
);
const checkmateOverlay =
document.getElementById(
"checkmateOverlay"
);

const winnerMessage =
document.getElementById(
"winnerMessage"
);

function showCheckmate(
text
){

winnerMessage.innerHTML =
text;

checkmateOverlay
.classList.add(
"show"
);

}

function hideCheckmate(){

checkmateOverlay
.classList.remove(
"show"
);

}
function showMessage(
text
){

gameMessage.innerText =
text;

gameMessage.classList.add(
"show"
);

}

/* HIDE MESSAGE */

function hideMessage(){

gameMessage.classList.remove(
"show"
);

gameMessage.innerText =
"";

}
const turnText =
document.getElementById(
"turnText"
);

const undoBtn =
document.getElementById(
"undoBtn"
);

const resetBtn =
document.getElementById(
"resetBtn"
);

const gameMode =
document.getElementById(
"gameMode"
);

const difficulty =
document.getElementById(
"difficulty"
);
/* =====================
   RESET GAME
===================== */

function restartGame(){

pieces =
JSON.parse(
JSON.stringify(
startBoard
)
);

currentTurn =
"white";

selectedPiece =
null;

legalMoves =
[];

moveHistory =
[];

botThinking =
false;

/* RESET ONLINE */

hideMessage();

hideCheckmate();

drawBoard();

}

/* =====================
   MODE CHANGE
===================== */

gameMode.addEventListener(
"change",
()=>{

restartGame();

showMessage(
"GAME RESET"
);

}
);

/* =====================
   DIFFICULTY CHANGE
===================== */

difficulty.addEventListener(
"change",
()=>{

if(
gameMode.value ===
"bot"
){

restartGame();

showMessage(

`LEVEL:
${
difficulty.options[
difficulty.selectedIndex
].text
}`

);

}

}
);
/* =====================
   GAME STATE
===================== */

let currentTurn =
"white";
let botThinking =
false;
let selectedPiece =
null;

let legalMoves =
[];

let moveHistory =
[];

let enPassantTarget =
null;
const pieceValues = {

p:100,
n:320,
b:330,
r:500,
q:900,
k:20000

};
const castlingRights = {

white:{
king:true,
queen:true
},

black:{
king:true,
queen:true
}

};

/* =====================
   PIECE IMAGES
===================== */

const pieceMap = {

wp:
"assets/pieces/white-pawn.png",

wr:
"assets/pieces/white-rook.png",

wn:
"assets/pieces/white-knight.png",

wb:
"assets/pieces/white-bishop.png",

wq:
"assets/pieces/white-queen.png",

wk:
"assets/pieces/white-king.png",

bp:
"assets/pieces/black-pawn.png",

br:
"assets/pieces/black-rook.png",

bn:
"assets/pieces/black-knight.png",

bb:
"assets/pieces/black-bishop.png",

bq:
"assets/pieces/black-queen.png",

bk:
"assets/pieces/black-king.png"

};

/* =====================
   START POSITION
===================== */

let pieces = [

["br","bn","bb","bq","bk","bb","bn","br"],

["bp","bp","bp","bp","bp","bp","bp","bp"],

["","","","","","","",""],

["","","","","","","",""],

["","","","","","","",""],

["","","","","","","",""],

["wp","wp","wp","wp","wp","wp","wp","wp"],

["wr","wn","wb","wq","wk","wb","wn","wr"]

];

const startBoard =
JSON.parse(
JSON.stringify(
pieces
)
);

/* =====================
   DRAW BOARD
===================== */

function drawBoard(){

board.innerHTML =
"";

for(
let row = 0;
row < 8;
row++
){

for(
let col = 0;
col < 8;
col++
){

const square =
document.createElement(
"div"
);

square.className =
`square ${
(row + col) % 2 === 0
?
"light"
:
"dark"
}`;

square.dataset.row =
row;

square.dataset.col =
col;

/* PIECE */

const piece =
pieces[row][col];

if(piece){

const img =
document.createElement(
"img"
);

img.src =
pieceMap[piece];

img.className =
"piece";

square.appendChild(
img
);

}

/* MOVE DOT */

if(
legalMoves.some(
move =>
move.row === row &&
move.col === col
)
){

const dot =
document.createElement(
"div"
);

dot.className =
"move-dot";

square.appendChild(
dot
);

}

/* CLICK */

square.addEventListener(
"click",
() =>
handleSquareClick(
row,
col
)
);

board.appendChild(
square
);

}
}

updateTurn();
}

/* =====================
   TURN TEXT
===================== */

function updateTurn(){

turnText.innerText =

currentTurn ===
"white"

?

"White's Turn"

:

"Black's Turn";

}

/* =====================
   HELPERS
===================== */

function isInside(
row,
col
){

return (
row >= 0 &&
row < 8 &&
col >= 0 &&
col < 8
);

}

function isEmpty(
row,
col
){

return (
pieces[row][col]
=== ""
);

}

function isEnemy(
target,
piece
){

return (
target &&
target[0] !==
piece[0]
);

}

function getPieceColor(
piece
){

return (
piece[0] ===
"w"
?
"white"
:
"black"
);

}
function evaluateBoard(){

let score = 0;

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(!piece)
continue;

const value =
pieceValues[
piece[1]
];

if(
piece[0] ===
"b"
){

score += value;

}else{

score -= value;
}
}
}

return score;
}
function minimax(
depth,
isMaximizing
){

if(
depth === 0
){

return evaluateBoard();
}

if(
isMaximizing
){

let best =
-999999;

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(
piece &&
piece[0] ===
"b"
){

const moves =
getLegalMoves(
row,
col
);

for(
let move
of moves
){

const backup =
JSON.parse(
JSON.stringify(
pieces
)
);

movePiece(
row,
col,
move.row,
move.col
);

const score =
minimax(
depth - 1,
false
);

pieces =
backup;

best =
Math.max(
best,
score
);
}
}
}
}

return best;

}else{

let best =
999999;

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(
piece &&
piece[0] ===
"w"
){

const moves =
getLegalMoves(
row,
col
);

for(
let move
of moves
){

const backup =
JSON.parse(
JSON.stringify(
pieces
)
);

movePiece(
row,
col,
move.row,
move.col
);

const score =
minimax(
depth - 1,
true
);

pieces =
backup;

best =
Math.min(
best,
score
);
}
}
}
}

return best;
}
}
/* =====================
   MOVE GENERATOR
===================== */

function getPseudoLegalMoves(
row,
col
){

const piece =
pieces[row][col];

if(!piece)
return [];

const type =
piece[1];

switch(type){

case "p":
return getPawnMoves(
row,
col,
piece
);

case "r":
return getRookMoves(
row,
col,
piece
);

case "n":
return getKnightMoves(
row,
col,
piece
);

case "b":
return getBishopMoves(
row,
col,
piece
);

case "q":
return getQueenMoves(
row,
col,
piece
);

case "k":
return getKingMoves(
row,
col,
piece
);

default:
return [];
}
}

/* =====================
   PAWN
===================== */

function getPawnMoves(
row,
col,
piece
){

const moves =
[];

const isWhite =
piece[0] ===
"w";

const direction =
isWhite
? -1
: 1;

const startRow =
isWhite
? 6
: 1;

/* FORWARD */

if(
isInside(
row + direction,
col
)
&&
isEmpty(
row + direction,
col
)
){

moves.push({

row:
row + direction,

col

});
}

/* DOUBLE */

if(
row === startRow
&&
isEmpty(
row + direction,
col
)
&&
isEmpty(
row +
(direction * 2),
col
)
){

moves.push({

row:
row +
(direction * 2),

col

});
}

/* CAPTURE */

for(
let offset
of [-1,1]
){

const newCol =
col + offset;

const newRow =
row + direction;

if(
isInside(
newRow,
newCol
)
){

const target =
pieces[
newRow
][
newCol
];

if(
isEnemy(
target,
piece
)
){

moves.push({

row:newRow,
col:newCol

});
}
}
}

return moves;
}

/* =====================
   SLIDING PIECES
===================== */

function getSlidingMoves(
row,
col,
piece,
directions
){

const moves =
[];

for(
let dir
of directions
){

let r =
row +
dir[0];

let c =
col +
dir[1];

while(
isInside(r,c)
){

const target =
pieces[r][c];

if(
target === ""
){

moves.push({
row:r,
col:c
});

}else{

if(
isEnemy(
target,
piece
)
){

moves.push({
row:r,
col:c
});
}

break;
}

r += dir[0];
c += dir[1];
}
}

return moves;
}

/* =====================
   ROOK
===================== */

function getRookMoves(
row,
col,
piece
){

return getSlidingMoves(
row,
col,
piece,
[
[-1,0],
[1,0],
[0,-1],
[0,1]
]
);

}

/* =====================
   BISHOP
===================== */

function getBishopMoves(
row,
col,
piece
){

return getSlidingMoves(
row,
col,
piece,
[
[-1,-1],
[-1,1],
[1,-1],
[1,1]
]
);

}

/* =====================
   QUEEN
===================== */
function getQueenMoves(
row,
col,
piece
){

return [

...getRookMoves(
row,
col,
piece
),

...getBishopMoves(
row,
col,
piece
)

];

}

/* =====================
   KNIGHT
===================== */

function getKnightMoves(
row,
col,
piece
){

const moves =
[];

const jumps = [

[-2,-1],
[-2,1],
[-1,-2],
[-1,2],

[1,-2],
[1,2],

[2,-1],
[2,1]

];

for(
let jump
of jumps
){

const r =
row +
jump[0];

const c =
col +
jump[1];

if(
!isInside(r,c)
)
continue;

const target =
pieces[r][c];

if(
target === ""
||
isEnemy(
target,
piece
)
){

moves.push({
row:r,
col:c
});
}
}

return moves;
}

/* =====================
   KING
===================== */

function getKingMoves(
row,
col,
piece
){

const moves =
[];

for(
let r=-1;
r<=1;
r++
){

for(
let c=-1;
c<=1;
c++
){

if(
r===0
&&
c===0
)
continue;

const nr =
row+r;

const nc =
col+c;

if(
!isInside(
nr,nc
)
)
continue;

const target =
pieces[nr][nc];

if(
target === ""
||
isEnemy(
target,
piece
)
){

moves.push({
row:nr,
col:nc
});
}
}
}

return moves;
}
/* =====================
   FIND KING
===================== */

function findKing(
color
){

const king =
color ===
"white"
?
"wk"
:
"bk";

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

if(
pieces[row][col]
=== king
){

return {
row,
col
};

}
}
}

return null;
}

/* =====================
   CHECK DETECTION
===================== */

function isKingInCheck(
color
){

const king =
findKing(
color
);

if(!king)
return false;

const enemyColor =
color ===
"white"
?
"b"
:
"w";

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(
piece &&
piece.startsWith(
enemyColor
)
){

const enemyMoves =
getPseudoLegalMoves(
row,
col
);

const canAttack =
enemyMoves.some(
move =>

move.row ===
king.row
&&

move.col ===
king.col
);

if(
canAttack
){

return true;
}
}
}
}

return false;
}

/* =====================
   SAFE MOVE
===================== */

function wouldLeaveKingInCheck(
fromRow,
fromCol,
toRow,
toCol,
color
){

const backup =
JSON.parse(
JSON.stringify(
pieces
)
);

/* TEMP MOVE */

pieces[toRow][toCol] =
pieces[fromRow][fromCol];

pieces[fromRow][fromCol] =
"";

/* CHECK */

const inCheck =
isKingInCheck(
color
);

/* RESTORE */

for(
let r=0;
r<8;
r++
){

for(
let c=0;
c<8;
c++
){

pieces[r][c] =
backup[r][c];

}
}

return inCheck;
}
/* =====================
   LEGAL FILTER
===================== */

function getLegalMoves(
row,
col
){

const piece =
pieces[row][col];

if(!piece)
return [];

const color =
getPieceColor(
piece
);

const pseudo =
getPseudoLegalMoves(
row,
col
);

return pseudo.filter(
move =>

!wouldLeaveKingInCheck(

row,
col,

move.row,
move.col,

color

)
);
}

/* =====================
   MOVE PIECE
===================== */

function movePiece(
fromRow,
fromCol,
toRow,
toCol
){

const piece =
pieces[fromRow][fromCol];

/* SAVE */

moveHistory.push({

board:
JSON.parse(
JSON.stringify(
pieces
)),

turn:
currentTurn,

botThinking:
botThinking

});

/* MOVE */

pieces[toRow][toCol] =
piece;

pieces[fromRow][fromCol] =
"";

/* PROMOTION */

if(
piece === "wp"
&&
toRow === 0
){

pieces[toRow][toCol] =
"wq";
}

if(
piece === "bp"
&&
toRow === 7
){

pieces[toRow][toCol] =
"bq";
}

/* TURN */

currentTurn =

currentTurn ===
"white"

?

"black"

:

"white";
}

/* =====================
   CLICK
===================== */

function handleSquareClick(
row,
col
) {
/* LOCK BOARD */
/* ONLINE TURN LOCK */

if(
onlineGame
){
   if(
!gameStarted
)
return;

if(
playerColor !==
currentTurn
)
return;

}
if(
botThinking
)
return;
const clicked =
pieces[row][col];

/* SELECT */

if(
selectedPiece ===
null
){

if(
clicked &&
getPieceColor(
clicked
)
===
currentTurn
){

selectedPiece = {
row,
col
};

legalMoves =
getLegalMoves(
row,
col
);

drawBoard();
}

return;
}

/* CHANGE */

if(
clicked &&
getPieceColor(
clicked
)
===
currentTurn
){

selectedPiece = {
row,
col
};

legalMoves =
getLegalMoves(
row,
col
);

drawBoard();

return;
}

/* VALID MOVE */

const valid =
legalMoves.some(
move =>

move.row ===
row
&&

move.col ===
col
);

if(!valid){

selectedPiece =
null;

legalMoves =
[];

drawBoard();

return;
}

/* MOVE */

movePiece(

selectedPiece.row,
selectedPiece.col,

row,
col

);
/* ONLINE MOVE */

if(
onlineGame
){

socket.emit(
'move',
{

roomCode,

fromRow:
selectedPiece.row,

fromCol:
selectedPiece.col,

toRow:row,
toCol:col

}
);

}
/* REMOVE OLD MESSAGE */

hideMessage();
selectedPiece =
null;

legalMoves =
[];

drawBoard();

checkGameState();

/* BOT TURN */

if(
gameMode.value ===
"bot"
&&
currentTurn ===
"black"
){

botMove();

   }
}
/* =====================
   CASTLING
===================== */

function addCastlingMoves(
row,
col,
piece,
moves
){

const color =
getPieceColor(
piece
);

if(
piece[1] !== "k"
)
return;

/* WHITE */

if(
color === "white"
&&
row === 7
&&
col === 4
){

/* KING SIDE */

if(
pieces[7][5] === ""
&&
pieces[7][6] === ""
&&
pieces[7][7] === "wr"
){

moves.push({
row:7,
col:6
});
}

/* QUEEN SIDE */

if(
pieces[7][1] === ""
&&
pieces[7][2] === ""
&&
pieces[7][3] === ""
&&
pieces[7][0] === "wr"
){

moves.push({
row:7,
col:2
});
}
}

/* BLACK */

if(
color === "black"
&&
row === 0
&&
col === 4
){

if(
pieces[0][5] === ""
&&
pieces[0][6] === ""
&&
pieces[0][7] === "br"
){

moves.push({
row:0,
col:6
});
}

if(
pieces[0][1] === ""
&&
pieces[0][2] === ""
&&
pieces[0][3] === ""
&&
pieces[0][0] === "br"
){

moves.push({
row:0,
col:2
});
}
}
}

/* =====================
   CHECKMATE
===================== */

function hasAnyLegalMove(
color
){

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(
piece &&
getPieceColor(
piece
)
===
color
){

const moves =
getLegalMoves(
row,
col
);

if(
moves.length
> 0
){

return true;
}
}
}
}

return false;
}

function checkGameState(){

/* CHECK */

if(
isKingInCheck(
currentTurn
)
){

/* CHECKMATE */

if(
!hasAnyLegalMove(
currentTurn
)
){

showCheckmate(

`CHECKMATE<br>
${
currentTurn ===
"white"
?
"BLACK"
:
"WHITE"
}
 WINS`

);

return;
}

/* CHECK */

showMessage(
"CHECK!"
);

return;
}

/* STALEMATE */

if(
!hasAnyLegalMove(
currentTurn
)
){

showMessage(
"STALEMATE!"
);

}
}
/* =====================
   BOT
===================== */

function botMove(){

if(
currentTurn !==
"black"
||
botThinking
)
return;

botThinking =
true;

/* SMALL DELAY */

setTimeout(
() => {

let allMoves =
[];

for(
let row=0;
row<8;
row++
){

for(
let col=0;
col<8;
col++
){

const piece =
pieces[row][col];

if(
piece &&
piece[0] ===
"b"
){

if(
getPieceColor(
piece
)
!==
"black"
)
continue;

const legal =
getLegalMoves(
row,
col
);

for(
let move
of legal
){

const target =
pieces[
move.row
][
move.col
];

let score = 0;

/* PRIORITY */

if(target){

const values = {

p:10,
n:30,
b:30,
r:50,
q:90,
k:999

};

score +=
values[
target[1]
] || 0;
}

/* CENTER */

if(
move.row >=2 &&
move.row <=5 &&
move.col >=2 &&
move.col <=5
){

score += 5;
}

/* SAVE */

allMoves.push({

fromRow:
row,

fromCol:
col,

toRow:
move.row,

toCol:
move.col,

score

});
}
}
}
}

/* SORT */

allMoves.sort(
(a,b)=>
b.score -
a.score
);

/* RANDOM TOP 3 */

const topMoves =
allMoves.slice(
0,
3
);

const bestMove =

topMoves[
Math.floor(
Math.random()
*
topMoves.length
)
];

if(
bestMove
){


movePiece(

bestMove.fromRow,
bestMove.fromCol,

bestMove.toRow,
bestMove.toCol

);

drawBoard();

checkGameState();
}

botThinking =
false;

},
300
);
}
/* =====================
   UNDO
===================== */

undoBtn.addEventListener(

"click",

() => {

if(
moveHistory.length
=== 0
)
return;

/* REMOVE BOT MOVE TOO */

if(
gameMode.value ===
"bot"
&&
moveHistory.length > 1
){

moveHistory.pop();

}

const lastState =
moveHistory.pop();

pieces =
JSON.parse(
JSON.stringify(
lastState.board
));

currentTurn =
lastState.turn;

botThinking =
false;

selectedPiece =
null;

legalMoves =
[];

hideMessage();

drawBoard();

}
);

/* =====================
   RESET
===================== */

resetBtn.addEventListener(
"click",
() => {

pieces =
JSON.parse(
JSON.stringify(
startBoard
)
);

currentTurn =
"white";

selectedPiece =
null;

legalMoves =
[];

moveHistory =
[];

drawBoard();
hideCheckmate();
}
);

/* =====================
   START
===================== */

/* START */

drawBoard();

/* OPPONENT MOVE */

socket.on(
'opponentMove',
(data)=>{

pieces[
data.toRow
][
data.toCol
] =

pieces[
data.fromRow
][
data.fromCol
];

pieces[
data.fromRow
][
data.fromCol
] = "";

currentTurn =

currentTurn ===
"white"
?
"black"
:
"white";

drawBoard();

checkGameState();

});

/* PLAYER LEFT */

socket.on(
"playerLeft",
()=>{

/* MESSAGE */

showMessage(
"PLAYER LEFT"
);

/* RESET GAME */

pieces =
JSON.parse(
JSON.stringify(
startBoard
)
);

currentTurn =
"white";

selectedPiece =
null;

legalMoves =
[];

moveHistory =
[];

/* RESET ROOM */

roomCode =
null;

playerColor =
null;

onlineGame =
false;

gameStarted =
false;

/* RESET UI */

roomInput.value =
"";

roomInput.disabled =
false;

joinBtn.disabled =
false;

joinBtn.innerText =
"Join";

/* OFFLINE */

document.getElementById(
"networkStatus"
).innerText =
"🔴 Offline";

/* REDRAW */

drawBoard();

hideCheckmate();

});
checkGameState();