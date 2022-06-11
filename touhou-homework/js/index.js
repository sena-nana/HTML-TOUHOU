(function (window) {
  var Touhou = window.Touhou || {};
  window.Touhou = window.Touhou || Touhou;

  Touhou.MathUtil = {};

  Touhou.MathUtil.PI_180 = Math.PI / 180;
  Touhou.MathUtil.ONE80_PI = 180 / Math.PI;

  Touhou.MathUtil.PI2 = Math.PI * 2;
  Touhou.MathUtil.HALF_PI = Math.PI / 2;

  Touhou.MathUtil.normalize = function (value, minimum, maximum) {
    return (value - minimum) / (maximum - minimum);
  };

  Touhou.MathUtil.interpolate = function (normValue, minimum, maximum) {
    return minimum + (maximum - minimum) * normValue;
  };

  Touhou.MathUtil.map = function (value, min1, max1, min2, max2) {
    return Touhou.MathUtil.interpolate(
      Touhou.MathUtil.normalize(value, min1, max1),
      min2,
      max2
    );
  };

  Touhou.MathUtil.getRandomNumberInRange = function (min, max) {
    return min + Math.random() * (max - min);
  };

  Touhou.MathUtil.getRandomIntegerInRange = function (min, max) {
    return Math.round(Touhou.MathUtil.getRandomNumberInRange(min, max));
  };
})(window);

(function (window) {
  var Touhou = window.Touhou || {};
  window.Touhou = window.Touhou || Touhou;

  Touhou.Geom = {};

  Touhou.Geom.Point = function (x, y) {
    this.x = isNaN(x) ? 0 : x;
    this.y = isNaN(y) ? 0 : y;
  };

  Touhou.Geom.Point.prototype.clone = function () {
    return new Touhou.Geom.Point(this.x, this.y);
  };

  Touhou.Geom.Point.prototype.update = function (x, y) {
    this.x = isNaN(x) ? this.x : x;
    this.y = isNaN(y) ? this.y : y;
  };

  Touhou.Geom.Point.prototype.equals = function (point) {
    return this.x == point.x && this.y == point.y;
  };

  Touhou.Geom.Point.prototype.toString = function () {
    return "{x:" + this.x + " , y:" + this.y + "}";
  };

  Touhou.Geom.Rectangle = function (x, y, width, height) {
    this.update(x, y, width, height);
  };

  Touhou.Geom.Rectangle.prototype.update = function (x, y, width, height) {
    this.x = isNaN(x) ? 0 : x;
    this.y = isNaN(y) ? 0 : y;
    this.width = isNaN(width) ? 0 : width;
    this.height = isNaN(height) ? 0 : height;
  };

  Touhou.Geom.Rectangle.prototype.getRight = function () {
    return this.x + this.width;
  };

  Touhou.Geom.Rectangle.prototype.getBottom = function () {
    return this.y + this.height;
  };

  Touhou.Geom.Rectangle.prototype.getCenterX = function () {
    return this.x + this.width / 2;
  };

  Touhou.Geom.Rectangle.prototype.getCenterY = function () {
    return this.y + this.height / 2;
  };

  Touhou.Geom.Rectangle.prototype.containsPoint = function (x, y) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.getRight() &&
      y <= this.getBottom()
    );
  };

  Touhou.Geom.Rectangle.prototype.clone = function () {
    return new Touhou.Geom.Rectangle(this.x, this.y, this.width, this.height);
  };

  Touhou.Geom.Rectangle.prototype.toString = function () {
    return (
      "Rectangle{x:" +
      this.x +
      " , y:" +
      this.y +
      " , width:" +
      this.width +
      " , height:" +
      this.height +
      "}"
    );
  };
})(window);

