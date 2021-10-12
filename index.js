let gameObject = {
  isWall: true,
  snake: {
    x: 160,
    y: 160,
    speed: {
      dx: 0,
      dy: 0,
    },
    bodies: [],
    maxBodies: 1,
  },
  blocks: [],
  bodyWidth: 20,
  DELAY: 100,
  speed: 8,
  level: 1,
  needEat: getRandomInt(3, 10, 2),
  levelFinished: false,
  finishcoord: {
    x: 0,
    y: 0,
  },
  isChoiseBlock: false,
  break: false,
};

const width = 400;
const widthAndBorder = width - gameObject.bodyWidth * 2;
const board_border = "black";
const board_background = "white";
const snake_col = "lightblue";
const snake_border = "darkblue";

class Block {
  constructor({ x, y }, color, collision, eatable) {
    this.width = gameObject.bodyWidth;
    this.x = x;
    this.y = y;
    this.color = color;
    this.isCollision = collision;
    this.eatable = eatable;
  }
  draw() {
    gameObject.context.fillStyle = this.color;
    gameObject.context.strokestyle = snake_border;
    gameObject.context.fillRect(this.x, this.y, this.width, this.width);
    gameObject.context.strokeRect(this.x, this.y, this.width, this.width);
  }
}

class Fruit extends Block {
  constructor({ x, y }, color, collision, eatable) {
    super({ x, y }, color, collision, eatable);
  }
  eat(index) {
    if (
      this.eatable &&
      gameObject.snake.x == this.x &&
      gameObject.snake.y == this.y
    ) {
      gameObject.blocks.splice(index, 1);
      gameObject.snake.maxBodies += 1;
      if (!gameObject.levelFinished)
        gameObject.blocks.push(
          new Fruit(getRandomCoords(), "red", false, true)
        );
    }
  }
}

window.onload = function () {
  htmlInitialization();
};

function initialization() {
  createWalls();
  generateBushes();
  gameObject.blocks.push(spawnEat());
  gameCycle();
}

function gameCycle() {
  clearCanvas();
  calculate();
  drawing();
  drawCount();
  if (!gameObject.break) setTimeout(gameCycle, 1000 / gameObject.speed);
}

function drawing() {
  gameObject.snake.bodies.forEach((snakePart) => snakePart.draw());
  gameObject.blocks.forEach((block) => {
    block.draw();
  });
}

function calculate() {
  let isCollision = checkCollision();
  isSelfCollision();
  moveSnake(isCollision);
  blocksCollision();

  if (!isCollision) {
    gameObject.snake.bodies.unshift(
      new Block({ x: gameObject.snake.x, y: gameObject.snake.y }, "blue", false)
    );
    if (gameObject.snake.bodies.length > gameObject.snake.maxBodies) {
      gameObject.snake.bodies.pop();
    }
  }

  gameObject.blocks.forEach((block, index) => {
    if (block instanceof Fruit) {
      block.eat(index);
    }
  });

  if (gameObject.needEat == gameObject.snake.maxBodies - 1) {
    choiseBlock();
    gameObject.levelFinished = true;
  }
  if (gameObject.levelFinished) isFinish();
}

function checkCollision() {
  if (
    ((gameObject.snake.x > widthAndBorder && gameObject.snake.speed.dx == 1) ||
      (gameObject.snake.x <= 20 && gameObject.snake.speed.dx == -1)) &&
    !(gameObject.finishcoord.x == gameObject.snake.x)
  )
    snakeDied();
  else if (
    ((gameObject.snake.y > widthAndBorder && gameObject.snake.speed.dy == 1) ||
      (gameObject.snake.y <= 20 && gameObject.snake.speed.dy == -1)) &&
    !(gameObject.finishcoord.y == gameObject.snake.y)
  )
    snakeDied();
}

function isSelfCollision() {
  gameObject.snake.bodies.forEach((body, index) => {
    if (
      index != 0 &&
      gameObject.snake.x == body.x &&
      gameObject.snake.y == body.y
    ) {
      snakeDied();
    }
  });
}

function blocksCollision() {
  gameObject.blocks.forEach((block) => {
    if (
      gameObject.snake.x == block.x &&
      gameObject.snake.y == block.y &&
      !(block instanceof Fruit) &&
      !(block.color == "pink")
    ) {
      snakeDied();
    }
  });
}

function clearCanvas() {
  gameObject.context.fillStyle = board_background;
  gameObject.context.strokestyle = board_border;
  gameObject.context.fillRect(0, 0, width, width);
  gameObject.context.strokeRect(0, 0, width, width);
}

function moveSnake(isDirStop) {
  if (isDirStop != "x")
    gameObject.snake.x += gameObject.snake.speed.dx * gameObject.bodyWidth;
  if (isDirStop != "y")
    gameObject.snake.y += gameObject.snake.speed.dy * gameObject.bodyWidth;
}

