const {Client, IntentsBitField, ActivityType} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
require('dotenv').config()

const client = new Client({
    intents: [ IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.MessageContent,
     ]
});

eventHandler(client);

client.login(process.env.BOT_TOKEN).then(() => {
    client.user.setActivity({name: '🤔', type: ActivityType.Watching})
})