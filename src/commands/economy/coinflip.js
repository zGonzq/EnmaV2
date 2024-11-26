const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const economy = require('../../models/economy');

module.exports = {
    name: 'coinflip',
    description: 'Apuesta monedas en un lanzamiento de moneda.',
    options: [
        {
            name: 'amount',
            description: 'Cantidad de monedas que quieres apostar.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
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

        const amount = interaction.options.getInteger('amount');
        if (amount < 2) {
            return interaction.reply({ embeds: [embed.setDescription('La cantidad mínima para apostar es de 2 monedas.').setColor('Red')] });
        }

        let data = await economy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (!data) {
            data = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            await data.save();
        }

        if (data.balance < amount) {
            return interaction.reply({ embeds: [embed.setDescription('No tienes suficientes monedas para hacer esta apuesta.').setColor('Red')] });
        }

        const lastCoinflip = data.lastCoinflip;
        const now = new Date();
        const diff = now - lastCoinflip;
        const diffMinutes = Math.floor(diff / 1000 / 60);

        if (diffMinutes < 10) {
            const minutesLeft = 10 - diffMinutes;
            return interaction.reply({ embeds: [embed.setDescription(`Ya has hecho un lanzamiento de moneda recientemente. Puedes intentarlo de nuevo en ${minutesLeft} minutos.`).setColor('Red')] });
        }

        data.lastCoinflip = now;

        const win = Math.random() < 0.6; 
        if (win) {
            const winnings = amount * 2;
            data.balance += winnings;
            await data.save();

            return interaction.reply({ embeds: [embed.setTitle('¡Has ganado!').setDescription(`Has ganado ${winnings} monedas. Ahora tienes ${data.balance} monedas.`).setColor('Green')] });
        } else {
            data.balance -= amount;
            await data.save();

            return interaction.reply({ embeds: [embed.setTitle('Has perdido').setDescription(`Has perdido ${amount} monedas. Ahora tienes ${data.balance} monedas.`).setColor('Red')] });
        }
    }
}