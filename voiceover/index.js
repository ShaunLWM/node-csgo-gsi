const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const CSGOGSI = require("../index"); // const CSGOGSI = require("node-csgo-gsi");
const gtts = require("gtts");
const temp = require("temp");
const AWS = require('aws-sdk');

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

const polly = new AWS.Polly();
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const path = require("path");
const { exec } = require('child_process');

function synthesizeAndPlayText(text, lang = "ru-RU") {
    const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Maxim',
        TextType: 'text',
        LanguageCode: lang
    };

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.error('Error generating TTS audio:', err);
            return;
        }

        // Save the audio to a temporary file
        const filename = `${Math.floor(Math.random() * 100000)}.mp3`;
        const filePath = path.join("/home/deck/VSC_Projects/csgo_gsi/", filename);

        // Write the data to the file and then play it
        writeFile(filePath, data.AudioStream)
            .then(() => {
                // Play the audio file
                exec("mplayer /home/deck/VSC_Projects/csgo_gsi/20057.mp3",  {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
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
              
                // Delete the temporary file after playing
                //unlink(filename).catch(console.error);
            })
            .catch(console.error);
    });
}