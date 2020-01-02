// css class for different card image
const CARD_TECHS = [
  "html5",
  "css3",
  "js",
  "sass",
  "nodejs",
  "react",
  "linkedin",
  "heroku",
  "github",
  "aws"
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  gameBoard: null,
  cards: null,
  cardNumber: 4,
  firstCard: null,
  currentCard: null,
  lockBoard: false
  // and much more
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  game.gameBoard = document.querySelector(".game-board");
  addCards();
  bindCardClick();
  bindStartButton();
}

function createCard(cardTech) {
  let cardBody = document.createElement("div");
  let front = document.createElement("div");
  let back = document.createElement("div");
  cardBody.className = "card " + cardTech;
  cardBody.setAttribute("data-tech", cardTech);
  front.className = "card__face card__face--front";
  back.className = "card__face card__face--back";
  cardBody.appendChild(front);
  cardBody.appendChild(back);
  game.gameBoard.appendChild(cardBody);
  game.gameBoard.style = `grid-template-columns: repeat(${game.level *
    2}, 1fr)`;
}

function addCards() {
  let count = 0;
  let index = 0;
  while (count < game.cardNumber / 2) {
    if (CARD_TECHS[index] === undefined) {
      index = 0;
    }
    createCard(CARD_TECHS[index]);
    createCard(CARD_TECHS[index]);
    count++;
    index++;
  }
}

function startGame() {
  reset();
  displayBoard();
  bindCardClick();
  shuffle();
}

function displayBoard() {
  const instruction = document.querySelector(".game-instruction");

  instruction.style.display = "none";
  game.gameBoard.style.display = "grid";
  game.startButton.innerHTML = "End Game";
  updateTimerDisplay();
  updateScore();
  shuffle();
}

function endGame() {
  clearInterval(game.timerDisplay);

  alert(`Your score is ${game.score}`);
  game.startButton.innerHTML = "Start Game";
  game.cards.forEach(card => card.removeEventListener("click", flipCard));
}

function reset() {
  game.cards.forEach(card => {
    card.classList.remove("card--flipped");
  });
  game.score = 0;
  updateScore();
  game.level = 1;
  updateLevel();
  game.timer = 60;
  updateTimerDisplay();
  game.cardNumber = 4;
  clearBoard();
  addCards();
}

function shuffle() {
  game.cards = document.querySelectorAll(".card");
  game.cards.forEach(card => {
    let ramdomPos = Math.floor(Math.random() * game.cardNumber);
    card.style.order = ramdomPos;
  });
}

function nextLevel() {
  game.level++;
  if (game.level > 3) {
    endGame();
  }
  updateLevel();
  game.timer = 60;
  updateTimerDisplay();
  clearBoard();
  game.cardNumber = (2 * game.level) ** 2;
  addCards();
  game.gameBoard.style.display = "grid";
  shuffle();
  bindCardClick();
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  document.querySelector(".game-stats__score--value").innerHTML = game.score;
}
function updateLevel() {
  document.querySelector(".game-stats__level--value").innerHTML = game.level;
}

function updateTimerDisplay() {
  clearInterval(game.timerDisplay);
  game.timerDisplay = setInterval(() => {
    game.timer -= 1;
    document.querySelector(".game-timer__bar").innerHTML = game.timer + "s";
    if (game.timer <= 0) {
      endGame();
    }
  }, 1000);
}

function clearBoard() {
  let child = game.gameBoard.lastElementChild;
  while (child) {
    game.gameBoard.removeChild(child);
    child = game.gameBoard.lastElementChild;
  }
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton = document.querySelector(".game-stats__button");
  game.startButton.addEventListener("click", function() {
    switch (this.innerHTML) {
      case "New Game":
      case "Start Game":
        startGame();
        break;
      case "End Game":
        endGame();
        break;
    }
  });
}

function flipCard() {
  if (game.lockBoard) return;
  this.classList.add("card--flipped");
  game.currentCard = this;
  if (this === game.firstCard) {
    game.firstCard.classList.remove("card--flipped");
    game.firstCard = null;
    return;
  }

  if (game.firstCard) {
    checkForMatch();
  } else {
    game.firstCard = game.currentCard;
  }

  let flippedCards = document.querySelectorAll(".card.card--flipped").length;
  if (flippedCards === game.cardNumber) {
    nextLevel();
  }
}

function checkForMatch() {
  let isMatch = game.firstCard.dataset.tech === game.currentCard.dataset.tech;
  if (isMatch) {
    disableCards();
    game.score += 10;
    updateScore();
  } else {
    unFlipCard();
  }
}

function disableCards() {
  game.firstCard.removeEventListener("click", flipCard);
  game.currentCard.removeEventListener("click", flipCard);
  [game.firstCard, game.currentCard] = [null, null];
}

function unFlipCard() {
  game.lockBoard = true;
  setTimeout(() => {
    game.firstCard.classList.remove("card--flipped");
    game.currentCard.classList.remove("card--flipped");
    [game.firstCard, game.currentCard] = [null, null];
    game.lockBoard = false;
  }, 1000);
}

function bindCardClick() {
  game.cards = document.querySelectorAll(".card");
  game.cards.forEach(card => {
    card.addEventListener("click", flipCard);
  });
}
