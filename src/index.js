require('dotenv').config({ path: __dirname + '/.env' });
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');

const client = new Client({
    intents: 3276799
});




(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🛫 Conectado a la base de datos: ' + mongoose.connection.readyState);

        eventHandler(client);
        
        await client.login(process.env.BOT_TOKEN).then(() => {
            const activities = [
                { name: 'Version 2 soon. 🚀', type: ActivityType.Watching },
                { name: 'Economy system in progress. 🚀', type: ActivityType.Watching },
                { name: `${client.guilds.cache.size} servers. 🚀`, type: ActivityType.Watching },
            ];

            let i = 0;
            setInterval(() => {
                const activity = activities[i];
                client.user.setActivity(activity.name, { type: activity.type });
                i = ++i % activities.length;
            }, 30000);

        });

    } catch (error) {
        console.log(error);
    }
})();