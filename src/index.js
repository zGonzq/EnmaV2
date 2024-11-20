require('dotenv').config({ path: __dirname + '/.env' });
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
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🛫 Conectado a la base de datos: ' + mongoose.connection.readyState);

        eventHandler(client);
        
        await client.login(process.env.BOT_TOKEN);
        client.user.setActivity({ name: '🤔', type: ActivityType.Watching });

        
    } catch (error) {
        console.log(error);
    }
})();