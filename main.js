// starting cordinates
let positionR = 1;
let positionC = 1;

// starting tile
let position = 0;

//score and remaining tiles counter
let score = 0;
let tilesLeft = 0;

// array to store tiles removed from board
let cancelledTiles = [];

//array with tiles still on board
let availableTiles = [
  00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
  76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  95, 96, 97, 98, 99,
];

// hook to place board
const playBoard = document.querySelector("body");

// hook to place players div
const playerPoint = document.querySelector(".player");

// read keyboard and proceed with move
playBoard.addEventListener("keydown", (e) => {
  //loop to avoid double key read
  if (e.defaultPrevented){
    return;
  }
  const move = e.key.toLocaleLowerCase();
  switch (move) {
    case "w":
      if (positionR > 1) {
        position -= 10;
        if (availableTiles.indexOf(position) != -1) {
          positionR -= 1;
          movePlayer();
        } else {
          position += 10;
        }
      }
      break;
    case "s":
      if (positionR < 10) {
        position += 10;
        if (availableTiles.indexOf(position) != -1) {
          positionR += 1;
          movePlayer();
        } else {
          position -= 10;
        }
      }
      break;
    case "a":
      if (positionC > 1) {
        position -= 1;
        if (availableTiles.indexOf(position) != -1) {
          positionC -= 1;
          movePlayer();
        } else {
          position += 1;
        }
      }
      break;
    case "d":
      if (positionC < 10) {
        position += 1;
        if (availableTiles.indexOf(position) != -1) {
          positionC += 1;
          movePlayer();
        } else {
          position -= 1;
        }
      }
      break;
  }
  e.defaultPrevented();
}, true);

/* move player's div*/
function cssUpdate(positionX, positionY) {
  // hook for css file
  let myStyle = document.styleSheets[1];

  //new rule to be applied with position
  let newRulePlayer = `.player{
         height: 25px;
         width: 25px;
         border-radius: 50%;
         background: goldenrod;
         border: 1px solid black;
         z-index: 1;
         justify-self: center;
         align-self: center;
         visibility: visible;
         grid-row: ${positionY};
         grid-column: ${positionX};
        }`;

  //remove old rule describing position
  myStyle.deleteRule(3);

  //add new rule describing positon
  myStyle.insertRule(newRulePlayer, 3);
}

//check if further play is still possible
function stillAlive() {
  const feedbackScore = document.querySelector(".score");
  const feedbackLeft = document.querySelector(".left");

  availableTiles.forEach(() => {tilesLeft += 1;});
  feedbackLeft.textContent = `Tiles left: ${tilesLeft}`;
  
  if((availableTiles.indexOf(position + 1) === -1) && (availableTiles.indexOf(position - 1) === -1) && (availableTiles.indexOf(position + 10) === -1) && (availableTiles.indexOf(position - 10) === -1)){
    feedbackScore.textContent = `Gamve over! Score: ${score}`;
  }
  tilesLeft = 0;
}

// main game loop = count the score, check if game is not finished, remove a tile, choose a green and red new tile to be placed on the board
function eventHorizion() {
  score += 1;
  stillAlive();
  randomRemove();
  entropyRise();
}

/*check type of tile*/
function checkTile(xCoord, yCoord) {
  let tileToCheck = document.querySelector(`.box.box${xCoord}.row${yCoord}.active`);
  if (tileToCheck === null) {
    tileToCheck = document.querySelector(
      `.box.box${xCoord}.row${yCoord}.good`
    );
    if (tileToCheck === null) {
      return "evil";
    }
    return "good";
  }
  return "clear";
}

// player move - update position and verify type of entered tile
function movePlayer() {
  let playerColumn = positionC + " / " + (positionC + 1);
  let playerRow = positionR + " / " + (positionR + 1);

  cssUpdate(playerColumn, playerRow);

  const enteredTile = checkTile(positionC - 1, positionR - 1);
  switch (enteredTile) {
    case "good":
      randomAdd();
      break;
    case "evil":
      randomRemove();
      break;
    case "clear":
      break;
  }
  eventHorizion();
}

// change style of selected tile
function colorChange(tileNumber, target) {
  const xCoord = tileNumber % 10;
  const yCoord = Math.floor(tileNumber / 10);

  let tileToChange = document.querySelector(`.box.box${xCoord}.row${yCoord}.active`);
  if (tileToChange === null) {
    tileToChange = document.querySelector(
      `.box.box${xCoord}.row${yCoord}.nonActive`
    );
  }
  if (tileToChange === null) {
    tileToChange = document.querySelector(
      `.box.box${xCoord}.row${yCoord}.good`
    );
  }
  if (tileToChange === null) {
    tileToChange = document.querySelector(
      `.box.box${xCoord}.row${yCoord}.evil`
    );
  }

    tileToChange.className = `box box${xCoord} row${yCoord} ${target}`;

}


// remove tile
function removeTile(index, value) {
  cancelledTiles.push(value);
  tempTiles0 = availableTiles.slice(0, index);
  tempTiles1 = availableTiles.slice(index + 1);
  availableTiles = tempTiles0.concat(tempTiles1);

  colorChange(value, "nonActive");
}

//select tile to remove
function randomRemove() {
  let chosen = Math.floor(Math.random() * 99);

  const inArray = availableTiles.indexOf(chosen);
  if (inArray != -1 && inArray != position) {
    removeTile(inArray, chosen);
  } else {
    randomRemove();
  }
}

//add new tile
function addTile(value) {
  availableTiles.push(value);
  const index = cancelledTiles.indexOf(value);
  tempTiles0 = cancelledTiles.slice(0, index);
  tempTiles1 = cancelledTiles.slice(index + 1);
  cancelledTiles = tempTiles0.concat(tempTiles1);

  colorChange(value, "active");
}

//select tile to add
function randomAdd() {
  let chosen = Math.floor(Math.random() * 99);

  const inArray = availableTiles.indexOf(chosen);
  if (inArray != -1) {
    addTile(chosen);
  } else {
    randomAdd();
  }
}

//select tile
function randomTile() {
     let chosen = Math.floor(Math.random() * 99);
    const inArray = availableTiles.indexOf(chosen);
  if (inArray == -1) {
    randomTile();
  } else {
    return chosen;
  }
}


//select new tile to be red and new one to be green
function entropyRise() {
  const newRed = randomTile();
  colorChange(newRed, "evil");
  const newGreen = randomTile();
  colorChange(newGreen, "good");
}
