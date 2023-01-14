const { SlashCommandBuilder } = require('discord.js');
const {
	joinVoiceChannel,
	createAudioPlayer,
	entersState,
	VoiceConnectionStatus
} = require('@discordjs/voice');

const player = createAudioPlayer();

const pauseSong = () => {
	player.pause(true);
};

const connectToChannel = async (channel) => {
	console.log(29, channel.guild.voiceAdapterCreator);
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		selfDeaf: false,
		adapterCreator: channel.guild.voiceAdapterCreator
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('p')
		.setDescription('Pausing music.'),
	async execute(interaction) {
		const channel = interaction.member?.voice.channel;
		if (channel) {
			try {
				await interaction.reply('Pausing music player...');
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				await pauseSong();
			} catch (error) {
				console.error(error);
			}
		} else {
			interaction.reply('Something went wrong :(');
		}
	}
};
