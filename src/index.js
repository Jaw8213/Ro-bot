// load the .env variables
require('dotenv').config();
const fetch = require('node-fetch');
const { Client, IntentsBitField } = require('discord.js');

// setting up the discord client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

// stores the previous cards state
let previousCards = [];

// fetch trello cards
async function getTrelloCards() {
    const url = `https://api.trello.com/1/boards/${process.env.BOARD_ID}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;
    try {
        const response = await fetch(url);
        const cards = await response.json();
        return cards;
    } catch (error) {
        console.error('Error fetching Trello cards:', error);
        return [];
    }
}

// checks for trello update
async function checkTrelloUpdates(channel) {
    const currentCards = await getTrelloCards();

    currentCards.forEach(card => {
        const oldCard = previousCards.find(c => c.id === card.id);

        if (!oldCard) {
            //checks for a new card
            channel.send(`New Trello card added: **${card.name}**`);
        } else if (oldCard.name !== card.name || oldCard.idList !== card.idList) {
            // if card name or list has changed announce it to the discord
            channel.send(`Trello card updated: **${card.name}**`);
        }
    });

    // check for archived cards
    previousCards.forEach(oldCard => {
        const stillExists = currentCards.find(c => c.id === oldCard.id);
        if (!stillExists) {
            // ifcard archived announce it to the discord
            channel.send(`Trello card Archived: **${oldCard.name}**`);
        }
    });

    previousCards = currentCards;
}

// checking if discord bot is ready 
client.on('ready', async (c) => {
    console.log(`${c.user.tag} is ready`);

    const channel = c.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (!channel) return console.log('Invalid channel ID in .env');

    // fetching from trello
    previousCards = await getTrelloCards();

    //checks for updates and updates every 5 seconds
    setInterval(() => checkTrelloUpdates(channel),5 * 1000);
});

// testing if bot is working
client.on('messageCreate', (message) => {
    if (message.content === 'hello') {
        message.reply('Hello there!');
    }
});

// logining in the bot
client.login(process.env.TOKEN);