(function (window) {
  var Touhou = window.Touhou || {};
  window.Touhou = window.Touhou || Touhou;

  Touhou.CanvasTextUtil = {};

  Touhou.CanvasTextUtil.getFontSizeForRect = function (
    string,
    fontProps,
    rect,
    canvas,
    fillStyle
  ) {
    if (!canvas) {
      var canvas = document.createElement("canvas");
    }
    if (!fillStyle) {
      fillStyle = "#000000";
    }
    var context = canvas.getContext("2d");
    context.font = fontProps.getFontString();
    context.textBaseline = "top";

    var copy = fontProps.clone();

    context.font = copy.getFontString();
    var width = context.measureText(string).width;

    if (width < rect.width) {
      while (
        context.measureText(string).width < rect.width ||
        copy.fontSize * 1.5 < rect.height
      ) {
        copy.fontSize++;
        context.font = copy.getFontString();
      }
    } else if (width > rect.width) {
      while (
        context.measureText(string).width > rect.width ||
        copy.fontSize * 1.5 > rect.height
      ) {
        copy.fontSize--;
        context.font = copy.getFontString();
      }
    }

    return copy.fontSize;
  };

  Touhou.CanvasTextProperties = function (
    fontWeight,
    fontStyle,
    fontSize,
    fontFace
  ) {
    this.fontWeight = fontWeight;
    this.fontStyle = "normal";
    this.fontSize = fontSize;
    this.fontFace = "Yuanti SC";
  };
  Touhou.CanvasTextProperties.NORMAL = "normal";
  Touhou.CanvasTextProperties.BOLD = "bold";
  Touhou.CanvasTextProperties.BOLDER = "bolder";
  Touhou.CanvasTextProperties.LIGHTER = "lighter";

  Touhou.CanvasTextProperties.ITALIC = "italic";
  Touhou.CanvasTextProperties.OBLIQUE = "oblique";

  Touhou.CanvasTextProperties.prototype.clone = function () {
    return new Touhou.CanvasTextProperties(
      this.fontWeight,
      this.fontStyle,
      this.fontSize,
      this.fontFace
    );
  };

  Touhou.CanvasTextProperties.prototype.getFontString = function () {
    return (
      this.fontWeight +
      " " +
      this.fontStyle +
      " " +
      this.fontSize +
      "px " +
      this.fontFace
    );
  };
})(window);

window.requestAnimationFrame =
  window.__requestAnimationFrame ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (function () {
    return function (callback, element) {
      var lastTime = element.__lastTime;
      if (lastTime === undefined) {
        lastTime = 0;
      }
      var currTime = Date.now();
      var timeToCall = Math.max(1, 33 - (currTime - lastTime));
      window.setTimeout(callback, timeToCall);
      element.__lastTime = currTime + timeToCall;
    };
  })();

var readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    init();
  }
}, 10);

var canvas;
var context;
var canvasContainer;
var htmlBounds;
var bounds;
var minimumStageWidth = 300;
var minimumStageHeight = 300;
var maxStageWidth = 800;
var maxStageHeight = 1100;
var resizeTimeoutId = -1;

function init() {
  canvasContainer = document.getElementById("canvasContainer");
  window.onresize = resizeHandler;
  window.addEventListener("keydown", keyDownEventHandler);
  window.addEventListener("keyup", keyUpEventHandler);
  commitResize();
}

function getWidth(element) {
  return Math.max(
    element.scrollWidth,
    element.offsetWidth,
    element.clientWidth
  );
}
function getHeight(element) {
  return Math.max(
    element.scrollHeight,
    element.offsetHeight,
    element.clientHeight
  );
}

function resizeHandler() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  clearTimeout(resizeTimeoutId);
  clearTimeoutsAndIntervals();
  resizeTimeoutId = setTimeout(commitResize, 100);
}

