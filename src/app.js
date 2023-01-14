const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { isNullOrUndefined } = require('./shared/utils');

require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if (
		isNullOrUndefined(command['data']) === true ||
		isNullOrUndefined(command['execute']) === true
	) {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`
		);
	} else {
		client.commands.set(command.data.name, command);
	}
}

client.once(Events.ClientReady, (c) => {
	console.log(`Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand() === false) return;
	console.log(interaction);

	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.error(
			`No command matching ${interaction.commandName} was found.`
		);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing the command'
		});
	}
});
