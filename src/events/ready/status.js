const { Client, Message, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const os = require('os');

let lastMessageId = null;

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */
module.exports = async (client, message) => {
    const updateStatus = async () => {
        const embed = new EmbedBuilder()
            .setTitle("Estado del bot")
            .setDescription("Estados del bot")
            .addFields(
                { name: "Estado", value: "Bot en linea" },
                { name: "Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "Memoria", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "Uptime", value: `${(process.uptime() / 60).toFixed(2)} minutos`, inline: true },
                { name: "Plataforma", value: os.platform(), inline: true },
                { name: "Versión de Node", value: process.version, inline: true },
                { name: "Versión de Discord.js", value: require('discord.js').version, inline: true },
                { name: "Base de datos", value: {0: "Desconectado", 1: "Conectado", 2: "Conectando", 3: "Desconectando"}[mongoose.connection.readyState] },
            )
            .setColor("Blurple");

        const sala = client.channels.cache.get('1188964850282541157');

        if (lastMessageId) {
            try {
                const lastMessage = await sala.messages.fetch(lastMessageId);
                await lastMessage.edit({ embeds: [embed] });
            } catch (error) {
                console.error('Error al editar el mensaje:', error);
                lastMessageId = null; 
            }
        }

        if (!lastMessageId) {
            const sentMessage = await sala.send({ embeds: [embed] });
            lastMessageId = sentMessage.id;
        }
    };
    updateStatus();
    setInterval(updateStatus, 60000);
};