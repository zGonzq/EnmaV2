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
        IntentsBitField.Flags.GuildPresences,
    ],
});

const activities = [
    { name: 'Version 2 soon. 🚀', type: ActivityType.Watching },
    { name: 'Economy system in process 🚀', type: ActivityType.Playing },
    { name:  `${client.users.cache.size} users. 🚀`, type: ActivityType.Watching },
    { name: `${client.guilds.cache.size} servers. 🚀`, type: ActivityType.Watching },
];

const randomActivity = () => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity.name, { type: activity.type });
}


(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🛫 Conectado a la base de datos: ' + mongoose.connection.readyState);

        eventHandler(client);
        
        await client.login(process.env.BOT_TOKEN);

        setInterval(randomActivity, 60000);

    } catch (error) {
        console.log(error);
    }
})();