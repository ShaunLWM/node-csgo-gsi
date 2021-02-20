const fs = require("fs");
const CSGOGSI = require("../index"); // const CSGOGSI = require("node-csgo-gsi");

let gsi = new CSGOGSI({
    port: 3000,
    authToken: ["Q79v5tcxVQ8u", "Team2Token", "Team2SubToken"] // this must match the cfg auth token
});

gsi.on("all", function (data) {
    fs.appendFileSync("./payload.txt", JSON.stringify(data, null, 2));
});

gsi.on("gameMap", (map) => console.log(`gameMap: ${map}`));
gsi.on("gamePhase", (phase) => console.log(`gamePhase: ${phase}`));
gsi.on("gameRounds", (rounds) => console.log(`gameRounds: ${rounds}`));
gsi.on("gameCTscore", (score) => console.log(`gameCTscore: ${score}`));
gsi.on("gameTscore", (score) => console.log(`gameTscore: ${score}`));
gsi.on("roundWins", (wins) => console.log(`roundWins: ${roundWins}`));
gsi.on("player", (player) => console.log(`player: ${player}`));
gsi.on("roundPhase", (phase) => console.log(`roundPhase: ${phase}`));
gsi.on("roundWinTeam", (team) => console.log(`roundWinTeam HUAT AH: ${team}`));
gsi.on("bombState", (state) => console.log(`bombState: ${state}`));
gsi.on("bombTimeStart", (time) => console.log(`bombTimeStart: ${time}`));
gsi.on("bombExploded", () => console.log(`bombExploded`));
gsi.on("bombTimeLeft", (time) => console.log(`bombTimeLeft: ${time}`));