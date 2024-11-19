require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        eventHandler(client);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🛫 Conectado a la base de datos');
    } catch (error) {
        console.log(error);
    }
})();

client.login(process.env.BOT_TOKEN).then(() => {
    client.user.setActivity({ name: '🤔', type: ActivityType.Watching });
});