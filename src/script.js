const boardElement = document.querySelector('.board');
const difficultySelector = document.querySelector('.diffSelector');
const restartButton = document.querySelector('.restartButton');
const root = document.documentElement;
const textElement = document.querySelector('.textEl');

var size = 9;
var board = [];
var mineCount = 10;

restartButton.addEventListener('click', () => {
	switch (difficultySelector.value) {
		case '0':
			size = 9;
			mineCount = 10;
			break;
		case '1':
			size = 19;
			mineCount = 50;
			break;
	}

	startGame();
});

function startGame() {
	var clickCounter = 0;
	board = createBoard(size, mineCount);
	boardElement.addEventListener('contextmenu', e => e.preventDefault());
	boardElement.classList.remove('noHover');
	boardElement.innerHTML = '';
	root.style.setProperty('--gridSize', size);
	textElement.style.setProperty('color', '#eb2b2b')
	textElement.textContent = mineCount;

	board.forEach(row => {
		row.forEach(tile => {
			boardElement.append(tile.element);
			tile.element.addEventListener('click', () => {
				if (tile.status !== 'hidden') return;
				if (tile.isMine && clickCounter === 0) {
					spawnMine(board, size);
					tile.isMine = false;
				}

				revealTile(board, tile);
				textElement.textContent = mineLeftCount(board, mineCount);
				checkEnd(board);
				clickCounter++;
			})
			tile.element.addEventListener('contextmenu', e => {
				if (tile.status === 'hidden') tile.status = 'flag';
				else if (tile.status === 'flag') tile.status = 'hidden';

				textElement.textContent = mineLeftCount(board, mineCount);
				e.preventDefault();
				checkEnd(board);
			})
		})
	})
}

function checkEnd(board) {
	const win = checkWin(board);
	const lose = checkLose(board);

	if (win || lose) boardElement.classList.add('noHover');

	if (win) {
		textElement.style.setProperty('color', '#3ea0f7');
		textElement.textContent = 'You won!';

		board.forEach(row => {
			row.forEach(tile => {
				if (tile.isMine) tile.status = 'flag';
			})
		})
	}

	if (lose) {
		textElement.style.setProperty('color', '#eb2b2b');
		textElement.textContent = 'You lose!';

		board.forEach(row => {
			row.forEach(tile => {
				if (tile.isMine && tile.status !== 'flag') revealTile(null, tile);
				if (!tile.isMine && tile.status === 'flag') tile.element.classList.add('incorrect');
			})
		})
	}
}

startGame();
