const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'Expulsa a un usuario del servidor.',
    options: [
        {
            name: 'user',
            description: 'Usuario que quieres expulsar.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {

        const user = interaction.options.getUser("user");

        const member = await interaction.guild.members.fetch(user.id);

        if (member.id === interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedo expulsar al dueño del servidor.').setColor('Red')],
                ephemeral: true,
            });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedes expulsarte a ti mismo.').setColor('Red')],
                ephemeral: true,
            });
        }

        
        if (member.user.bot) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedo expulsar a un bot.').setColor('Red')],
                ephemeral: true,
            });
        }

        if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedo expulsar a este usuario.').setColor('Red')],
                ephemeral: true,
            });
        }

        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedo expulsar a este usuario.').setColor('Red')],
                ephemeral: true,
            });
        }

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setTitle('Error').setDescription('No puedes expulsar a este usuario.').setColor('Red')],
                ephemeral: true,
            });
        }


        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle('Expulsión').setDescription(`El usuario ${user.tag} ha sido expulsado del servidor.`).setColor('Random')],
        });
        await member.kick();
    }
}