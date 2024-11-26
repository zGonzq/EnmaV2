const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const economy = require('../../models/economy');

module.exports = {
    name: 'pay',
    description: 'Paga a otro usuario una cantidad de monedas.',
    options: [
        {
            name: 'user',
            description: 'Usuario al que quieres pagar.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'amount',
            description: 'Cantidad de monedas que quieres pagar.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const embed = new EmbedBuilder();
        if (!interaction.guild) {
            return interaction.reply({ embeds: [embed.setDescription('Este comando solo está disponible en servidores.').setColor('Red')] });
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (targetUser.bot) {
            return interaction.reply({ embeds: [embed.setDescription('No puedes pagar a un bot.').setColor('Red')] });
        }

        if (amount <= 0) {
            return interaction.reply({ embeds: [embed.setDescription('La cantidad debe ser un número positivo.').setColor('Red')] });
        }

        let senderData = await economy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        let receiverData = await economy.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

        if (!senderData) {
            senderData = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            await senderData.save();
        }

        if (!receiverData) {
            receiverData = new economy({
                userId: targetUser.id,
                guildId: interaction.guild.id,
            });
            await receiverData.save();
        }

        if (senderData.balance < amount) {
            return interaction.reply({ embeds: [embed.setDescription('No tienes suficientes monedas para realizar esta transacción.').setColor('Red')] });
        }

        senderData.balance -= amount;
        receiverData.balance += amount;

        await senderData.save();
        await receiverData.save();

        interaction.reply({ embeds: [embed.setDescription(`Has pagado ${amount} monedas a ${targetUser.tag}.`).setColor('Green')] });
    }
}