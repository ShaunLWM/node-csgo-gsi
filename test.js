const player = require('play-sound')(opts = {})

console.log('About to play the audio file.');

player.play('68284.mp3', { player: 'mpg123' }, function(err){
    if (err) {
        console.error("Error playing audio:", err);
        return;
    }
    console.log('Audio playback finished.');
})