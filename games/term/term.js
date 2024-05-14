// window.addEventListener("load", function() {
//     loadGameState();
// });

var apiKey = 'be7cbf41-2b93-472c-a42b-675042ae3bd1';

async function checkWordExists(word) {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 1) {
      return false;
    }
    const firstResult = data[0];
    if (!firstResult || !firstResult.meta) {
      return false;
    }
    return true;
}

const extraWords = ['JSON', 'ASYNC', 'KERMIT', 'GITHUB', 'DJANGO', 'DEVOPS', 'LARAVEL', 'FAVICON', 'GYGABITE', 'COROUTINE', 'UNDERFLOW', 'WIREFRAME']

// CONTAINERS
const boardDisplay = document.querySelector('.board-container');
const keyboard = document.querySelector('.keyboard-container');
const scoreDisplay = document.querySelector('.score-container-message');
const resultStatus = document.querySelector('.resultStatus');
const wordTitle = document.querySelector('.wordTitle');
const wordDescription = document.querySelector('.wordDescription');
const nextGameButton = document.querySelector('#nextGame');
const scoreView = document.querySelector('#running-score');
const recordView = document.querySelector('#running-record');
const resultModal = document.querySelector('#modal-resultado');
nextGameButton.addEventListener('click', startNewGame);

// SCORE
let score = localStorage.getItem('score') ?? 0;
let record = localStorage.getItem('record') ?? 0;
scoreView.textContent = score;
recordView.textContent = record;
function checkRecord(score) {
    if (score >= record){
        record = score;
        recordView.textContent = record;
    }
}

// OPTIONS
let checkedLengths = JSON.parse(localStorage.getItem('checkedLengths')) || ['4', '5', '6', '7', '8', '9'];
const lengthChecks = document.querySelectorAll('input[name="letters"]');
lengthChecks.forEach(function(lengthCheck) {
  if (checkedLengths.includes(lengthCheck.value)) {
    lengthCheck.checked = true;
  } else {
    lengthCheck.checked = false;
  }
});
lengthChecks.forEach(function(lengthCheck) {
  lengthCheck.addEventListener('change', function() {
    if (this.checked) {
      if (!checkedLengths.includes(this.value)) {
        checkedLengths.push(this.value);
      }
    } else {
      const index = checkedLengths.indexOf(this.value);
      if (index != -1) {
        checkedLengths.splice(index, 1);
      }
    }
    if (checkedLengths.length === 0) {
      checkedLengths = ['4', '5', '6', '7', '8', '9'];
      lengthChecks.forEach(function(lengthCheck) {
          lengthCheck.checked = true;
        });
    }
    localStorage.setItem('checkedLengths', JSON.stringify(checkedLengths));
});
});

// WORD
import words from './words-by-length.json' assert { type: 'json'};

const wordsByLength = {
  4: words['4'],
  5: words['5'],
  6: words['6'],
  7: words['7'],
  8: words['8'],
  9: words['9'],
};

const maxLength = 9;
const minLength = 4;

function getRandomWord(checkedLengths = ['4', '5', '6', '7', '8', '9'], wordsByLength) {
    let word = '';
    let definition = '';
  
    while (!checkedLengths.includes(word.length.toString())) {
      const wordsByLengthCopy = JSON.parse(JSON.stringify(wordsByLength));
      
      const lengthKeys = Object.keys(wordsByLengthCopy).filter(key => wordsByLengthCopy[key].length > 0);
      const lengthKey = lengthKeys[Math.floor(Math.random() * lengthKeys.length)];
      const randomWords = wordsByLengthCopy[lengthKey];
      const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
      word = randomWord.name;
      definition = randomWord.definition;
    }
    localStorage.setItem('word', word);
    localStorage.setItem('definition', definition);
    localStorage.setItem('size', word.length);

    return { word, definition };
}

let gameWord = getRandomWord(checkedLengths, wordsByLength);
let word = gameWord.word;
let definition = gameWord.definition;
let size = word.length;

// TILEBOARD
let guessRows;

