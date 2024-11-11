const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require('discord.js');
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {

      const embed = new EmbedBuilder()

      const targetUserId = interaction.options.get('target-user').value;
      const reason =
        interaction.options.get('reason')?.value || 'No se especificó una razón.';
  
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.reply({ embeds: [embed.setDescription(`El usuario ${targetUser.name} no existe.`).setColor('Red').setTitle('Error')] });
        return;
      }
  
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.reply({ embeds: [embed.setDescription(`No puedes banear al dueño del servidor.`).setColor('Red').setTitle('Error')] });
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; 
      const requestUserRolePosition = interaction.member.roles.highest.position; 
      const botRolePosition = interaction.guild.members.me.roles.highest.position; 
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.reply({ embeds: [embed.setDescription(`No puedes banear a alguien con un rol igual o superior al tuyo.`).setColor('Red').setTitle('Error')] });
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.reply({ embeds: [embed.setDescription(`No puedo banear a alguien con un rol igual o superior al mío.`).setColor('Red').setTitle('Error')] });
        return;
      }

      try {
        await targetUser.ban({ reason });
        await interaction.reply({ embeds: [embed.setDescription(`El usuario ${targetUser.user.tag} ha sido baneado.`).setColor('Green').setTitle('Baneado')] });
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
  
    name: 'ban',
    description: 'Banea a un usuario del servidor.',
    options: [
      {
        name: 'target-user',
        description: 'El usuario que quieres banear.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'La razón por la que quieres banear al usuario.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  };