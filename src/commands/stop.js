const { SlashCommandBuilder } = require('discord.js');
const {
	joinVoiceChannel,
	createAudioPlayer,
	entersState,
	VoiceConnectionStatus
} = require('@discordjs/voice');

const player = createAudioPlayer();

const stopSong = () => {
	player.stop(true);
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
		.setName('stop')
		.setDescription('Stop playing music.'),
	async execute(interaction) {
		const channel = interaction.member?.voice.channel;
		if (channel) {
			try {
				interaction.reply('Stopping music player...');
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				await stopSong();
				connection.disconnect();
			} catch (error) {
				console.error(error);
			}
		} else {
			interaction.reply('Something went wrong :(');
		}
	}
};
