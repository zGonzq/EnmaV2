const { EmbedBuilder } = require("discord.js");
const economy = require('../../models/economy');

module.exports = {
    name: 'work',
    description: 'Trabaja para ganar monedas.',

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

        let data = await economy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (!data) {
            data = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            await data.save();
        }

        const lastWork = data.lastWork;
        const now = new Date();
        const diff = now - lastWork;
        const diffMinutes = Math.floor(diff / 1000 / 60);

        if (diffMinutes < 30) {
            const minutesLeft = 30 - diffMinutes;
            return interaction.reply({ embeds: [embed.setDescription(`Ya has trabajado recientemente. Puedes trabajar de nuevo en ${minutesLeft} minutos.`).setColor('Red')] });
        }

        data.lastWork = now;
        const earned = data.balance * 0.3; 
        data.balance += earned;
        await data.save();

        interaction.reply({ embeds: [embed.setDescription(`Has trabajado y ganado ${earned.toFixed(2)} monedas. Ahora tienes ${data.balance.toFixed(2)} monedas.`).setColor('Green')] });
    }
}