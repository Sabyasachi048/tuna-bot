const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
// const { Client, VoiceChannel, Intents } = require('discord.js');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	VoiceConnectionStatus
} = require('@discordjs/voice');
const { isNullOrUndefined } = require('../shared/utils');

const player = createAudioPlayer();

const playSong = (url) => {
	const stream = ytdl(url, {
		filter: 'audioonly'
	});
	const resource = createAudioResource(stream);
	player.play(resource);
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
		.setName('play')
		.setDescription('Play a song from YouTube')
		.addStringOption((option) =>
			option
				.setName('input')
				.setDescription('The YouTube url of the song')
		),
	async execute(interaction) {
		const channel = interaction.member?.voice.channel;
		if (channel) {
			try {
				const inputUrl = interaction.options.getString('input');
				if (
					isNullOrUndefined(inputUrl) === true ||
					inputUrl.length === 0
				) {
					await interaction.reply('No YouTube Url specified!!!');
				} else {
					await interaction.reply('Playing music...');
					const connection = await connectToChannel(channel);
					connection.subscribe(player);
					await playSong(inputUrl);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			interaction.reply('Something went wrong :(');
		}
	}
};
