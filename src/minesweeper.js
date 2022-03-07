function createBoard(size, mineCount) {
	var board = [];

	for (let x = 0; x < size; x++) {
		board.push([]);

		for (let y = 0; y < size; y++) {
			const element = document.createElement('div');
			element.dataset.status = 'hidden';

			const tile = {
				isMine: false,
				element,
				x,
				y,
				get status() {
					return this.element.dataset.status;
				},
				set status(value) {
					this.element.dataset.status = value;
				}
			}

			board[x].push(tile);
		}
	}

	for (let i = 0; i < mineCount; i++) spawnMine(board, size);

	return board;
}

function spawnMine(board, size) {
	const x = randomNumber(size);
	const y = randomNumber(size);
	const tile = board[x][y];

	if (!tile.isMine) tile.isMine = true;
	else spawnMine(board, size);
}

function revealTile(board, tile) {
	if (tile.isMine) tile.status = 'mine';
	if (tile.status === 'hidden') {
		const adjacentTiles = nearbyTiles(board, tile);
		const mineCount = adjacentTiles.filter(tile => tile.isMine).length;
		const classList = tile.element.classList;
		tile.element.textContent = mineCount;
		tile.status = 'number';

		switch (mineCount) {
			case 0:
				tile.element.textContent = '';
				adjacentTiles.forEach(t => revealTile(board, t));
				break;
			case 1: classList.add('num1'); break;
			case 2: classList.add('num2'); break;
			case 3: classList.add('num3'); break;
			case 4: classList.add('num4'); break;
			case 5: classList.add('num5'); break;
			case 6: classList.add('num6'); break;
			case 7: classList.add('num7'); break;
			case 8: classList.add('num8'); break;
		}
	}
}

function nearbyTiles(board, { x, y }) {
	const tiles = [];

	for (let xOffset = -1; xOffset <= 1; xOffset++) {
		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			const tile = board[x + xOffset]?.[y + yOffset];

			if (tile) tiles.push(tile);
		}
	}

	return tiles;
}

function randomNumber(max) {
	return Math.floor(Math.random() * max);
}

function checkWin(board) {
	return board.every(row => {
		return row.every(tile => {
			return (tile.status === 'number'
				 || tile.isMine && (tile.status === 'hidden' || tile.status === 'flag'));
		})
	})
}

function checkLose(board) {
	return board.some(row => {
		return row.some(tile => {
			return tile.status === 'mine';
		})
	})
}

function mineLeftCount(board, maxMines) {
	var count = maxMines;

	board.forEach(row => {
		row.forEach(tile => {
			if (tile.status === 'flag') count--;
		})
	})

	return count;
}
