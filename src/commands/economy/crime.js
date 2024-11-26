const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const economy = require('../../models/economy');

const rewards = [
    { amount: 1000000, probability: 0.05 },
    { amount: 500000, probability: 0.1 },
    { amount: 250000, probability: 0.15 },
    { amount: 100000, probability: 0.2 },
    { amount: 50000, probability: 0.5 }
];

const failMessages = [
    "¡El crimen ha fallado!",
    "¡Has sido atrapado!",
    "¡El crimen no tuvo éxito!",
    "¡Has perdido monedas!",
    "¡El crimen fue un desastre!"
];

const failPenalty = 1000; // Penalty amount for failing the crime

module.exports = {
    name: 'crime',
    description: 'Intenta cometer un crimen para ganar monedas.',
    options: [
        {
            name: 'cameras_off',
            description: 'Apagar las cámaras de seguridad (10000 monedas).',
            type: ApplicationCommandOptionType.Boolean,
            required: false
        },
        {
            name: 'less_police',
            description: 'Menos policías en la zona (10000 monedas).',
            type: ApplicationCommandOptionType.Boolean,
            required: false
        },
        {
            name: 'advanced_equipment',
            description: 'Equipamiento avanzado (10000 monedas).',
            type: ApplicationCommandOptionType.Boolean,
            required: false
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

        let data = await economy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (!data) {
            data = new economy({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            await data.save();
        }

        const lastCrime = data.lastCrime;
        const now = new Date();
        const diff = now - lastCrime;
        const diffMinutes = Math.floor(diff / 1000 / 60);

        if (diffMinutes < 30) {
            const minutesLeft = 30 - diffMinutes;
            return interaction.reply({ embeds: [embed.setDescription(`Ya has intentado cometer un crimen recientemente. Puedes intentarlo de nuevo en ${minutesLeft} minutos.`).setColor('Red')] });
        }

        if (data.balance < 1000) {
            return interaction.reply({ embeds: [embed.setDescription('No tienes suficientes monedas para pagar la condena en caso de fallar. Necesitas 1000 monedas.').setColor('Red')] });
        }

        const camerasOff = interaction.options.getBoolean('cameras_off') || false;
        const lessPolice = interaction.options.getBoolean('less_police') || false;
        const advancedEquipment = interaction.options.getBoolean('advanced_equipment') || false;

        let totalCost = 0;
        let successProbability = 0.05;

        if (camerasOff) {
            totalCost += 10000;
            successProbability += 0.05;
        }

        if (lessPolice) {
            totalCost += 10000;
            successProbability += 0.05;
        }

        if (advancedEquipment) {
            totalCost += 10000;
            successProbability += 0.05;
        }

        if (data.balance < totalCost) {
            return interaction.reply({ embeds: [embed.setDescription(`No tienes suficientes monedas para pagar las opciones seleccionadas. Necesitas ${totalCost} monedas.`).setColor('Red')] });
        }

        data.balance -= totalCost;
        data.lastCrime = now;

        const success = Math.random() < successProbability;
        if (success) {
            const reward = rewards.find(r => Math.random() < r.probability);
            const earned = reward.amount;
            data.balance += earned;
            await data.save();

            return interaction.reply({ embeds: [embed.setTitle('Crimen exitoso').setDescription(`Has cometido un crimen y ganado ${earned} monedas. Ahora tienes ${data.balance} monedas.`).setColor('Green')] });
        } else {
            const failMessage = failMessages[Math.floor(Math.random() * failMessages.length)];
            data.balance -= failPenalty;
            await data.save();

            return interaction.reply({ embeds: [embed.setTitle('Crimen fallido').setDescription(`${failMessage} Has perdido ${failPenalty} monedas. Ahora tienes ${data.balance} monedas.`).setColor('Red')] });
        }
    }
}