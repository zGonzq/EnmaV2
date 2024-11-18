const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'invite',
    description: '¡Invita al bot a tu servidor!',

    callback: async (client, interaction) => {

        const embed = new EmbedBuilder();
        embed.setTitle('¡Invitame a tu servidor!');
        embed.setDescription('¡Gracias por quererme en tu servidor! [Haz click aquí](https://discord.com/oauth2/authorize?client_id=1171876289632813148&permissions=8&integration_type=0&scope=bot) para invitarme a tu servidor.');
        embed.setColor('Blurple');
        await interaction.reply({
            embeds: [embed]
        });
    }
}