function commitResize() {
  if (canvas) {
    canvasContainer.removeChild(canvas);
  }
  canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  context = canvas.getContext("2d");
  canvasContainer.appendChild(canvas);

  htmlBounds = new Touhou.Geom.Rectangle(
    0,
    0,
    getWidth(canvasContainer),
    getHeight(canvasContainer)
  );
  if (htmlBounds.width >= maxStageWidth) {
    canvas.width = maxStageWidth;
    canvas.style.left = htmlBounds.getCenterX() - maxStageWidth / 2 + "px";
  } else {
    canvas.width = htmlBounds.width;
    canvas.style.left = "0px";
  }
  if (htmlBounds.height > maxStageHeight) {
    canvas.height = maxStageHeight;
    canvas.style.top = htmlBounds.getCenterY() - maxStageHeight / 2 + "px";
  } else {
    canvas.height = htmlBounds.height;
    canvas.style.top = "0px";
  }
  bounds = new Touhou.Geom.Rectangle(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (bounds.width < minimumStageWidth || bounds.height < minimumStageHeight) {
    stageTooSmallHandler();
    return;
  }
  startDemo();
}

function stageTooSmallHandler() {
  var warning = "Sorry, bigger screen required :(";
  context.font = "bold normal 24px sans-serif";
  context.fillText(
    warning,
    bounds.getCenterX() - context.measureText(warning).width / 2,
    bounds.getCenterY() - 12
  );
}
var music = document.getElementById("bgm");
var HOME = 0;
var GAME = 1;
var GAME_OVER = 2;
var gameState;
var scrollSpeed = 3;
var score;
var fontProperties = new Touhou.CanvasTextProperties(
  Touhou.CanvasTextProperties.BOLD,
  null,
  80
);
var lives = 5;
var word = "TOUHOU";

function startDemo() {
  canvas.addEventListener("keydown", handleUserTap);
  lives = 5;
  if (!logoCanvas) {
    logoCanvas = document.createElement("canvas");
    logoCanvasBG = document.createElement("canvas");
  }
  createLogo("TOUHOU HOMEWORK", logoCanvas, logoCanvasBG);
  if (!gameOverCanvas) {
    gameOverCanvas = document.createElement("canvas");
    gameOverCanvasBG = document.createElement("canvas");
  }
  createLogo("GAME OVER", gameOverCanvas, gameOverCanvasBG);

  createGroundPattern();
  createreimu();
  createdanmus();
  createCityGraphic();
  score = 0;
  gameState = HOME;
  loop();
}

function loop() {
  switch (gameState) {
    case HOME:
      renderHome();
      break;
    case GAME:
      renderGame();
      break;
    case GAME_OVER:
      renderGameOver();
      break;
  }
}
var direction = { left: false, top: false, right: false, bottom: false };
function handleUserTap(event) {
  switch (gameState) {
    case HOME:
      gameState = GAME;
      break;
    case GAME:
      if (direction.top) {
        reimuYSpeed = -4;
      }
      if (direction.bottom) {
        reimuYSpeed = 4;
      }
      if (direction.right) {
        reimuXSpeed = 4;
      }
      if (direction.left) {
        reimuXSpeed = -4;
      }
      break;
    case GAME_OVER:
      commitResize();
      break;
  }
  if (event) {
    event.preventDefault();
  }
}
function keyUpEventHandler(event) {
  switch (event.keyCode) {
    case 37:
      direction.left = false;
      reimuXSpeed = 0;
      break;
    case 38:
      direction.top = false;
      reimuYSpeed = 0;
      break;
    case 39:
      direction.right = false;
      reimuXSpeed = 0;
      break;
    case 40:
      direction.bottom = false;
      reimuYSpeed = 0;
      break;
  }
  handleUserTap(event);
}
function keyDownEventHandler(event) {
  switch (event.keyCode) {
    case 37:
      direction.left = true;
      break;
    case 38:
      direction.top = true;
      break;
    case 39:
      direction.right = true;
      break;
    case 40:
      direction.bottom = true;
      break;
  }
  handleUserTap(event);
}
function renderHome() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  renderLogo();
  renderInstructions();
  window.requestAnimationFrame(loop, canvas);
}

function renderGame() {
  music.play();
  context.clearRect(0, 0, canvas.width, canvas.height);
  updatedanmus();
  renderdanmus();
  updatereimu();
  if (!lives) {
    gameOverHandler();
    return;
  }
  renderreimu();

  renderScore();
  window.requestAnimationFrame(loop, canvas);
}

