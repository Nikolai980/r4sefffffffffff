// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');




module.exports.run = async (client, message, args) => {
	if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply('You do not have the permission \`MANAGE_SERVER\`');
    const dpmanager = new Nuggies.dropdownroles();
	message.channel.send('**Dropdown role process started!**\nplease type your roles in the follwing order, then say "done" when finished!\n\n`<roleID> <label> <emoji>`');






	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: 10000 });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');


		const roleid = msg.content.split(' ')[0];
		const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send('Invalid role');

		const label = msg.content.split(' ').slice(1, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role: roleid, label: label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		dpmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setTitle('🏳 | R4 Club Languages')
				.setDescription('Click on the buttons to grant yourself a lang role!')
        .setImage('https://media.discordapp.net/attachments/912771091699757117/921832361358917653/1639852358029.gif')
				.setColor('#ff0000')
				.setTimestamp()
        .setFooter("© R4 Club 2021 | Choose Lang")
			Nuggies.dropdownroles.create({ message: message, content: embed, role: dpmanager, channelID: message.channel.id })
		}
	});
};

module.exports.config = {
	name: 'dp',
	description: 'Creates dropdown role!',
	usage: '.dp',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};