const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ban',
    description: 'Banea a un usuario.',
    // devOnly: true,
    // testOnly: true,
    options: [
        {
            name: 'usuario',
            description: 'El usuario que quieres banear.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'razon',
            description: 'La razón por la que quieres banear a este usuario.',
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],

    permissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {

        const user = interaction.options.get('usuario').user;
        const reason = interaction.options.get('razon')?.value || 'No se especificó una razón.';

        const embed = new EmbedBuilder()

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: 'No tienes permisos para banear a un usuario.', ephemeral: true });

        if (!interaction.guild.me.permissions.has(PermissionFlagsBits.BanMembers)) 

        if(!user) return interaction.reply({ content: 'No se pudo encontrar al usuario.', ephemeral: true });

        if(user.id === interaction.guild.ownerId) return interaction.reply({ content: 'No puedo banear al dueño del servidor.', ephemeral: true });

        if(user.id === client.user.id) return interaction.reply({ content: 'No puedo banearme a mi mismo.', ephemeral: true });

        if(user.id === interaction.member.id) return interaction.reply({ content: 'No puedes banearte a ti mismo.', ephemeral: true });

        if (interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.reply({ content: 'No puedes banear a alguien con un rol igual o superior al tuyo.', ephemeral: true });

        if (user.bot) return interaction.reply({ content: 'No puedo banear a un bot.', ephemeral: true });

        try {
            interaction.guild.members.ban(user, { reason });
            interaction.reply({ content: `**${user.tag}** ha sido baneado.`, ephemeral: true });
        } catch (error) {
            interaction.reply({ content: 'Ocurrió un error al intentar banear al usuario.', ephemeral: true });
            console.error(error);
        }
    }
}