function gameOverHandler() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  gameState = GAME_OVER;
  renderGameOver();
}

function renderGameOver() {
  music.pause();
  dead.play();
  danmus = [];
  danmusum = 0;
  danmunum = 0;
  score = 0;
  
  context.drawImage(
    gameOverCanvas,
    bounds.getCenterX() - logoCanvas.width / 2,
    canvas.height * 0.2
  );

  var instruction = "少女祈祷中";
  context.font = "bold normal 24px sans-serif";
  context.fillStyle = "#FFFFFF";
  context.fillText(
    instruction,
    bounds.getCenterX() - context.measureText(instruction).width / 2,
    canvas.height * 0.25 + gameOverCanvas.height
  );
  renderScore();
}

function renderLogo() {
  logoCurrentY += logoDirection;
  context.drawImage(
    logoCanvas,
    bounds.getCenterX() - logoCanvas.width / 2,
    logoCurrentY
  );
  if (logoCurrentY <= logoY || logoCurrentY >= logoMaxY) {
    logoDirection *= -1;
  }
}

function renderInstructions() {
  var instruction = "少女祈祷中";
  context.font = "bold normal 24px sans-serif";
  context.fillStyle = "#6697ed";
  context.fillText(
    instruction,
    bounds.getCenterX() - context.measureText(instruction).width / 2,
    canvas.height * 0.2
  );
}

function renderScore() {
  context.font = fontProperties.getFontString();
  context.fillStyle = "#6697ed";
  context.strokeStyle = "#FFFFFF";
  context.lineWidth = 3;
  var x = bounds.getCenterX() - context.measureText(score).width / 2;
  var y = bounds.height * 0.1;
  context.fillText(score, x, y);
  context.strokeText(score, x, y);
}

var logoCanvas;
var logoCanvasBG;

var gameOverCanvas;
var gameOverCanvasBG;

var logoY;
var logoCurrentY;
var logoMaxY;
var logoDirection;

function createLogo(logoText, logoCanvas, logoCanvassBG) {
  logoCanvas.width = logoCanvasBG.width = canvas.width;
  logoCanvas.height = logoCanvasBG.height = canvas.height / 4;
  logoCurrentY = logoY = canvas.height * 0.25;
  logoMaxY = canvas.height * 0.35;
  logoDirection = 1;
  var logoContext = logoCanvas.getContext("2d");
  logoContext.textBaseline = "top";
  var textRect = new Touhou.Geom.Rectangle(
    0,
    0,
    logoCanvas.width * 0.8,
    logoCanvas.height
  );
  var logoFontProps = fontProperties.clone();
  logoFontProps.fontSize = Touhou.CanvasTextUtil.getFontSizeForRect(
    logoText,
    fontProperties,
    textRect
  );

  var logoBGContext = logoCanvasBG.getContext("2d");
  logoBGContext.fillStyle = '#332874';
  logoBGContext.fillRect(0, 0, logoCanvasBG.width, logoCanvasBG.height);
  logoBGContext.fillStyle = "#4d72b3";
  logoBGContext.fillRect(
    0,
    logoFontProps.fontSize / 2,
    logoCanvasBG.width,
    logoCanvasBG.height
  );

  logoContext.font = logoFontProps.getFontString();
  logoContext.fillStyle = logoContext.createPattern(logoCanvasBG, "repeat-x");
  logoContext.strokeStyle = "#000000";
  logoContext.lineWidth = 3;
  var x = logoCanvas.width / 2 - logoContext.measureText(logoText).width / 2;
  var y = logoFontProps.fontSize / 2;
  logoContext.fillText(logoText, x, 0);
  logoContext.strokeText(logoText, x, 0);
}
var damage=document.getElementById('damage');
var reimuCanvas;
var reimuYSpeed = 0;
var reimuXSpeed = 0;
var reimuSize = 2;
var kianatime = 0;
function updatereimu() {
  characters.y += reimuYSpeed;
  characters.x += reimuXSpeed;
  //floor
  if (characters.y >= groundGraphicRect.y - reimuCanvas.height) {
    characters.y = groundGraphicRect.y - reimuCanvas.height;
    reimuYSpeed = 0;
  }
  //celing
  if (characters.y <= 0) {
    characters.y = 1;
    reimuYSpeed = 0;
  }
  if (characters.x <= 0) {
    characters.x = 1;
    reimuXSpeed = 0;
  }
  //danmu collision
  if (isHit) {
    kianatime++;
    if (kianatime == 30) {
      isHit = false;
      kianatime = 0;
    }
  }
  if (!isHit && checkdanmusCollision()) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    removeCharacter();
    damage.play();
    isHit = true;
  }
}

