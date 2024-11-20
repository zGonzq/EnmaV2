const { Client, Message, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const os = require('os');

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */
module.exports = async (client, message) => {

    const embed = new EmbedBuilder()
    embed.setTitle("Estado del bot")
    embed.setDescription("Estados del bot")
    embed.addFields(
        { name: "Estado", value: "Bot en linea" },
        { name: "CPU", value: os.cpus().map(cpu => cpu.model)[0] },
        { name: "Memoria", value: `${(os.totalmem() - os.freemem()) / 1024 / 1024 / 1024} GB / ${os.totalmem() / 1024 / 1024 / 1024} GB` },
        { name: "Plataforma", value: os.platform() },
        { name: "Versión de Node", value: process.version },
        { name: "Versión de Discord.js", value: require('discord.js').version },
        { name: "Base de datos", value: {0: "Desconectado", 1: "Conectado", 2: "Conectando", 3: "Desconectando"}[mongoose.connection.readyState] },

    )
    embed.setColor("Random")

    const sala = client.channels.cache.get('1188964850282541157');

    await sala.send({ embeds: [embed] });
}