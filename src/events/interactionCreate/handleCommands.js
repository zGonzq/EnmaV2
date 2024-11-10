const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { EmbedBuilder } = require('discord.js')

module.exports = async (client, interaction) => {

    const embed = new EmbedBuilder(client)

    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                  interaction.reply({
                    embeds: [embed.setTitle('Error').setDescription('Este comando es solo para desarrolladores.').setColor('Red')],
                    phemeral: true,
                  });
                  return;
              }
          }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                  embeds: [embed.setTitle('Error').setDescription('Este comando solo se puede usar en el servidor de pruebas.').setColor('Red')],
                    ephemeral: true,
                });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            embeds: [embed.setTitle('Error').setDescription('No tienes suficientes permisos.').setColor('Red')],
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            embeds: [embed.setTitle('Error').setDescription('No tengo suficientes permisos.').setColor('Red')],
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`Sucedio un error al ejecutar el comando: ${error}`);
  }
};