const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const economy = require('../../models/economy');

module.exports = {
    name: 'balance',
    description: 'Muestra el balance de un usuario y los tiempos de espera de los comandos.',
    options: [
        {
            name: 'user',
            description: 'Usuario del que quieres ver el balance.',
            type: ApplicationCommandOptionType.User,
            required: false
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

        const targetUser = interaction.options.getUser('user') || interaction.user;

        let data = await economy.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

        if (!data) {
            data = new economy({
                userId: targetUser.id,
                guildId: interaction.guild.id,
            });
            await data.save();
        }

        const now = new Date();

        const getCooldownStatus = (lastTime, cooldown) => {
            const diff = now - lastTime;
            const diffMinutes = Math.floor(diff / 1000 / 60);
            const diffHours = Math.floor(diff / 1000 / 60 / 60);

            if (cooldown === 'hourly' && diffHours < 1) {
                return `Disponible en ${60 - diffMinutes % 60} minutos`;
            } else if (cooldown === 'daily' && diffHours < 24) {
                return `Disponible en ${24 - diffHours} horas`;
            } else if (cooldown === 'weekly' && diffHours < 168) {
                return `Disponible en ${168 - diffHours} horas`;
            } else if (cooldown === 'minutes' && diffMinutes < 5) {
                return `Disponible en ${5 - diffMinutes} minutos`;
            } else if (cooldown === 'half-hour' && diffMinutes < 30) {
                return `Disponible en ${30 - diffMinutes} minutos`;
            } else {
                return 'Disponible';
            }
        };

        const cooldowns = [
            { name: 'Daily', value: getCooldownStatus(data.lastDaily, 'daily') },
            { name: 'Work', value: getCooldownStatus(data.lastWork, 'half-hour') },
            { name: 'Miniwork', value: getCooldownStatus(data.lastMiniwork, 'minutes') },
            { name: 'Mine', value: getCooldownStatus(data.lastMine, 'minutes') },
            { name: 'Rob', value: getCooldownStatus(data.lastRob, 'hourly') },
            { name: 'Fish', value: getCooldownStatus(data.lastFish, 'minutes') },
            { name: 'Crime', value: getCooldownStatus(data.lastCrime, 'minutes') },
            { name: 'Gamble', value: getCooldownStatus(data.lastGamble, 'minutes') },
            { name: 'Bet', value: getCooldownStatus(data.lastBet, 'minutes') },
            { name: 'Coinflip', value: getCooldownStatus(data.lastCoinflip, 'minutes') },
            { name: 'Roulette', value: getCooldownStatus(data.lastRoulette, 'minutes') },
        ];

        const cooldownsText = cooldowns.map(cooldown => `\`\`\`${cooldown.name}: ${cooldown.value}\`\`\``).join('\n');

        embed.setTitle(`Balance de ${targetUser.tag}`)
            .setColor('Blue')
            .addFields(
                { name: 'Balance', value: `${data.balance} monedas`, inline: false },
                { name: 'Tiempos restantes', value: cooldownsText, inline: false }
            );

        interaction.reply({ embeds: [embed] });
    }
}