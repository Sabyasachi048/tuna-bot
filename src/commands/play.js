const { SlashCommandBuilder } = require('discord.js');
const play = require('play-dl');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	VoiceConnectionStatus
} = require('@discordjs/voice');
const { isNullOrUndefined } = require('../shared/utils');

const player = createAudioPlayer();

const playSong = async (url) => {
	const stream = await play.stream(url);
	const resource = createAudioResource(stream.stream, {
		inputType: stream.type
	});
	player.play(resource);
};

const connectToChannel = async (channel) => {
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
			option.setName('url').setDescription('The YouTube url of the song')
		),
	async execute(interaction) {
		const channel = interaction.member?.voice.channel;
		await interaction.deferReply();
		if (channel) {
			try {
				const inputUrl = interaction.options.getString('input');
				if (
					isNullOrUndefined(inputUrl) === true ||
					inputUrl.length === 0
				) {
					await interaction.reply('No YouTube Url specified!!!');
				} else {
					await interaction.reply(`Playing music \`${inputUrl}\``);
					const connection = await connectToChannel(channel);
					connection.subscribe(player);
					await playSong(inputUrl);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			await interaction.reply('Something went wrong :(');
		}
	}
};
