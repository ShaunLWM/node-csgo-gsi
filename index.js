const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const CSGOGSI = require("./index"); // const CSGOGSI = require("node-csgo-gsi");
const player = require("play-sound")();
const gtts = require("gtts");
const temp = require("temp");
const AWS = require('aws-sdk');
const Speaker = require('speaker');
const MemoryStream = require('memory-stream');
const Lame = require('lame').Lame;


const configuration = new Configuration({
    apiKey: "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",
  });  
  const openai = new OpenAIApi(configuration);  

let gsi = new CSGOGSI({
    port: 3000,
    authToken: ["Q79v5tcxVQ8u", "Team2Token", "Team2SubToken"] // this must match the cfg auth token
});

let previousRoundKills = 0;

gsi.on("all", function (data) {
    fs.appendFileSync("./payload.txt", JSON.stringify(data, null, 2));
    if (data.player && data.player.state) {
        const currentPlayerState = data.player.state;
        const currentRoundKills = currentPlayerState.round_kills;
    
        if (currentRoundKills > previousRoundKills && data.player.steamid === "76561197989058584") {
            const prompt = 'Ты - комментатор матчей по CS:GO, который наблюдает самый впечатляющий килл от игрока в своей жизни. Используя не более 12 слов, прокомментируй это убийство используя одно из следующих имен: саша / санёчек / сашок / сашка / просто-напросто-саня / санёк / александр олегович / лысый монстр. Пришли только один комментарий.';
    
            getChatGPTComment(prompt).then((comment) => {
                console.log(comment);
                synthesizeAndPlayText(comment); // Add this line
            });
    
            previousRoundKills = currentRoundKills;
        } else if (currentRoundKills < previousRoundKills) {
            previousRoundKills = 0;
        }  
    }  
});


// Configure AWS SDK
AWS.config.update({
  region: 'us-west-2', // Set your desired region
  accessKeyId: '123', // Replace with your AWS access key ID
  secretAccessKey: '345' // Replace with your AWS secret access key
});

const polly = new AWS.Polly();

function synthesizeAndPlayText(text, lang = "ru") {
  const params = {
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: 'Maxim', // Maxim is a Russian male voice, you can use Tatyana for a female voice
    TextType: 'text',
    LanguageCode: lang
  };

  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.error('Error generating TTS audio:', err);
      return;
    }

    const audioStream = new MemoryStream();
    audioStream.end(data.AudioStream);

    const decoder = new Lame({
      output: 'buffer',
      bitwidth: 16,
      channels: 1,
      mode: Lame.MONO,
      float: false,
      signed: true,
    }).setBuffer(data.AudioStream);

    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: 16000, // Set the sample rate according to the voice you use
      signed: true,
    });

    audioStream.pipe(decoder).pipe(speaker);
  });
}
