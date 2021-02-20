# node-csgo-gsi

[![npm](https://img.shields.io/npm/dt/node-csgo-gsi.svg)](https://github.com/ShaunLWM/node-csgo-gsi/releases)
[![npm](https://img.shields.io/npm/v/node-csgo-gsi.svg)](https://www.npmjs.com/package/node-csgo-gsi)

Counter-Strike: Global Offensive [Game State Integration](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) for node.js.

## Usage

Install `gamestate_integration_node.cfg` into your CS:GO cfg directory.

Example: `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg\gamestate_integration_node.cfg`

This file will automatically be executed on client start. Look into the console to check if it has executed successfully. As per the [documentation](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration#Locating_CS:GO_Install_Directory), the file name should start with `gamestate_integration_` and ends with `.cfg`.

```
gamestate_integration_yourservicenamehere.cfg
```

The console should have an output like this the moment you open CS:GO

```
Loading Game State Integration: gamestate_integration_node.cfg
```

## Installation
`npm install node-csgo-gsi --save`

or

```yarn add node-csgo-gsi```

``` js
const CSGOGSI = require("node-csgo-gsi");
let gsi = new CSGOGSI({ options });
gsi.on("EVENT_NAME", function("optional data") {
    // EVENT_NAME is the individual event name below. Look into the example/index.js for more information
});
```


## Example

A sample script is in the `example` folder.


## Options
- ```port``` - Set the server port (default: 3000)
- ``` authToken``` - An array of authentication token to accept from client. You can have multiple tokens (default: [] - no authentication needed)
    - Example: Team 1 can have "token1". Team 2 can have "token2". Team1's sub team can have "token1sub" etc.

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

#### roundWins (returns Object)
- Returns a key-value object of round number and reason
Example
```
{
      "1": "ct_win_elimination",
      "2": "ct_win_time",
      "3": "ct_win_elimination",
      "4": "ct_win_time",
      "5": "t_win_bomb"
}
```

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

## WARNING ⚠️
C4 timer (`bombTimeLeft` event)  is not accurate. CS:GO does not return a real time update when the bomb is planted. It's just an estimation on the library's side. Thus, do just look for the `bombState` event instead of relying on the timer.

## Todo
- None for now. Open an issue!

## Credits
- [Double0negative/CSGO-HUD](https://github.com/Double0negative/CSGO-HUD)


# License

The MIT License (MIT)

Copyright (c) 2021 Shaun