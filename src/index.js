const { Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is ready`);
});

client.on('messageCreate', (message) => {
    console.log(message);
});

client.login(
    'MTQyMzc3NTQ4NzY2MTk2OTU0Mg.GLl0hi.UR0m8KlAAGNrdYU3mY421iACJhRHXEdF4lKMHw'
);