const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			await interaction.editReply(
				`Pong!\nLatency ${Date.now() - interaction.createdTimestamp} ms`
			);
		} catch (error) {
			console.error(error);
			await interaction.reply('Something went wrong :(');
		}
	}
};
