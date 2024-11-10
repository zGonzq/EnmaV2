const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { permission } = require('process');
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
        interaction.reply('Comando de ban en construcción.');
    }
}