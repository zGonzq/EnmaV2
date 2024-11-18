const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'embed',
    description: 'Crea un embed customizado.',
    options: [
        {
            name: 'title',
            description: 'Título del embed.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'description',
            description: 'Descripción del embed.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'color',
            description: 'Color del embed.',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: 'Rojo',
                    value: 'Red'
                },
                {
                    name: 'Azul',
                    value: 'Blue'
                },
                {
                    name: 'Verde',
                    value: 'Green'
                },
                {
                    name: 'Amarillo',
                    value: 'Yellow'
                },
                {
                    name: 'Morado',
                    value: 'Purple'
                },
                {
                    name: 'Azul grisáceo',
                    value: 'Blurple'
                },
                {
                    name: 'Aleatorio',
                    value: 'Random'
                }
            ]

        },
        {
            name: 'footer',
            description: 'Pie de página del embed.',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'image',
            description: 'Imagen del embed.',
            type: ApplicationCommandOptionType.Attachment,
            required: false
        },
        {
            name: 'thumbnail',
            description: 'Miniatura del embed.',
            type: ApplicationCommandOptionType.Attachment,
            required: false
        },
        {
            name: 'timestamp',
            description: 'Añade una marca de tiempo al embed.',
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],

    callback: async (client, interaction) => {



        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || 'Random';
        const footer = interaction.options.getString('footer');
        const image = interaction.options.getAttachment('image');
        const thumbnail = interaction.options.getAttachment('thumbnail');
        const timestamp = interaction.options.getBoolean('timestamp');

        const embed = new EmbedBuilder();

        embed.setTitle(title);
        embed.setDescription(description);

        if (!color){
            embed.setColor('Random');
        } else {
            embed.setColor(`${color}`);
        }

        if (footer) {
            embed.setFooter(footer);
        }

        if (image) {
            embed.setImage(image.url);
        }

        if (thumbnail) {
            embed.setThumbnail(thumbnail.url);
        }

        if (timestamp) {
            embed.setTimestamp();
        }


        await interaction.reply({
            embeds: [embed]
        });
    }
}