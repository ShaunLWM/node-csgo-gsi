const CSGOGSI = require("../index"); // const CSGOGSI = require("node-csgo-gsi");
let gsi = new CSGOGSI({
    port: 3000,
    authToken: "Q79v5tcxVQ8u" // this must match the cfg auth token
});

gsi.on("bombTimeStart", function () {
    console.log("C4 planted");
});

gsi.on("bombTimeLeft", function (time) {
    console.log("C4:" + time);
});

gsi.on("roundPhase", function (data) {
    if (data === "over") {
        console.log("round over");
    }
});
