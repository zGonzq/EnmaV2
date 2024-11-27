const { Client, Message, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */

module.exports = async (client, message) => {
    const channel = client.channels.cache.get('1180196042550038548');
    const messages = await channel.messages.fetch({ limit: 100 });
    messageToUpdate = messages.find(msg => msg.author.bot);

    setInterval(async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const formattedTime = `<t:${now}:T>`;
    
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Pitrufquen&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=es`);
        const weather = weatherResponse.data;
    
        const embed = new EmbedBuilder()
            .setTitle('Meteorología')
            .setDescription(`Clima en del servidor en la zona sur de Chile.`)
            .setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`)
            .addFields(
              { name: 'Hora', value: formattedTime, inline: true},
              { name: `Puesta de sol`, value: `<t:${weather.sys.sunset}:T>`, inline: true },
              { name: `Amanecer`, value: `<t:${weather.sys.sunrise}:T>`, inline: true },
              { name: 'Temperatura', value: `${weather.main.temp}°C`, inline: false },
              { name: 'Sensación térmica', value: `${weather.main.feels_like}°C`, inline: false },
              { name: `Humedad`, value: `${weather.main.humidity}%`, inline: false },
              { name: `Presión`, value: `${weather.main.pressure} hPa`, inline: false },
              { name: `Estado del cielo`, value: `${weather.weather[0].description}`, inline: false },
              { name: `Viento`, value: `${weather.wind.speed} m/s`, inline: false },
              { name: `Nubosidad`, value: `${weather.clouds.all}%`, inline: false },
              )
            .setColor('Random');
    
        if (!messageToUpdate) {
          messageToUpdate = await channel.send({ embeds: [embed] });
        } else {
          messageToUpdate.edit({ embeds: [embed] });
            }
        } catch (error) {
            console.log('Error al obtener los datos del clima:', error);
        }
    }, 30000);
}