function createTileBoard(size) {
  if (size < minLength || size > maxLength) {
    console.error("Word length must be between " + maxLength + " and " + "characters");
  } else {
    guessRows = new Array(6);
    for (let i = 0; i < guessRows.length; i++) {
      guessRows[i] = new Array(size).fill('');
    }
  }

  boardDisplay.innerHTML = "";

  guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.classList.add('guess-row')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
      const tileElement = document.createElement('div')
      tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
      tileElement.classList.add('tile')
      rowElement.append(tileElement)
      
      // Add a click event listener to each tile in the row
      tileElement.addEventListener('click', () => {
        const clickedRow = parseInt(tileElement.parentNode.getAttribute('id').split('-')[1]);
        if (clickedRow !== currentRow) {
            return;
        }
    
        currentRow = guessRowIndex;
        currentTile = guessIndex;
    
        // Remove the existing hover class from all tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.remove('hover');
        });
    
        // Add the hover class to tiles in the current row
        const currentRowTiles = document.querySelectorAll('.guess-row#guessRow-' + currentRow + ' .tile');
        currentRowTiles.forEach(tile => {
            tile.classList.add('hover');
        });
    });
    
    })
    boardDisplay.append(rowElement)
  })

  var rowContainers = document.querySelectorAll('.guess-row')

  rowContainers.forEach(function(container) {
    container.classList.add('grid-' + size + '-columns');
  });
}

createTileBoard(size);


// KEYBOARD
const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '«',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER',
]



keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.classList.add('letterKey')
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement);
})

// ACTIONS
let currentRow = 0
let currentTile = 0
const allowedKeys = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'X', 'x', 'y', 'Y', 'z', 'Z', 'Enter', 'Backspace'];

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
  let key = event.key;
  if (allowedKeys.includes(key)) {
    if (key == 'Backspace') {
      key = '«';
    }
    const letter = key.toUpperCase();
    handleClick(letter);
  }
}

const handleClick = (letter) => {
    if (letter === '«') {
        removeLetter()
        return
    }
    if (letter === 'ENTER') {
        checkRow();
        return
    }
    addLetter(letter)
    localStorage.setItem('guessRows', JSON.stringify(guessRows));
}

const addLetter = (letter) => {
    if (currentTile < size && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const removeLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = async () => {
  const guess = guessRows[currentRow].join("");

  if (guess.length !== size) {
    showMessage("Insert a word with " + size + " characters", 2000);
    return;
  }

  const wordExists = await checkWordExists(guess);
  if (!wordExists && !(extraWords.includes(guess))) {
    showMessage("Insert a valid word", 2000);
    return;
  }

  flipTile();
  console.log("guess is " + guess, "word is " + word);

  if (guess == word) {

    setTimeout(function() {
      startConfetti();
    }, 1000);

    if (!resultModal.classList.contains('hidemodal')) {
      // Game has already ended, ignore the score increment
      return;
    }

    score++;
    scoreView.textContent = score;
    checkRecord(score);
    localStorage.setItem('score', score);
    localStorage.setItem('record', record);
    resultStatus.style.color = "var(--green)";
    resultStatus.textContent = "Congratulations!!!";
    document.querySelector('.happy-icon').removeAttribute('hidden');
    showDescription(word, definition);
    resultModal.classList.remove('hidemodal');
  } else {
    if (currentRow >= 5) {
      score = 0;
      scoreView.textContent = score;
      localStorage.setItem('score', score);
      checkRecord(score);
      resultStatus.style.color = "var(--red)";
      resultStatus.textContent = "Game over!";
      document.querySelector('.sad-icon').removeAttribute('hidden');
      showDescription(word, definition);
      resultModal.classList.remove('hidemodal');
    }
    if (currentRow < 5) {
      currentRow++;
      currentTile = 0;
    }
  }
};

  let messageTimeout = null;

  const showMessage = (message, duration = 0, callback) => {
    clearTimeout(messageTimeout);
  
    // Remove the previous message element, if it exists
    const previousMessageElement = scoreDisplay.querySelector('p');
    if (previousMessageElement) {
      previousMessageElement.remove();
    }
  
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    scoreDisplay.append(messageElement);
  
    if (duration > 0) {
      messageTimeout = setTimeout(() => {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
  
        if (callback) {
          callback();
        }
      }, duration);
    }
  };

const showDescription = (word, description, duration = 0) => {
    wordTitle.textContent = word;
    wordDescription.textContent = description;
  
    if (duration > 0) {
      setTimeout(() => {
        descriptionElement.textContent = '';
        descriptionElement.style.display = 'none';
      }, duration);
    }
};

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWord = word
    const guess = []
    const matchedIndices = []
  
    rowTiles.forEach(tile => {
      guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })
  
    guess.forEach((guess, index) => {
      if (guess.letter == word[index]) {
        guess.color = 'green-overlay'
        checkWord = checkWord.replace(guess.letter, '')
        matchedIndices.push(index)
      }
    })
  
    guess.forEach((guess, index) => {
      if (matchedIndices.includes(index)) {
        return
      }
      if (checkWord.includes(guess.letter)) {
        guess.color = 'yellow-overlay'
        checkWord = checkWord.replace(guess.letter, '')
      }
    })
  
    rowTiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add('flip')
        tile.classList.add(guess[index].color)
        addColorToKey(guess[index].letter, guess[index].color)
      }, 500 * index)
    })
  }

