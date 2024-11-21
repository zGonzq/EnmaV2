const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const level = require('../../models/levels');
const { Font, RankCardBuilder} = require('canvacord');



module.exports = {
    name: 'level',
    description: 'Muestra tu nivel de usuario.',
    options: [
        {
            name: 'user',
            description: 'Usuario del que quieres ver el nivel.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    /**
    * @param {Client} client
    * @param {Interaction} interaction
    */
    callback: async (client, interaction) => {
        const embed = new EmbedBuilder();

        if (!interaction.guild) {
            return interaction.reply('Este comando solo está disponible en servidores.');
        };

        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const data = await level.findOne({ userId: member.id, guildId: interaction.guild.id });

        if (!data) {
            return interaction.reply({ embeds: [embed.setDescription('Este usuario no tiene un nivel asignado.').setColor('Red')] });
        }

        let allLevels = await level.find({ guildId: interaction.guild.id }).select(
            '-_id userId level xp'
          );

          allLevels.sort((a, b) => {
            if (a.level === b.level) {
              return b.xp - a.xp;
            } else {
              return b.level - a.level;
            }
          });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === member) + 1;

        const status = member.presence?.status ?? 'offline'

        Font.loadDefault();
        const rank = new RankCardBuilder().setAvatar(member.user.displayAvatarURL({ size: 256 })).setCurrentXP(data.xp).setRequiredXP(data.level * 100).setStatus(status).setStyle({ progressbar: {thumb: {style: {backgroundColor: "#FFC300"  }}}}).setUsername(member.user.username).setDisplayName(member.user.displayName).setLevel(data.level).setRank(currentRank);

        const card = await rank.build({ format: 'png' });


        await interaction.reply({
            files: [card],
        });









    }
}