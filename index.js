module.exports = CSGOGSI;

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

require('util').inherits(CSGOGSI, require('events').EventEmitter);

var app = express();
var server = http.createServer(app);

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

function CSGOGSI() {
    var self = this;
    require('events').EventEmitter.call(this);
    server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
        var addr = server.address();
        console.log("CSGO GSI server listening on", addr.address + ":" + addr.port);
    });

    app.post('/', function (req, res) {
        if (typeof req.body !== 'undefined') {
            self.emit('all', req.body);
            self.process(req.body);
        }
    });

    this._isBombPlanted = false;
    this._c4Interval;
}

CSGOGSI.prototype.process = function(data) {
    var self = this;
    if (typeof data.map !== 'undefined') {
        this.emit('gameMap', data.map.name);
        this.emit('gamePhase', data.map.phase); //warmup etc
        this.emit('gameRounds', data.map.round);
        this.emit('gameCTscore', data.map.team_ct_score);
        this.emit('gameTscore', data.map.team_t_score);
    }

    if (typeof data.round !== 'undefined') {

        var maxTime = 0;
        this.emit('roundPhase', data.round.phase);
        switch(data.round.phase) {
            case 'live':
            maxTime = 115;
            break;
            case 'freezetime':
            maxTime = 15;
            break;
            case 'over':
            if (this._isBombPlanted) {
                this._isBombPlanted = false;
                clearInterval(this._c4Interval);
            }
            this.emit('roundWinTeam', data.round.win_team);
            break;
        }

        if (typeof data.round.bomb !== 'undefined') {
            // exploded, planted, defused
            this.emit('bombState', data.round.bomb);
            switch(data.round.bomb) {
                case 'planted':
                if (!this._isBombPlanted) {
                    this._isBombPlanted = true;
                    var timeleft = 40 - (new Date().getTime() / 1000 - data.provider.timestamp);
                    this.emit('bombTimeStart', timeleft);
                    this.c4Countdown(timeleft);
                }
                break;

                case 'defused':
                case 'exploded':
                this._isBombPlanted = false;
                clearInterval(this._c4Interval);
                break;
            }
        }
    }
};

CSGOGSI.prototype.c4Countdown = function(time) {
    var self = this;
    this._c4Interval = setInterval(function() {
        time = time - 1;
        if (time <= 0) {
            clearInterval(self._c4Interval);
            //counter ended, do something here
            self._isBombPlanted = false;
            return;
        }
        self.emit('bombTimeLeft', time);
    }, 1000);
};