var currentdanmu;
var isHit = false;

function renderreimu() {
  context.drawImage(characters.image, characters.x - 15, characters.y - 25);
  //context.drawImage(enimies.image, enimies.x - 20, enimies.y - 25,62,94);
  var aka = new Image();
  aka.src = "assets/images/bullet.png";
  context.drawImage(aka, characters.x - 5, characters.y - 5, 10, 10);
}

function removeCharacter() {
  if (lives == 0) {
    gameState = GAME_OVER;
  }
  lives -= 1;
}

function checkdanmusCollision() {
  for (var i = 0; i < danmus.length; i++) {
    if (checkdanmuCollision(danmus[i])) {
      return true;
    }
  }
  return false;
}

var collisionPoint = new Touhou.Geom.Point();
var reimuPoints = [];

function checkdanmuCollision(danmu) {
  reimuPoints[0] = characters.x;
  reimuPoints[1] = characters.y;
  reimuPoints[2] = characters.x + reimuSize;
  reimuPoints[3] = characters.y;
  reimuPoints[4] = characters.x + reimuSize;
  reimuPoints[5] = characters.y + reimuSize;
  reimuPoints[6] = characters.x;
  reimuPoints[7] = characters.y + reimuSize;
  for (var i = 0; i < 8; i += 2) {
    collisionPoint.x = reimuPoints[i];
    collisionPoint.y = reimuPoints[i + 1];
    if (danmu.Rect.containsPoint(collisionPoint.x, collisionPoint.y)) {
      return true;
    }
  }
  return false;
}

var characters;
//var enimies;
var reimuFontProperties = new Touhou.CanvasTextProperties(
  Touhou.CanvasTextProperties.BOLD,
  null,
  50
);

function createreimu() {
  if (!reimuCanvas) {
    reimuCanvas = document.createElement("canvas");
  }
  reimuCanvas.width = reimuSize;
  reimuCanvas.height = reimuSize;
  //enimies = {};
  characters = {};
  characters.x = canvas.width / 3;
  characters.y = groundGraphicRect.y / 2;
  //enimies.x = (canvas.width * 2) / 3;
  //enimies.y = groundGraphicRect.y / 2;
  characters.image = createCharacterImage();
  //enimies.image = createEnimyImage();
}

function createCharacterImage() {
  var reimuContext = reimuCanvas.getContext("2d");

  var image = new Image();
  image.width = reimuSize;
  image.height = reimuSize;
  image.src = "assets/images/player/player.png";
  return image;
}
function createEnimyImage() {
    var reimuContext = reimuCanvas.getContext("2d");
  
    var image = new Image();
    image.width = reimuSize;
    image.height = reimuSize;
    image.src = "assets/images/boss_02_81.png";
    return image;
  }


