const { EmbedBuilder, Application, ApplicationCommand, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'rng',
    description: 'Genera un número aleatorio.',
    options: [
        {
            name: 'min',
            description: 'Número mínimo.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'max',
            description: 'Número máximo.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    callback: async (client, interaction) => {


        const embed = new EmbedBuilder();
        const calc = Math.floor(Math.random() * (interaction.options.getInteger('max') - interaction.options.getInteger('min') + 1) + interaction.options.getInteger('min'));
        embed.setTitle('Número aleatorio');
        embed.setDescription(`Número aleatorio entre ${interaction.options.getInteger('min')} y ${interaction.options.getInteger('max')}: **${calc}**`);
        embed.setColor('Random');

        await interaction.reply({
            embeds: [embed]
        });
    }
}