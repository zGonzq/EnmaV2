const { Client, Message } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */

module.exports = async (client, message) => {
    // el bot respondera los mensajes de "hola", olas", "holi", "holis", "holaa", "holaaa", "holaaa", "holaaaa", "holaaaaa", "holaaaaaa" con un mensaje de "Hola, ${message.author}"

    if (message.content.toLowerCase() === 'hola' || message.content.toLowerCase() === 'olas' || message.content.toLowerCase() === 'holi' || message.content.toLowerCase() === 'holis' || message.content.toLowerCase() === 'holaa' || message.content.toLowerCase() === 'holaaa' || message.content.toLowerCase() === 'holaaaa' || message.content.toLowerCase() === 'holaaaaa' || message.content.toLowerCase() === 'holaaaaaa') {
        message.channel.send(`Hola, ${message.author}`);
    }
}