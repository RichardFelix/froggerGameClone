"use strict";

///////////////////////////////////////////
//        Enemy  Class                  //
//////////////////////////////////////////
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.spriteArray = [
      'images/enemy-bug.png',
      'images/enemy-bug-blue.png',
      'images/bug-green.png'
    ];

    this.x = -150;
    this.y = this.getRow();
    this.speed = this.getSpeed();
};

// return a random speed for the enemy
Enemy.prototype.getSpeed = function() {
  var maxSpeed = Math.floor((Math.random() * 500) + 180),
      speed = Math.floor((Math.random() * maxSpeed) + 180);
  return speed;
};

// return a random row for the enemy
Enemy.prototype.getRow = function() {

  var row = Math.floor((Math.random() * 4) + 1);

  switch(row){
    case 1:
      return 70;
    case 2:
      return 150;
    case 3:
      return 230;
    case 4:
      return 310;
    default:
      console.log("error in Enemy.getRow()");
      break;
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);

    // if enemy goes off screen return him onto screen on the
    // opposite side with a new row and speed and randomly
    // change the bug sprite
    if( this.x > 600 ) {
      this.x = -100;
      this.y = this.getRow();
      this.speed = this.getSpeed();
      var random = Math.floor((Math.random() * 3) + 0);
      this.sprite = this.spriteArray[random];
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

///////////////////////////////////////////
//        Scored  Class                  //
//////////////////////////////////////////
// Class for storing the sprites that have made it to the
// other side so they can be rendered
var Scored = function(sprite, x) {

  this.sprite = sprite;
  this.x = x;
  this.y = -10;
};

Scored.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// scored sprite array
var scoredArray = [];

///////////////////////////////////////////
//        Heart   Class                  //
//////////////////////////////////////////
var Hearts = function() {

  // heart image src
  this.sprite = 'images/Heart.png';

  this.x = [
    0,
    50,
    100,
    150,
    200
  ];
  this.y = -17;

  // starting count of the amount of hearts
  this.count = 5;
};

Hearts.prototype.render = function() {

    for( var x = 0; x < this.count; x++ ) {
      ctx.drawImage(Resources.get(this.sprite), this.x[x], this.y);
    }
};

var heart = new Hearts();

///////////////////////////////////////////
//        Player Class                  //
//////////////////////////////////////////
var Player = function() {

  // array of player images
  this.playerArr = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/win.jpg',
        'images/lose.jpg'
  ];

  // array of open spots if its false then it is open
  this.openSpots = [
    false,
    false,
    false,
    false,
    false
  ];

  // count of players that made it a open spot
  this.playerCount = 0;
  this.sprite = this.getPlayer();
  this.x = 204;
  this.y = 390;
};

// return a incremented player sprite only called when
// a player makes it to a open spot
Player.prototype.getPlayer = function() {
    return this.playerArr[this.playerCount++];
};

// figure out whether a spot is taken or not and if it isn't
// fill it and make sure its locked out to any other sprite
Player.prototype.getOpenSpots = function(x) {

  var xPixels = 4;

  for(var z = 0; z < 5; z++ ){
    if( x === xPixels && this.openSpots[z] === false ){
      this.openSpots[z] = true;
      return true;
    }
    xPixels += 100;
  }
}

// only check this is a sprite is trying to get into a spot
// if player scores create a new scored class and store info of
// its location and push into scoredArray then change the sprite
// and put it in the starting point and add one to level if
// win screen is shown.
Player.prototype.update = function(dt) {

  if( this.y === -10 ) {

    if( this.getOpenSpots(player.x) === true ) {

      var scored = new Scored( this.sprite, this.x );
      scoredArray.push(scored);
      this.sprite = this.getPlayer();
      this.startPoint();

      if(this.sprite === 'images/win.jpg') {
        level++;
      }

    }else{
      this.y += 80;
    }
  }
};

// return the player back to starting point
// only called if a there is a collision
// also shows win and lose screen if playerCount
// is equal to 6
Player.prototype.startPoint = function() {

  if( this.playerCount === 6 ){
    this.x = 0;
    this.y = 0;
  }else{
    this.x = 204;
    this.y = 390;
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {

  // if player has not got all the spots filled and won the game
  if( player.playerCount <= 5 ){

    // moving player based on keybaord code and not letting
    // player move outside of boundries
    switch(keyCode){
      case 'left':
        if(this.x !== 4){
          this.x -= 100;
        }
        break;
      case 'right':
        if(this.x !== 404){
          this.x += 100;
        }
        break;
      case 'up':
        if(this.y !== -10){
          this.y -= 80;
        }
        break;
      case 'down':
        if(this.y !== 390){
          this.y += 80;
        }
        break;
      default:
        console.log("KeyCode not handled in Player.handleInput()");
        break;
    }
  }
};

///////////////////////////////////////////
//        instantiations                 //
//////////////////////////////////////////
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [],
    player = new Player();

// add enemies to the allEnemies array for rendering
for( var x = 0; x < 3; x++ ) {
  allEnemies.push(new Enemy());
}

///////////////////////////////////////////
//        Keboard listenting             //
//////////////////////////////////////////
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

///////////////////////////////////////////
//        Levels    CLass               //
//////////////////////////////////////////
var level = 1;

var Font = function() {

  this.render = function() {
    ctx.font = "bold 36px Impact";
    var text = "LEVEL: " + level;
    ctx.fillStyle = "black";
    ctx.fillText(text, 370, 40);
  };
};

var font = new Font();