var danmus = [];
var danmunum = 0;
var danmusum = 0;
var danmuWidth = 20; //needs some logic
var mindanmuHeight = 50; //needs some logic
var gapframe = 0;
function updatedanmus() {
  for (var i = 0; i < danmus.length; i++) {
    danmus[i].Rect.x += danmus[i].Rect.cos / 2;
    danmus[i].Rect.y += danmus[i].Rect.sin / 2;
    if (
      danmus[i].Rect.x <= -danmuWidth ||
      danmus[i].Rect.x >= danmuWidth + canvas.width
    ) {
      danmus.splice(i, 1);
      danmunum--;
      score++;
      renderdanmu(danmus[i]);
    }
    if (
      danmus[i].Rect.y <= -danmuWidth ||
      danmus[i].Rect.y >= danmuWidth + canvas.height
    ) {
      danmus.splice(i, 1);
      danmunum--;
      score++;
      renderdanmu(danmus[i]);
    }
  }
  if (gapframe == 2) {
    createdanmus();
    gapframe = 0;
  }
  gapframe++;
}

function renderdanmus() {
  for (var i = 0; i < danmus.length; i++) {
    context.drawImage(danmus[i].canvas, danmus[i].Rect.x, danmus[i].Rect.y);
  }
}
function transTo(x, y, angle) {
  return [
    x * Math.cos(angle) + y * Math.sin(angle),
    y * Math.cos(angle) - x * Math.sin(angle),
  ];
}
raw = 0;
sp = 0;
i = 0;
function createdanmus() {
  danmus[danmunum] = {};
  danmus[danmunum].canvas = document.createElement("canvas");
  danmus[danmunum].Rect = new Touhou.Geom.Rectangle(
    (canvas.width * 2) / 3,
    groundGraphicRect.y / 2
  );
  angle = ((72 * i + raw * 2) * Math.PI) / 180;
  speed = transTo(2, 2, -angle - (45 * Math.PI) / 180);

  danmus[danmunum].Rect.cos = speed[0];
  danmus[danmunum].Rect.sin = speed[1];
  i++;
  if (i == 5) {
    i = 0;
  }
  raw += sp;
  if (raw >= 360) {
    raw -= 360;
  }
  sp += 0.05;
  if (sp >= 360) {
    sp -= 360;
  }

  renderdanmu(danmus[danmunum]);
  currentdanmu = danmus[0];
  danmunum++;
  danmusum++;
}

function renderdanmu(danmu) {
  danmu.canvas.width = danmuWidth;
  danmu.canvas.height = groundGraphicRect.y;
  danmu.Rect.width = danmuWidth;
  danmu.Rect.height = danmuWidth;
  var danmuContext = danmu.canvas.getContext("2d");
  var danmuimg = new Image();
  danmuimg.src = "assets/images/bullet.png";
  danmuimg.onload = function () {
    danmuContext.drawImage(danmuimg, 0, 0, danmuWidth, danmuWidth);
  };
}

var cityGraphicCanvas;

function createCityGraphic() {
  if (cityGraphicCanvas) {
    canvasContainer.removeChild(cityGraphicCanvas);
  }
  cityGraphicCanvas = document.createElement("canvas");
  cityGraphicCanvas.style.position = "absolute";
  cityGraphicCanvas.style.left = canvas.style.left;
  cityGraphicCanvas.style.top = canvas.style.top;
  cityGraphicCanvas.width = canvas.width;
  cityGraphicCanvas.height = canvas.height;
  var cgContext = cityGraphicCanvas.getContext("2d");
  var backgroundImage = new Image();
  backgroundImage.src = "assets/images/loading/th08_loading_bg.png";
  backgroundImage.onload = function () {
    cgContext.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  };
  canvasContainer.insertBefore(cityGraphicCanvas, canvasContainer.firstChild);
}

var groundLightGreen = "#443594";
var groundDarkGreen = "#4f4649";
var groundDarkerGreen = "#090927";
var groundShadow = "#382d14";
var groundBorder = "#4c3f48";
var sand = "#262406";
var groundGraphicRect = new Touhou.Geom.Rectangle();
var groundPatternCanvas;

function createGroundPattern() {
  groundGraphicRect.y = canvas.height * 0.85;
  if (!groundPatternCanvas) {
    groundPatternCanvas = document.createElement("canvas");
  }
  groundPatternCanvas.width = 16;
  groundPatternCanvas.height = 16;
}

function clearTimeoutsAndIntervals() {
  gameState = -1;
}
