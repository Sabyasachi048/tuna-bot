const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({
			content: `Pong!\n Latency ${
				Date.now() - interaction.createdTimestamp
			} ms`,
			ephemeral: true
		});
	}
};
