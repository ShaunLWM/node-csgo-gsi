# node-csgo-gsi

[![npm](https://img.shields.io/npm/dt/node-csgo-gsi.svg)]()
[![npm](https://img.shields.io/npm/v/node-csgo-gsi.svg)]()

Counter-Strike: Global Offensive [Game State Integration](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) for node.js.

## Usage

Install `gamestate_integration_node.cfg` into your CS:GO cfg directory.

Example: `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg\gamestate_integration_node.cfg`

This file will automatically be executed on client start. Look into the console to check if it has executed successfully.

## Installation
`npm install node-csgo-gsi --save`

or

```yarn add node-csgo-gsi```

``` js
const CSGOGSI = require("node-csgo-gsi");
let gsi = new CSGOGSI({options});
gsi.on("event", function("optional data") {

});
```


## Example

A sample script is in the `example` folder.


## Options
- ```port``` - Set the server port (default: 3000)
- ``` authToken``` - authToken to accept from client. Make sure all clients have the same authToken (default: "" - no authentication needed)

# Events

#### all
- Returns the full posted data (use this if you do not want to use the given events provided below)

## Game

#### gameMap (returns String)
- Returns current map.

#### gamePhase (returns String)
- Returns current game state.
    - `live`
    - `warmup`

#### gameRounds (returns Integer)
-  Returns the current round number.
    - eg: 10

#### gameCTscore (returns Object)
- Returns the current Counter Terrorist team's score.
```
      "score": int,
      "consecutive_round_losses": int,
      "timeouts_remaining": int,
      "matches_won_this_series": int
```

#### gameTscore (returns Object)
- Returns the current Terrorist team's score.
```
      "score": int,
      "consecutive_round_losses": int,
      "timeouts_remaining": int,
      "matches_won_this_series": int
```

## Round
#### roundPhase (returns String)
- Returns the current round state.
    - `live`
    - `freezetime`
    - `over`

#### roundWinTeam (returns String)
- Returns the latest round's winner.
    - `CT`
    - `T`

## C4

#### bombState (returns String)
- Returns C4 state.
    - `planted`
    - `exploded`
    - `defused`

#### bombTimeStart (returns Float)
- Returns when C4 is planted.

#### bombTimeLeft (returns Float)
- Returns planted C4 time left.

---

## To-do
- Multi-player authentication code

## Credits
- [Double0negative/CSGO-HUD](https://github.com/Double0negative/CSGO-HUD)

---

# License

The MIT License (MIT)

Copyright (c) 2019 Shaun