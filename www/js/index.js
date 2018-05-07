/*
  Copyright 2018 David Healey

  This file is part of Simple Snake.

  Simple Snake is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Simple Snake is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Simple Snake.  If not, see <http://www.gnu.org/licenses/>.
*/

var app = {

  storage:{}, //Local storage

  // Application Constructor
  initialize: function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
      this.storage = window.localStorage; //Simple storage object
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    resetGame();
    window.requestAnimationFrame(loop)
  },
};

app.initialize();
$.mobile.defaultPageTransition   = 'none'
$.mobile.defaultDialogTransition = 'none'
$.mobile.buttonMarkup.hoverDelay = 0

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var CANVAS_WIDTH = 20 //The number of tiles for canvas width
var CANVAS_HEIGHT = 20 //The number of tiles for canvas height
var TILE_SIZE = 10;
var lastRender = 0;
var score = 0;
var now;
var foods = [];
var score;
var directions = {"up":0, "dn":1, "l":2, "r":3};
var lastButton;

$("#button0").on("tap", function(){
  lastButton = 0;
});

$("#button1").on("tap", function(){
  lastButton = 1;
});

function loop()
{
  window.requestAnimationFrame(loop) //Request next animation frame

  var now = Date.now();
  var progress = now - lastRender;
  var fps = 1000/(5+(score/10)); //FPS gets higher as score increases

  update();

  //Fps limiter
  if (progress > fps)
  {
      lastRender = now - (progress % fps);
      draw();
  }
}

function resetGame()
{
  //Save high score
  var bestScore = app.storage.getItem("bestScore");
  if (bestScore == null) bestScore = 0;

  if (score > bestScore)
  {
    bestScore = score;
    app.storage.setItem("bestScore", score);
  }

  snake.reset(CANVAS_WIDTH, CANVAS_HEIGHT);
  foods[0] = new food(CANVAS_WIDTH, CANVAS_HEIGHT, false); //Add new food
  foods[1] = undefined; //Reset bonus
  score = 0;
  $("#score h3").text("Score: " + 0);
  $("#bestScore h3").text("Best Score: " + bestScore);
}

function update()
{
  var head = snake.getHead();

  checkInput();
  testBoundary();

  if (snake.testCannibalism() == true)
  {
    resetGame();
  }
  else
  {
    //Check for a collision with a food or bonus
    for (var i = 0; i < foods.length; i++)
    {
      if (foods[i] != undefined)
      {
        if (foods[i].testCollision(head.x, head.y) == true)
        {
          if (foods[i].bonus == false) //Regular food
          {
            score++;
            foods[i] = new food(CANVAS_WIDTH, CANVAS_HEIGHT, false); //Add new food

            if (score % 5 == 0) //Consumed 5 foods
            {
              foods[i+1] = new food(CANVAS_WIDTH, CANVAS_HEIGHT, true); //Add a bonus food
            }
          }
          else //Bonus
          {
            foods[i] = undefined; //Remove the bonus food
            score += 5;
          }
          snake.grow();
          $("#score h3").text("Score: " + score);
        }
      }
    }
  }
}

function draw() {

  snake.ripple();
  moveSnake();

  //Repaint board
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVAS_WIDTH*TILE_SIZE, CANVAS_HEIGHT*TILE_SIZE);

  //Draw snake
  ctx.fillStyle = "green";

  for (var i = 0; i < snake.getLength(); i++)
	{
		var segment = snake.getElementAt(i);
    ctx.fillRect(segment.x*TILE_SIZE, segment.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
	}

	//Draw foods
  for (var i = 0; i < foods.length; i++)
  {
    if (foods[i] != undefined)
    {
      foods[i].bonus == true ? ctx.fillStyle = "orange" : ctx.fillStyle = "red";
      ctx.fillRect(foods[i].getX()*TILE_SIZE, foods[i].getY()*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function moveSnake()
{
  switch (snake.getDirection())
  {
    case directions.up: snake.moveHead(0, -1); break;
    case directions.dn: snake.moveHead(0, 1); break;
    case directions.l: snake.moveHead(-1, 0); break;
    case directions.r: snake.moveHead(1, 0); break;
  }
}

function testBoundary()
{
	var head = snake.getHead();

	if (head.x < 0)
  {
    snake.setHeadX((CANVAS_WIDTH*TILE_SIZE)/TILE_SIZE-1);
    return true;
  }
  else if(head.x+1 > (CANVAS_WIDTH*TILE_SIZE)/TILE_SIZE)
  {
    snake.setHeadX(0);
    return true;
  }
  else if (head.y < 0)
  {
      snake.setHeadY((CANVAS_HEIGHT*TILE_SIZE)/TILE_SIZE-1);
      return true;
  }
  else if (head.y+1 > (CANVAS_HEIGHT*TILE_SIZE)/TILE_SIZE)
	{
    snake.setHeadY(0);
    return true;
	}

  return false;
}

function checkInput()
{
  if (lastButton == 0)
  {
    if (snake.getDirection() == directions.up || snake.getDirection() == directions.dn)
    {
      snake.setDirection(directions.l);
    }
    else
    {
      snake.setDirection(directions.dn);
    }
    lastButton = null;
  }
  else if (lastButton == 1)
  {
    if (snake.getDirection() == directions.up || snake.getDirection() == directions.dn)
    {
      snake.setDirection(directions.r);
    }
    else
    {
      snake.setDirection(directions.up);
    }
    lastButton = null;
  }
}
