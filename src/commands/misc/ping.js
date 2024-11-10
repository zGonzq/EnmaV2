const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Ping!',
    // devOnly: true,
    // testOnly: true,
    // options: Object[],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder();
        embed.setTitle('Pong! 🏓');
        embed.setDescription(`Latencia: ${ping}ms.\nWebsocket: ${client.ws.ping}ms.`);
        embed.setColor('Random');

        interaction.editReply({
            embeds: [embed]
        });
    }
}