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

class food
{
  constructor(width, height, bonus)
  {
    this.x = Math.floor((Math.random() * width));
    this.y = Math.floor((Math.random() * height));

    this.bonus = bonus;
  }

	changePosition(x, y)
	{
    this.x = x;
    this.y = y;
	}

	getX()
	{
		return this.x;
	}

	getY()
	{
		return this.y;
	}

  //Check for a collision with food
  testCollision(x, y)
  {
  	if (this.x == x && this.y == y)
  	{
  		return true;
  	}
  	return false;
  }
}

//Singleton, only one snake per game
var snake =
{
	x: [],
	y: [],
	direction:0,

	reset: function(width, height)
	{
		this.x = [width/2, -1, -1, -1, -1];
		this.y = [height/2, -1, -1, -1, -1];
		direction = 0;
	},

	grow: function()
	{
		this.x.push(0);
		this.y.push(0);
	},

	ripple: function()
	{
		for (var i = this.x.length-1; i > 0; i--)
		{
			this.x[i] = this.x[i-1];
			this.y[i] = this.y[i-1];
		}
	},

	getHead: function()
	{
		return {"x":this.x[0], "y":this.y[0]};
	},

	moveHead: function(x, y)
	{
		this.x[0] = this.x[0]+x;
		this.y[0] = this.y[0]+y;
	},

  setHeadX: function(x)
  {
    this.x[0] = x;
  },

  setHeadY: function(y)
  {
    this.y[0] = y;
  },

	getElementAt: function(i)
	{
		return {"x":this.x[i], "y":this.y[i]};
	},

	getLength: function()
	{
		return this.x.length;
	},

	getDirection: function()
	{
		return this.direction;
	},

	setDirection: function(d)
	{
		this.direction = d;
	},

  //Check if the snake has eaten itself
  testCannibalism()
  {
  	var head = this.getHead();
  	var segment;

  	for (var i = 1; i < this.getLength(); i++) //Start at 1 to skip head
  	{
  		segment = this.getElementAt(i);
  		if (head.x == segment.x && head.y == segment.y)
  		{
  			return true;
  		}
  	}
  	return false;
  }
}
