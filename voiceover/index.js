const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const CSGOGSI = require("../index"); // const CSGOGSI = require("node-csgo-gsi");
const AWS = require('aws-sdk');
const util = require('util');
const path = require("path");
const { exec } = require('child_process');
const { Polly, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3 } = require("@aws-sdk/client-s3");
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const playSound = require("play-sound")((opts = {}));

require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });  
  const openai = new OpenAIApi(configuration);  

let gsi = new CSGOGSI({
    port: 3000,
    authToken: ["Q79v5tcxVQ8u"] // this must match the cfg auth token
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


let history = [];

async function getChatGPTComment(prompt) {
  try {
    const messages = [
      ...history,
      { role: "user", content: prompt },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const comment = response.data.choices[0].message.content;
    history.push({ role: "assistant", content: comment });

    return comment.trim();
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return null;
  }
}

// Configure AWS SDK
AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const polly = new Polly({ region: "eu-central-1" });

function synthesizeAndPlayText(text, lang = "ru-RU") {
  const params = {
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: 'Maxim',
      TextType: 'text',
      LanguageCode: lang
  };

  polly.synthesizeSpeech(params, function(err, data) {
      if (err) {
          console.error('Error generating TTS audio:', err);
      } else if (data) {
          if (data.AudioStream instanceof Buffer) {
              // Save the audio to a temporary file
              const filename = `${Math.floor(Math.random() * 100000)}.mp3`;
              const filePath = path.join(__dirname, filename);
              console.log('Generating audio file:', filePath);


              // Write the data to the file and then play it
              fs.writeFile(filePath, data.AudioStream, function(err) {
                if (err) {
                    console.error('Error writing audio file:', err);
                } else {
                    console.log('Audio file created, playing audio...');
    
                    // Play the audio file
                    exec(`start "" "${filePath}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                }
            });
        }
      }
  });
}