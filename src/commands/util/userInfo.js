const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'user-info',
    description: 'Obtén información de un usuario.',
    options: [
        {
            name: 'user',
            description: 'Usuario del que quieres obtener información.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    callback: async (client, interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const miembro = await interaction.guild.members.fetch(user.id);
        let member = await user.fetch({force: true})


        const embed = new EmbedBuilder()
        .setTitle(`Información de ${user.username}.`)
        .setColor("Random")
        .setFooter({ text: `Información solicitada por: ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}` })
        .setThumbnail(`${user.displayAvatarURL({dynamic: true})}`)
        .setImage(user.bannerURL({size: 512, dynamic: true}))
        .addFields(
            {name: "ID de usuario", value: `${user.id} (${user})`},
            {name: `Cuenta creada`, value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true},
            {name: `Se unió al servidor`, value: `<t:${parseInt(miembro.joinedAt / 1000)}:R>`, inline: true},
            {name: `Roles`, value: `${miembro.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `${roles}`).join(" ") || "No tiene roles"}`},
            {name: "Banner", value: user.bannerURL({dynamic: true}) ? "** **" : "No tiene banner"},

        )
        
            await interaction.reply({embeds: [embed]});
    }
}