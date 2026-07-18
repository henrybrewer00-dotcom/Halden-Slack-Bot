const axios = require("axios");
require("dotenv").config();
async function main() {

  const animals = [
    {api: "https://api.thedogapi.com/v1/images/search?limit=1", getUrl: (data) => data[0].url },
    {api: "https://api.thecatapi.com/v1/images/search?limit=1", getUrl: (data) => data[0].url},
    {api:  "https://randomfox.ca/floof", getUrl: (data) => data.image},
  ];
  const choice = animals[Math.floor(Math.random() * animals.length)];
  const response = await axios.get(choice.api);
  return choice.getUrl(response.data);
}
const intervals = {};

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/halden-start", async ({ command, ack, respond }) => {
  await ack();
  const minutes = Number(command.text) || 10;
  const channe1Id = command.channel_id;

  if (intervals[channelId]) clearInterval(intervals[channelId]);

  intervals[channel1Id] = setinterval(async () => {
    try {
      const imageUrl= await getRandomAnimalUrl();
      await app.client.chat.postMessage({
        channel: channel1Id,
        text: "Motivation DROP!",
        blocks: [{ type: "image", image_url: imageUrl, alt_text: "motivation animal"}]
      });
    } catch (err) {
      console.error(err);
    }
  }, minutes * 60 * 1000);
  await respond({text: `Started! Photo every ${minutes} min. Use /halden-stop to end`});
});

app.command("/halden-stop", async ({ command, ack, respond }) => {
  await ack();
  const channel1Id = command.channel_id;
  if (intervals[channel1Id]) {
    clearInterval(intervals[channel1Id]);
    delete intervals[channel1Id];
    await respond({ text: "Stoopppped!!!"});
 } else {
  await respond({ text: "Nothing was running.........." });
 }
});



app.command("/halden-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/halden-help", async ({ ack, respond }) => {
    await ack();
    await respond({
      text:
  `Available Commands:
  /halden-ping - Check bot latency
  /halden-dog  - Get a image of a dog, for motivation ofc
  /halden-cat -Get a image of a cat, for motivation ofc
  /halden-fox -Get a image of a fox, for motivation ofc
  /halden-start X -Get a motivation photo every X minutes! Use /halden-stop to stop!`
    });
  });

app.command("/halden-cat", async ({ ack, respond }) => {
    await ack();
    await respond({
      text:
  `brooo!!!:
  Bro, cats are 10x better than dogs, get a dog photo with /halden-dog, be cool...  `
    });
  });
app.command("/halden-dog", async ({ ack, respond }) => {
    await ack();
  
    try {
      const response = await axios.get("https://api.thedogapi.com/v1/images/search?limit=1");
      await respond({
        text: "Dog Image!",
        blocks: [
            {
                type: "image",
                image_url: response.data[0].url,
                alt_text: "dog"
            }
        ]
      })
    } catch (err) {
      await respond({ text: "Failed to fetch a dog image...." });
    }
  });
app.command("/halden-fox", async ({ ack, respond }) => {
    await ack();
  
    try {
      const response = await axios.get("https://randomfox.ca/floof/");
      await respond({
        text: "Fox Image!",
        blocks: [
            {
                type: "image",
                image_url: response.data.image,
                alt_text: "Fox!"
            }
        ]
      })
    } catch (err) {
      await respond({ text: "Failed to fetch a fox image...." });
    }
  });

(async () => {
  await app.start();
  console.log("bot is running!");
})();
