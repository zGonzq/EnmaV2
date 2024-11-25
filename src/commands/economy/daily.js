const { EmbedBuilder } = require("discord.js");
const economy = require('../../models/economy');

module.exports = {
    name: 'daily',
    description: 'Reclama tus monedas diarias.',

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
            const newData = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            await newData.save();
        }
        
        if (data) {
            const lastDaily = data.lastDaily.toDateString();
            const now = new Date().toDateString();
        
            if (lastDaily === now) {
                return interaction.reply({ embeds: [embed.setDescription('Ya has reclamado tus monedas diarias.').setColor('Red')] });
            }
        
            data.lastDaily = new Date();
            data.balance = data.balance === 0 ? 100 : data.balance * 1.2;
            await data.save();
        
            interaction.reply({ embeds: [embed.setDescription(`Has reclamado tus monedas diarias. Ahora tienes ${data.balance} monedas.`).setColor('Green')] });
        } else {
            const balance = 100;
            const newData = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                lastDaily: new Date(),
                balance: balance
            });
            await newData.save();
        
            interaction.reply({ embeds: [embed.setDescription(`Has reclamado tus monedas diarias. Ahora tienes ${balance} monedas.`).setColor('Green')] });
        }
    }
}
