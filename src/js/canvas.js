import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
function Star(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = {
    x: utils.randomIntFromRange(-5, 5),
    y: 5
  };
  this.friction = 0.5;
  this.gravity = 1;
}

Star.prototype.draw = function() {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = this.color;
  c.shadowColor = "#E3EAEF";
  c.shadowBlur = 20;
  c.fill();
  c.closePath();
  c.restore();
};

Star.prototype.update = function() {
  this.draw();

  // When star hits bottom of canvas
  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
    this.shatter();
  } else {
    this.velocity.y += this.gravity;
  }

  // When star hits side of canvas
  if (this.x + this.radius + this.velocity.x > canvas.height ||
      this.x - this.radius <= 0) {
    this.velocity.x = -this.velocity.x * this.friction;
    this.shatter();
  } else {
    this.velocity.y += this.gravity;
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

Star.prototype.shatter = function() {
  this.radius -= 3;
  for (let i = 0; i < 10; i++) {
    miniStars.push(new MiniStar(this.x, this.y, 2));
  }
};

function MiniStar(x, y, radius, color) {
  Star.call(this, x, y, radius, color);
  this.velocity = {
    x: utils.randomIntFromRange(-5, 5),
    y: utils.randomIntFromRange(-15, 15)
  };
  this.friction = 0.5;
  this.gravity = 0.1;
  this.lifetime = 100;
  this.opacity = 1;
}

MiniStar.prototype.draw = function() {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`;
  c.shadowColor = "#E3EAEF";
  c.shadowBlur = 20;
  c.fill();
  c.closePath();
  c.restore();
};

MiniStar.prototype.update = function() {
  this.draw();

  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
  } else {
    this.velocity.y += this.gravity;
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.lifetime -= 1;
  this.opacity = this.lifetime / 100;
};

function createMountainRange(mountains, height, color) {
  for (let i = 0; i < mountains; i++) {
    const mountainWidth = canvas.width / mountains;
    c.beginPath();
    c.moveTo(i * mountainWidth, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    c.lineTo(i * mountainWidth - 325, canvas.height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#171e26");
backgroundGradient.addColorStop(1, "#3f586b");

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
let groundHeight = 100;

function init() {
  stars = [];
  miniStars = [];
  backgroundStars = [];

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;

    backgroundStars.push(new Star(x, y, radius, "white"));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);

  backgroundStars.forEach(backgroundStar => {
    backgroundStar.draw();
  });

  createMountainRange(1, canvas.height - 100, "white");
  createMountainRange(2, canvas.height - 200, "grey");
  createMountainRange(3, canvas.height - 500, "black");
  c.fillStyle = '#182028'
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

  stars.forEach((star, i) => {
    star.update();
    if (star.radius == 0) {
      stars.splice(i, 1);
    }
  });

  miniStars.forEach((miniStar, i) => {
    miniStar.update();
    if (miniStar.lifetime == 0) {
      miniStars.splice(i, 1);
    }
  });

  ticker++;

  if (ticker % 75 == 0) {
    const radius = 12
    const x = Math.max(radius, Math.random() * canvas.width - radius);
    stars.push(new Star(x, -100, radius, "white"));
    randomSpawnRate = utils.randomIntFromRange(75, 200);
  }
}

init();
animate();
