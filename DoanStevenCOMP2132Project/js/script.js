const gameState = {
  playerRoundScore: 0,
  computerRoundScore: 0,
  playerTotalScore: 0,
  computerTotalScore: 0,
  rollCount: 0,
};

function fadeOut(elementId, duration = 50) {
  const element = document.getElementById(elementId);
  if (!element) { 
    console.warn('Element with id', elementId, 'not found');
    return;
  }
  let opacity = 1;
  const timer = setInterval(function() {
    if (opacity <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
      element.style.opacity = 1; 
    }
    element.style.opacity = opacity;
    element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
    opacity -= opacity * 0.1;
  }, duration);
}

document.addEventListener("DOMContentLoaded", function() {
  const playerDice = document.querySelectorAll('.player .dice-container img');
  const computerDice = document.querySelectorAll('.computer .dice-container img');
  const playerRoundScoreElement = document.getElementById('playerRoundScore');
  const computerRoundScoreElement = document.getElementById('computerRoundScore');
  const playerTotalScoreElement = document.getElementById('playerTotalScore');
  const computerTotalScoreElement = document.getElementById('computerTotalScore');
  const rollButton = document.getElementById('rollButton');
  const resetButton = document.getElementById('resetButton');

  function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function updateDiceImages(diceElements, diceValues) {
    for (let i = 0; i < diceElements.length; i++) {
      const dieValue = diceValues[i];
      diceElements[i].src = `images/dice-${dieValue}.svg`;
      diceElements[i].alt = `Die ${dieValue}`;
    }
  }

  function updateScoreDisplay(player, roundScore, totalScore) {
    const roundScoreElement = (player === 'player') ? playerRoundScoreElement : computerRoundScoreElement;
    const totalScoreElement = (player === 'player') ? playerTotalScoreElement : computerTotalScoreElement;
    roundScoreElement.textContent = roundScore;
    totalScoreElement.textContent = totalScore;
  }

  function checkScores() {
    if (gameState.rollCount >= 3) {
      let message = '';
      if (gameState.playerTotalScore > gameState.computerTotalScore) {
        message = 'Game Over! Player wins!';
      } else if (gameState.computerTotalScore > gameState.playerTotalScore) {
        message = 'Game Over! Computer wins!';
      } else {
        message = 'Game Over! It\'s a tie!';
      }
  
      document.getElementById('popupMessage').innerText = message;
      document.getElementById('popup').style.display = 'block';
      rollButton.disabled = true;
    }
  }

  
  document.getElementById('popupCloseButton').addEventListener('click', function() {
    fadeOut('popup', 15); 
  });

  
  window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('popup')) {
      fadeOut('popup', 15); 
    }
  });

  function resetGame() {
    gameState.playerRoundScore = 0;
    gameState.computerRoundScore = 0;
    gameState.playerTotalScore = 0;
    gameState.computerTotalScore = 0;
    gameState.rollCount = 0;

    document.getElementById('popup').style.display = 'none';
    document.getElementById('popupMessage').innerText = '';

    updateScoreDisplay('player', gameState.playerRoundScore, gameState.playerTotalScore);
    updateScoreDisplay('computer', gameState.computerRoundScore, gameState.computerTotalScore);
    playerDice.forEach(die => die.src = 'images/diceplaceholder.png');
    computerDice.forEach(die => die.src = 'images/diceplaceholder.png');
    rollButton.disabled = false;
  }

  rollButton.addEventListener('click', function() {
    gameState.rollCount++;
    const playerDie1Value = rollDie();
    const playerDie2Value = rollDie();
    const computerDie1Value = rollDie();
    const computerDie2Value = rollDie();

    fadeOut('playerDie1Instruction');
    fadeOut('computerDie1Instruction');
   

    updateDiceImages(playerDice, [playerDie1Value, playerDie2Value]);
    updateDiceImages(computerDice, [computerDie1Value, computerDie2Value]);

    gameState.playerRoundScore = (playerDie1Value === 1 || playerDie2Value === 1) ? 0 : ((playerDie1Value === playerDie2Value) ? (playerDie1Value + playerDie2Value) * 2 : playerDie1Value + playerDie2Value);
    gameState.computerRoundScore = (computerDie1Value === 1 || computerDie2Value === 1) ? 0 : ((computerDie1Value === computerDie2Value) ? (computerDie1Value + computerDie2Value) * 2 : computerDie1Value + computerDie2Value);

    gameState.playerTotalScore += gameState.playerRoundScore;
    gameState.computerTotalScore += gameState.computerRoundScore;

    updateScoreDisplay('player', gameState.playerRoundScore, gameState.playerTotalScore);
    updateScoreDisplay('computer', gameState.computerRoundScore, gameState.computerTotalScore);

    checkScores();

    if (gameState.rollCount >= 3) {
      rollButton.disabled = true;
    }
  });

  resetButton.addEventListener('click', function() {
    resetGame();
  });

  resetGame();
});