function getRandomCoords() {
  let x,
    y,
    isOnSnake = false;
  do {
    isOnSnake = false;
    x = getRandomInt(20, 370, gameObject.bodyWidth);
    y = getRandomInt(20, 370, gameObject.bodyWidth);

    gameObject.snake.bodies.forEach((body) => {
      if (body.x == x && body.y == y) {
        isOnSnake = true;
      }
    });
  } while (isOnSnake);
  return { x, y };
}

function isFinish() {
  if (
    (gameObject.finishcoord.x == gameObject.snake.x &&
      gameObject.finishcoord.y == gameObject.snake.y) ||
    gameObject.break
  ) {
    gameObject.break = false;
    gameObject.snake.x = 160;
    gameObject.snake.y = 160;
    gameObject.blocks = [];
    gameObject.snake.maxBodies = 1;
    gameObject.snake.bodies = [];
    gameObject.snake.speed.dx = gameObject.snake.speed.dy = 0;
    gameObject.level += 1;
    gameObject.levelFinished = false;
    gameObject.isChoiseBlock = false;
    document.querySelector("#levelText").style.display = "none";
    gameObject.blocks.push(spawnEat());
    createWalls();
    generateBushes();
    generateNeedEat();
  }
}

function getRandomInt(min, max, multiple) {
  return Math.floor((Math.random() * (max - min)) / multiple) * multiple + min;
}

onkeydown = function (e) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  var key = e.keyCode;
  let dx = gameObject.snake.speed.dx;
  let dy = gameObject.snake.speed.dy;

  if (key == LEFT_KEY && (dx != 1 || dx == 0)) {
    gameObject.snake.speed.dx = -1;
    gameObject.snake.speed.dy = 0;
  }

  if (key == RIGHT_KEY && (dx != -1 || dx == 0)) {
    gameObject.snake.speed.dx = 1;
    gameObject.snake.speed.dy = 0;
  }

  if (key == UP_KEY && (dy != 1 || dy == 0)) {
    gameObject.snake.speed.dx = 0;
    gameObject.snake.speed.dy = -1;
  }

  if (key == DOWN_KEY && (dy != -1 || dy == 0)) {
    gameObject.snake.speed.dx = 0;
    gameObject.snake.speed.dy = 1;
  }
};

function drawCount() {
  document.querySelector("#count").textContent = gameObject.snake.maxBodies - 1;
  document.querySelector("#lvl").textContent = gameObject.level;
  document.querySelector("#needEat").textContent = gameObject.needEat;
  if (gameObject.levelFinished)
    document.querySelector("#levelText").style.display = "block";
}

function htmlInitialization() {
  gameObject.canvas = document.querySelector("#gameCanvas");
  gameObject.context = gameObject.canvas.getContext("2d");
  initialization();
}

function createWalls() {
  for (let x = 0; x <= width; x += gameObject.bodyWidth) {
    for (let y = 0; y <= width; y += gameObject.bodyWidth) {
      if (
        x == width - gameObject.bodyWidth ||
        x == 0 ||
        y == width - gameObject.bodyWidth ||
        y == 0
      ) {
        gameObject.blocks.push(new Block({ x, y }, "brown", true, false));
      }
    }
  }
}

let choiseBlock = (function () {
  return function () {
    if (!gameObject.isChoiseBlock) {
      gameObject.isChoiseBlock = true;
      let isNotCorner = false;
      let index;
      do {
        isNotCorner = false;
        index = Math.floor(Math.random() * gameObject.blocks.length);
        let block = gameObject.blocks[index];
        if (
          !(
            block.x < widthAndBorder - 10 &&
            block.x > 30 &&
            block.y > widthAndBorder - 10 &&
            block.color == "brown"
          )
        ) {
          isNotCorner = true;
        }
      } while (isNotCorner);
      gameObject.exit = {
        x: gameObject.blocks[index].x,
        y: gameObject.blocks[index].y,
      };
      gameObject.blocks[index].color = "pink";
      gameObject.finishcoord = {
        x: gameObject.blocks[index].x,
        y: gameObject.blocks[index].y - 20,
      };
      gameObject.blocks.push(
        new Block(
          { x: gameObject.finishcoord.x, y: gameObject.finishcoord.y },
          "pink",
          false,
          false
        )
      );
    }
  };
})();

function spawnEat() {
  return new Fruit(getRandomCoords(), "red", false, true);
}

function generateNeedEat() {
  gameObject.needEat = getRandomInt(
    3 + gameObject.level,
    10 + gameObject.level,
    2
  );
}

function generateBushes() {
  for (let i = 0; i <= gameObject.level; i++)
    gameObject.blocks.push(new Block(getRandomCoords(), "green", true, false));
}

function snakeDied() {
  gameObject.break = true;
  document.querySelector("#refresh").style.display = "block";
  hideText();
  isFinish();
  gameObject.level = 1;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const hideText = async () => {
  await delay(5000);
  document.querySelector("#refresh").style.display = "none";
};
