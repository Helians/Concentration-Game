window.addEventListener("load", createCards);

// global variable d eclaration
let cardObjArr = [];
let currentCard = null;
let cardTrack = 0;
let cardCount = 0;
let timer = 0;

//   for creating cards
function createCards() {
  startTimerSeconds();
  let grid = document.querySelector(".grid");
  grid.addEventListener("click", openCard);
  let cardIndex = 0;
  for (let i = 0; i < 4; i++) {
    let row = document.createElement("div");
    row.classList = "grid-row";
    grid.appendChild(row);
    for (let j = 0; j < 4; j++) {
      let card = document.createElement("div");
      let cardDataIndex = document.createAttribute("card-index");
      card.classList = "card";
      cardDataIndex.value = ++cardIndex;
      card.setAttributeNode(cardDataIndex);
      row.appendChild(card);
    }
  }
  shuffleCards();
}

// for reseting the cards and values
function resetCards() {
  cardObjArr = [];
  currentCard = null;
  cardTrack = 0;
  cardCount = 0;
  timer = 0;
  clearInterval(gameTimer);
  document.querySelectorAll(".card").forEach(element => {
    element.classList.remove("flip", "nomatch", "disable-click", "match");
    element.innerText = "";
  });
  document.querySelectorAll(".rating").forEach(element => {
    element.classList.add("checked");
  });
  document.getElementById("winMessage").style.cssText = "display:none";
  shuffleCards();
  startTimerSeconds();
}

// for shuffling cards
function shuffleCards() {
  cardObjArr = [];
  uniqueNumbers = [];
  let randomNumber;
  let cardDetails;
  while (uniqueNumbers.length !== 16) {
    // generate Random number for cards
    randomNumber = Math.floor(Math.random() * 16) + 1;
    if (uniqueNumbers.indexOf(randomNumber) === -1) {
      uniqueNumbers.push(randomNumber);
      cardDetails = {
        cardValue: Math.ceil(randomNumber / 2),
        cardFlag: 0
      };
      cardObjArr.push(cardDetails);
    }
  }
}

// for calculating the Timer seconds
let gameTimer;
function startTimerSeconds() {
  gameTimer = setInterval(calculateTime, 1000);
}

// match and mismatch logic
function openCard(e) {
  if (
    e.target.className.indexOf("grid-row") > -1 ||
    e.target.className.indexOf("grid") > -1
  ) {
    return;
  }
  let card = e.target;
  e.target.classList.add("disable-click");
  cardTrack++;
  let index = +e.target.getAttribute("card-index");
  if (
    !e.target.classList.contains("grid") &&
    !e.target.classList.contains("grid-row")
  ) {
    e.target.classList.add("flip");

    // once the card flips and number appears then check the card
    setTimeout(() => {
      card.innerText = cardObjArr[index - 1].cardValue;
      if (cardTrack % 2 !== 0) {
        currentCard = card;
      } else {
        //   if card does not match
        if (cardObjArr[index - 1].cardValue !== +currentCard.innerText) {
          e.target.classList.add("nomatch");
          currentCard.classList.add("nomatch");
          setTimeout(() => {
            e.target.innerText = "";
            currentCard.innerText = "";
            e.target.classList.remove("flip", "nomatch", "disable-click");
            currentCard.classList.remove("flip", "nomatch", "disable-click");
          }, 1000);
        } else {
          // if card matches
          e.target.classList.add("match", "disable-click");
          currentCard.classList.add("match", "disable-click");
          cardCount++;
        }
      }
    }, 200);
  }

  //   Rating calculation
  if (cardTrack / 2 > 12 && cardTrack / 2 <= 16) {
    document.getElementsByClassName("rating")[2].classList.remove("checked");
  } else if (cardTrack / 2 > 16 && cardTrack / 2 <= 20) {
    document.getElementsByClassName("rating")[1].classList.remove("checked");
  } else if (cardTrack / 2 > 20) {
    document.getElementsByClassName("rating")[0].classList.remove("checked");
  }
  //   winning condition
  setTimeout(() => {
    if (cardCount === 8) {
      document.getElementById("winMessage").style.cssText = "display:block";
      clearInterval(gameTimer);
    }
  }, 200);
}

// convert seconds to hh:mm:ss
function calculateTime() {
  document.getElementById("timer").innerText = new Date(++timer * 1000)
    .toISOString()
    .substr(11, 8);
}

// reset cards event
document.getElementById("reset-btn").addEventListener("click", resetCards);
