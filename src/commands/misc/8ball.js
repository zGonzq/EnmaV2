const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: '8ball',
    description: '¡Hazle una pregunta a la bola mágica!',
    options: [
        {
            name: 'question',
            description: 'Pregunta para la bola mágica.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async (client, interaction) => {

        const embed = new EmbedBuilder();


        const question = interaction.options.getString('question');
        const answers = [
            'Sí.',
            'No.',
            'Probablemente.',
            'No lo sé.',
            'Pregunta de nuevo más tarde.',
            'No puedo responder a eso.',
            '¡Claro que sí!',
            '¡Claro que no!',
            '¡Por supuesto!',
            '¡Por supuesto que no!',
            '¡Por supuesto que sí!',
            '¡Por supuesto que no lo sé!',
        ];

        const answer = answers[Math.floor(Math.random() * answers.length)];

        embed.setTitle('🎱 Bola mágica');
        embed.setFields({
            name: 'Pregunta',
            value: question
        }, {
            name: 'Respuesta',
            value: answer
        })
        embed.setColor('Random');

        await interaction.reply({
            embeds: [embed]
        });
    }
}