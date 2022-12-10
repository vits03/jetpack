
///declarations of the images and spritesheets used.
const platform_img = new Image();
platform_img.src = "./assets/platform.png";

const background_img = new Image();
background_img.src = "./assets/mod.png";

const layer1 = new Image();
layer1.src = "./assets/layer1.png";

const layer2 = new Image();
layer2.src = "./assets/layer2.png";

const bullet_img = new Image();
bullet_img.src = "./assets/bullet1.png";

const layer3 = new Image();
layer3.src = "./assets/layer3.png";

const running_sprite = new Image();
running_sprite.src = "./assets/spritesheets/running.png";

const running_with_gun_sprite = new Image();
running_with_gun_sprite.src = "./assets/spritesheets/running_with_gun.png";

const flying_with_gun = new Image();
flying_with_gun.src = "./assets/spritesheets/flying_with_gun.png";

const standing_with_gun = new Image();
standing_with_gun.src = "./assets/spritesheets/standing.png";

const dying_with_gun = new Image();
dying_with_gun.src = "./assets/spritesheets/dying.png";

const rocket_img = new Image();
rocket_img.src = "./assets/rocket1.png";

const wood = new Image();
wood.src = "./assets/wood.png";

const demon_first_frame = new Image();
demon_first_frame.src = "./assets/demon11.png";

const health_potion_img = new Image();
health_potion_img.src = "./assets/potion.png";

const heart_img = new Image();
heart_img.src = "./assets/heart.png";

const game_start_background = new Image();
game_start_background.src = "./assets/game-start-background.png";


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.35;






