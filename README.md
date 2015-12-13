# node-csgo-gsi
Counter-Strike: Global Offensive [Game State Integration](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) for node.js.

---

# Usage

Install `gamestate_integration_node.cfg` into your CS:GO cfg directory.

Example: `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg`

## Installation
`npm install node-csgo-gsi --save`

``` js
var CSGOGSI = require('node-csgo-gsi');
var gsi = new CSGOGSI();
gsi.on('event', function('optional data') {

});
```

---

# Example

A sample script is in the `example` folder.

---

# Events

#### all
- Returns the full posted data (use this if you do not want to use the given events provided below)

---

## Game

#### gameMap
- Returns current map.

#### gamePhase
- Returns current game state.
    - live
    - warmup

#### gameRounds
-  Returns the current round number.
    - eg: 10

#### gameCTscore
- Returns the current Counter Terrorist team's score.

#### gameTscore
- Returns the current Terrorist team's score.

## Round
#### roundPhase
- Returns the current round state.
    - live
    - freezetime
    - over

#### roundWinTeam
- Returns the latest round's winner.
    - CT
    - T

## C4

#### bombState
- Returns C4 state.
    - planted
    - exploded
    - defused

#### bombTimeStart
- Returns when C4 is planted.

#### bombTimeLeft
- Returns planted C4 time left.

---

# To-do
- Player's Integration
- auth token

---

# Credits
- [Double0negative/CSGO-HUD](https://github.com/Double0negative/CSGO-HUD)

---

# License

The MIT License (MIT)

Copyright (c) 2015 Shaun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