function startNewGame() {

    stopConfetti();

    resultModal.classList.add('hidemodal');
    document.querySelector('.happy-icon').setAttribute("hidden", "");;
    document.querySelector('.sad-icon').setAttribute("hidden", "");;
    const rowTiles = document.querySelectorAll('.tile');
    const keyButtons = document.querySelectorAll('.letterKey');
    nextGameButton.setAttribute("hidden", "true");
    wordTitle.innerHTML = "";
    wordDescription.innerHTML = "";
    rowTiles.forEach(tile => {
        tile.innerHTML = "";
        tile.classList.remove('flip');
        tile.classList.remove('grey-overlay');
        tile.classList.remove('yellow-overlay');
        tile.classList.remove('green-overlay');
    });
    keyButtons.forEach(key => {
        key.classList.remove('grey-overlay');
        key.classList.remove('yellow-overlay');
        key.classList.remove('green-overlay');
    });
    currentRow = 0;
    currentTile = 0;
    const newGameWord = getRandomWord(checkedLengths, wordsByLength);
    word = newGameWord.word;
    definition = newGameWord.definition;
    size = word.length;
    createTileBoard(size);
}

// Confetti

var maxParticleCount = 500; //set max confetti count
var particleSpeed = 0.5; //set the particle animation speed
var startConfetti; //call to start confetti animation
var stopConfetti; //call to stop adding confetti
var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
var removeConfetti; //call to stop the confetti animation and remove all confetti immediately
 
(function() {
	startConfetti = startConfettiInner;
	stopConfetti = stopConfettiInner;
	toggleConfetti = toggleConfettiInner;
	removeConfetti = removeConfettiInner;
	var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
	var streamingConfetti = false;
	var animationTimer = null;
	var particles = [];
	var waveAngle = 0;
	
	function resetParticle(particle, width, height) {
		particle.color = colors[(Math.random() * colors.length) | 0];
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 1 + 1;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = 0;
		return particle;
	}

	function startConfettiInner() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 16.6666667);
				};
		})();
		var canvas = document.getElementById("confetti-canvas");
		if (canvas === null) {
			canvas = document.createElement("canvas");
			canvas.setAttribute("id", "confetti-canvas");
			canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none");
			document.body.appendChild(canvas);
			canvas.width = width;
			canvas.height = height;
			window.addEventListener("resize", function() {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}, true);
		}
		var context = canvas.getContext("2d");
		while (particles.length < maxParticleCount)
			particles.push(resetParticle({}, width, height));
		streamingConfetti = true;
		if (animationTimer === null) {
			(function runAnimation() {
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				if (particles.length === 0)
					animationTimer = null;
				else {
					updateParticles();
					drawParticles(context);
					animationTimer = requestAnimFrame(runAnimation);
				}
			})();
		}
	}

	function stopConfettiInner() {
		streamingConfetti = false;
	}

	function removeConfettiInner() {
		stopConfetti();
		particles = [];
	}

	function toggleConfettiInner() {
		if (streamingConfetti)
			stopConfettiInner();
		else
			startConfettiInner();
	}

	function drawParticles(context) {
		var particle;
		var x;
		for (var i = 0; i < particles.length; i++) {
			particle = particles[i];
			context.beginPath();
			context.lineWidth = particle.diameter;
			context.strokeStyle = particle.color;
			x = particle.x + particle.tilt;
			context.moveTo(x + particle.diameter / 2, particle.y);
			context.lineTo(x, particle.y + particle.tilt /2 + particle.diameter / 2);
			context.stroke();
		}
	}

	function updateParticles() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var particle;
		waveAngle += 0.01;
		for (var i = 0; i < particles.length; i++) {
			particle = particles[i];
			if (!streamingConfetti && particle.y < -15)
				particle.y = height + 100;
			else {
				particle.tiltAngle += particle.tiltAngleIncrement;
				particle.x += Math.sin(waveAngle);
				particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
				particle.tilt = Math.sin(particle.tiltAngle) * 15;
			}
			if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
				if (streamingConfetti && particles.length <= maxParticleCount)
					resetParticle(particle, width, height);
				else {
					particles.splice(i, 1);
					i--;
				}
			}
		}
	}
})();
      