//PLAYER CLASS DECLARATION
class Player {
  constructor(image) {
    this.position = {
      x: 200,
      y: 110,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.lives = 3;
    this.is_dead = false;
    this.running = new sprite(
      running_with_gun_sprite,
      3,
      5,
      147,
      205,
      45,
      1,
      3
    );
    this.flying = new sprite(flying_with_gun, 3, 5, 147, 205, 45, 1, 3);
    this.standing = new sprite(standing_with_gun, 3, 5, 147, 205, 45, 1, 3);
    this.dying = new sprite(dying_with_gun, 1, 5, 117, 185, 45, 1, 9);
    this.score = 0;
    this.width = 205;
    this.height = 135;
    this.collide = true;
    this.frames_gone = 0;
    this.game_over = false;
    this.game_start = false;

    //RESTARTS THE GAME
    window.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (event.key == "Enter" && this.game_over) {
        //update_score()
        location.reload();
      }
    });
  }

  //MOVE THE PLAYER ON CANVAS
  draw() {
    if (this.is_dead) {
      this.frames_gone += 1;
      console.log(this.frames_gone, this.frames_gone % 90 == 0);
      if (this.frames_gone % 9 == 0) {
        player.lives -= 1;
      }
      this.is_dead = false;
    }
    if (spacebar_pressed) {
      this.flying.draw(this.position.x, this.position.y);
    } else if (this.velocity.y > 0) {
      this.standing.draw(this.position.x, this.position.y);
    } else {
      this.running.draw(this.position.x, this.position.y);
    }
  }

  //GRAVITY AND RUNNING PHYSICS
  update() {
    this.draw();
    fire_bullet();
    this.position.y += this.velocity.y;
    if (this.position.y < 25) {
      this.velocity.y = 0;
    }
    if (
      this.position.y +
        this.height +
        this.velocity.y +
        platform_img.height / 5 <=
      canvas.height
    ) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    console.log(this.position.x, this.position.y, image);
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class standard_obj {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.dead = false;
    console.table(this.width, this.height, image);
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class sprite {
  constructor(
    image,
    numRows,
    numColumns,
    frameHeight,
    frameWidth,
    x,
    y,
    frame
  ) {
    this.image = image;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    this.currentFrame = 0;
    this.x = x;
    this.initial_x = x;
    this.y = y;
    this.initial_y = y;
    this.frame = frame;
    this.initial_frame = frame;
  }
//DRAWS EACH SPRITE FRAME AT REGULAR TIME INTERVALS
  draw(x_val, y_val) {
    if (this.x > (this.numColumns - 1) * this.frameWidth + this.initial_x) {
      this.x = this.initial_x;
      this.y += this.frameHeight;
    }
    console.log("x is", this.x);

    if (this.y > (this.numRows - 1) * this.frameHeight + this.initial_y) {
      this.y = this.initial_y;
    }
    c.drawImage(this.image, this.x, this.y, 115, 140, x_val, y_val, 115, 140);
   
    if (this.frame % this.initial_frame == 0) {
      this.x += this.frameWidth;
      c.drawImage(this.image, this.x, this.y, 115, 140, x_val, y_val, 115, 140);
    }

    this.frame += 1;
  }
}

//CREATES SOUND OBJECTS
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function move_obstacles() {
  wood_obstacle.forEach((wood) => {
    if (wood.position.x < -75) {
      wood.position.x = 1200;
      wood.position.y = getRndInteger(0, 300);
    }
  });
}

//CHECKS IF PLAYER TOUCHES WOOD OBSTACLES
function detect_obstacles() {
  for (let counts = 0; counts < 3; counts++) {
    let woods = {};
    woods = wood_obstacle[counts];

    if (
      Math.abs(woods.position.x - player.position.x) < 25 &&
      ((woods.position.y < player.position.y + player.height &&
        woods.position.y > player.position.y) ||
        (woods.position.y + woods.height > player.position.y &&
          woods.position.y + woods.height < player.height + player.position.y))
    ) {
      return true;
    }
  }
  return false;
}


//CHECKS FOR OVERLAPING BETWEEN PLAYER AND ROCKET
function detect_rocket() {
  let woods = rocket;

  if (
    Math.abs(woods.position.x - player.position.x) < 35 &&
    ((player.position.y < woods.position.y + woods.height - 50 &&
      player.position.y > woods.position.y) ||
      (player.position.y + player.height > woods.position.y &&
        player.position.y + player.height < woods.height + woods.position.y))
  ) {
    player.is_dead = true;
    collision_sound.play();
    if (player.is_dead) {
      player.frames_gone += 1;
      if (player.frames_gone % 9 == 0) {
        player.lives -= 1;
      }
      player.is_dead = false;
    }
  }

  return false;
}

var first_switch = false;
var next = 1;
var current = 0;
let score = 0;

let collision = false;
let spacebar_pressed = false;

//ARRAY OF WOOD IMAGE OBJECTS
const wood_obstacle = [
  new standard_obj({ x: 700, y: getRndInteger(400, 0), image: wood }),
  new standard_obj({ x: 1000, y: getRndInteger(300, 0), image: wood }),
  new standard_obj({ x: 1600, y: getRndInteger(300, 0), image: wood }),
];
const first_layer = [
  new standard_obj({ x: 0, y: 0, image: layer2 }),
  new standard_obj({ x: 1000, y: 0, image: layer2 }),
  new standard_obj({ x: 2000, y: 0, image: layer2 }),
];
const second_layer = [
  new standard_obj({ x: 0, y: 0, image: layer3 }),
  new standard_obj({ x: 700, y: 0, image: layer3 }),
  new standard_obj({ x: 1100, y: 0, image: layer3 }),
];
const player = new Player(running_sprite);
const platforms = [
  new Platform({ x: 0, y: 513, image: platform_img }),
  new Platform({ x: platform_img.width, y: 513, image: platform_img }),
  new Platform({ x: platform_img.width * 2, y: 513, image: platform_img }),
  new Platform({ x: platform_img.width * 3, y: 513, image: platform_img }),
  new Platform({ x: platform_img.width * 4, y: 513, image: platform_img }),
];
const background_layers = [
  new standard_obj({ x: 0, y: 0, image: background_img }),
  new standard_obj({ x: 0, y: 0, image: layer1 }),
];
const bullet = new standard_obj({
  x: player.position.x + player.width,
  y: player.position.y + player.width / 2,
  image: bullet_img,
});
const rocket = new standard_obj({ x: canvas.width, y: 100, image: rocket_img });
const health_potion = new standard_obj({
  x: 567,
  y: 300,
  image: health_potion_img,
});
const monster = new standard_obj({
  x: canvas.width * 2,
  y: 275,
  image: demon_first_frame,
});
const hearts = [
  new standard_obj({ x: canvas.width * 0.8, y: 15, image: heart_img }),
  new standard_obj({ x: canvas.width * 0.8 + 64, y: 15, image: heart_img }),
  new standard_obj({ x: canvas.width * 0.8 + 128, y: 15, image: heart_img }),
];
const background_music = new sound("./assets/sound/background-music.mp3");
const jetpack_sound = new sound("./assets/sound/jetpack.mp3");
const collision_sound = new sound("./assets/sound/collision.mp3");
const bullet_sound = new sound("./assets/sound/bullet.wav");
const monster_collision_sound = new sound("./assets/sound/monstercollision.wav");
const rocket_approaching_sound = new sound("./assets/sound/rocket.mp3");
const monster_sound = new sound("./assets/sound/monster.mp3");

//MOVES THE PLATFORMS IN A LOOP 
function move_platform() {
  if (
    Math.abs(platforms[4].position.x.toFixed(0) - platform_img.width * 3) < 3
  ) {
    
    platforms[0].position.x = platform_img.width * 4;
    current = 0;
    next = 1;
    first_switch = true;
  }
  if (
    first_switch &&
    Math.abs(
      platforms[current].position.x.toFixed(0) - platform_img.width * 3
    ) < 3
  ) {
   
    platforms[next].position.x = platform_img.width * 4;

    current++;
    next++;
  }
  if (next == 5) {
    next = 4;
    current = 0;
    first_switch = false;
  }
}


//MAIN FUNCTION FOR ANIMATION

function animate() {
  c.globalAlpha = 1;
  if (player.game_over) {
    background_music.stop();
    game_over_screen();
    return;
  }
  requestAnimationFrame(animate);
  let a = detect_obstacles();
  if (a) {
    player.is_dead = true;
    
    collision_sound.play();
  }
  detect_rocket();
  detect_monster_collision();
  detect_bullet_impact();
  detect_health_potion();
  c.clearRect(0, 0, canvas.width, canvas.height);

  background_layers.forEach((background) => {
    background.draw();
  });
  first_layer.forEach((layer) => {
    layer.draw();
  });
  second_layer.forEach((layer) => {
    layer.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  platforms.forEach((platform) => {
    platform.position.x -= 4;
  });
  wood_obstacle.forEach((wood) => {
    wood.draw();
    wood.position.x -= 4;
  });
  create_health_potion();

  create_monster();
  update_score();
 monster_kill()

  move_rocket();
  move_background();
  move_platform();
  move_obstacles();
  move_bullet();
  move_monster();

  player.update();
  update_lives();
  
}

//MOVES PLAYER UP WHEN SPACEBAR KEY IS PRESSED
window.addEventListener("keydown", ({ keyCode }) => {
  spacebar_pressed = true;
  if (keyCode == 32) {
    jetpack_sound.play();
    if (player.velocity.y >= -10 && player.position.y > 25) {
      player.velocity.y -= 3;
    }
    if (player.velocity.y > 0 && player.position.y > 25) {
      player.velocity.y = -8;
    }
  }
});

window.addEventListener("keyup", ({ keyCode }) => { //keycode is used as key was not working

  spacebar_pressed = false;
  jetpack_sound.stop();
});

function move_bullet() {
  if (bullet.position.x < canvas.width) {
    bullet.position.x += 3;
  } else {
    bullet_sound.play();
    bullet.position.x = player.position.x + 100;
    bullet.position.y = player.position.y + player.height / 3;
  }
}

function monster_kill(){
  if (monster.is_dead) {
  monster.position.x = 1500;
  player.score += 300.0;
  monster.is_dead = false;
}
}

function update_score() {
  player.score += 0.1;
  
  console.log(player.score);
  c.font = "32px Arial";
  c.fillText((player.score ).toFixed(0), 50, 50);
}

function move_background() {
  first_layer.forEach((layer) => {
    layer.position.x -= 2;
    if (layer.position.x < -1024) {
      layer.position.x = 1100;
    }
  });
  second_layer.forEach((layer) => {
    layer.position.x -= 3;
    if (layer.position.x < -1000) {
      layer.position.x = 1100;
    }
  });
}

function fire_bullet() {
  bullet.draw();
}

function move_rocket() {
  if (rocket.position.x < -canvas.width * 2) {
    rocket.position.x = canvas.width * 1.5;
    rocket.position.y = 350;
    rocket_approaching_sound.play();
  }
  rocket.draw();
  rocket.position.x -= 10;
}

function create_img(image_name) {
  const image_obj = new Image();
  image_obj.src = `./${image_name}`;
  return image_obj;
}



let indexx = 0;
let monster_frame = 1;



function create_monster() {
  let monsters = {};
  monsters = create_img(`./assets/demon${monster_frame}${monster_frame}.png`);
  if (indexx % 6 == 0) {
    monster_frame++;
  }
  if (monster_frame > 6) {
    monster_frame = 1;
  }
  indexx++;
  c.drawImage(monsters, monster.position.x, monster.position.y);
}

function move_monster() {
  if (monster.position.x < -canvas.width) {
    monster.position.x = canvas.width * 1.5;
  }
  monster.position.x -= 4;
}

function detect_bullet_impact() {
  let distance = Math.abs(monster.position.x + 100 - bullet.position.x);
  if (distance < 5 && bullet.position.y > monster.position.y) {
    monster.is_dead = true;
    monster_collision_sound.play();
  }
}

function detect_monster_collision() {
  let distance = Math.abs(monster.position.x + 100 - player.position.x);

  if (distance < 30 && player.position.y + player.height > monster.position.y) {
    player.is_dead = true;

    collision_sound.play();

    if (player.is_dead) {
      player.frames_gone += 1;
      if (player.frames_gone % 11 == 0) {
        player.lives -= 1;
      }
      player.is_dead = false;
    }
  }
}

function detect_health_potion() {
  let distance = Math.abs(health_potion.position.x - player.position.x);

  if (
    distance < 10 &&
    player.position.y < health_potion.position.y &&
    player.position.y + player.height >
      health_potion.position.y + health_potion.height
  ) {
    if (player.lives < 3) {
      player.lives++;
    }
  }
}

function create_health_potion() {
  if (health_potion.position.x < -canvas.width * 2) {
    health_potion.position.x = canvas.width * 1;
  }
  health_potion.draw();
  health_potion.position.x -= 4;
}

function update_lives() {
  if (player.lives == 0) {
    player.game_over = true;
  }
  for (let i = 0; i < player.lives; i++) {
    hearts[i].draw();
  }
}

function get_highscore(){
  let keys=Object.keys(sessionStorage)
  let username=keys[0]
  
  let highscore=JSON.parse(localStorage.getItem(username)).highscore;
  return [highscore,username]
}

function update_leaderboard(){
   let player_details=get_highscore()
  //get user name from session stoarage and use it to extract user highscore
  highscore=player_details[0]
  username=player_details[1]
   
   console.log( player.score, highscore,parseInt(player.score) >  parseInt(highscore))
  //compare current score with highscore
  if (player.score > highscore){
        let localdetails=JSON.parse(localStorage.getItem(username))
        localdetails.highscore=player.score.toFixed(0)
        localStorage.removeItem(username)
        console.log(localdetails)
        localStorage.setItem(username,JSON.stringify(localdetails))
        output_leaderboard()
  }
  
}


function starting_screen() {
 
  c.drawImage(game_start_background, 0, 0);
 c.globalAlpha = 0.7;
 c.fillStyle = "black";
 c.fillRect(0, 0, canvas.width, canvas.height);
  c.font = "130px myFont";
  c.globalAlpha = 1;
  c.fillStyle = "#e7530f";
  c.textAlign = "center";
  c.fillText("Jetpack Rush", canvas.width / 2, canvas.height / 3);
  c.font = "65px myFont";
  c.fillText(
    "press enter to play",
    canvas.width / 2,
    (canvas.height / 2) * 1.3
  );
}


function game_over_screen() {
  c.globalAlpha = 0.7;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.globalAlpha = 0.85;
  c.font = "130px myFont";
  c.fillStyle = "#e7530f";
  c.textAlign = "center";
  c.fillText("Game over", canvas.width / 2, canvas.height / 3);
  c.font = "60px myFont";
  c.fillText(
    `Your score is ${(player.score).toFixed(0)}`,
    canvas.width / 2,
    canvas.height / 2
  );
  c.font = "30px myFont";
  c.fillText('Hit Enter to play again',canvas.width/2,canvas.height/3*2)
  
}

//PREVENT SPACEBAR WEBSITE SCROLLING WHEN PLAYING
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 ) {
   
    e.preventDefault();
  }
});

window.addEventListener("keydown", (event) => {
  let start_game = false;
 
  if (event.key == "Enter") {
    start_game = true;
    animate();
  }
});

//FONT OBJECT DECLARATION
const myFont = new FontFace("myFont", "url(./font/PoorStory-Regular.ttf)", {
  style: "normal",
  weight: "400",
});

myFont.load().then(function (font) {
  
  document.fonts.add(font);
  
});
window.onload = function () {

};



window.onload=()=>{
  starting_screen();
  background_music.play();
}



