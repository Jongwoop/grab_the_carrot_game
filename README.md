## Project name

Grab the carrot game [LIVE](https://jongwoop.github.io/grab_the_carrot_game/)

## Description

Simple game which could set the count of carrots, bugs, and timer.  
User can win the game if they catch all the carrots in time, but lose if clicks the bugs.

<img src="https://github.com/Jongwoop/grab_the_carrot_game/blob/master/img/screenshot.gif" alt="screenshot" width="600px" />

## Stack

HTML, CSS, JavaScript

## Main Function

1. If a user clicks the play button, it creates the carrots and bugs infield, starts a timer, and background music begins to play.
2. When a user clicks carrot, the game reduces carrot count number and clicked carrot would be disappeared.
3. If the user clicks the bug or the user can't catch all the carrots in time, the game would be finished and a popup window appears with the message "you lose".
4. If a user could catch all carrots in time, the game would be finished with the popup message "you won".
5. If a user clicks the stop button, the game stops and the user could replay the game.

## Architecture

```
Grab the carrot game
├── public            #static files
│   ├── index.html
│   └── style.css
│
└── src/              #project root
    └── main.js
    ├── game.js
    ├── field.js
    ├── popup.js
    └── sound.js
```
