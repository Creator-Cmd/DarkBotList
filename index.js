const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const useful = require('useful-tools');
client.ayar = db;

client.htmll = require('cheerio');
client.useful = useful;
client.tags = require('html-tags');

let profil = JSON.parse(fs.readFileSync('./profil.json', 'utf8'))
client.profil = profil

client.ayarlar = {
  "prefix": "!", //prefix
  "oauthSecret": "fNfWmTwu6bVfD7dHTgEYec1G5EDrhJ1d", //bot secreti
	"callbackURL": "https://snowbotlist.glitch.me/callback", //benim sitenin urlsini kendin ile değiş "/callback" kalacak!
	"kayıt": "682575198536728606", //onaylandı, reddedildi, başvuru yapıldı falan kayıtların gideceği kanalın ID'ini yazacaksın
  "renk": "#7289DA" //embedların rengini burdan alıo can sıkıntısdna yapılmış bişe falan fln
};

client.yetkililer = ["543858517832892442","644852897439547402","680886252517457925","615646611090964511"] //tüm yetkililerin ıdleri gelcek array
client.webyetkililer = ["543858517832892442","644852897439547402","680886252517457925","615646611090964511"] //web yetkililerin ıdleri gelcek array
client.sunucuyetkililer = ["543858517832892442","644852897439547402","680886252517457925","615646611090964511"] //sunucu yetkililerin ıdleri gelcek array

//

client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./jsonlar/otorol.json", "utf8"));
  let otorole =  JSON.parse(fs.readFileSync("./jsonlar/otorol.json", "utf8"));
      let arole = otorole[member.guild.id].sayi
  let giriscikis = JSON.parse(fs.readFileSync("./jsonlar/otorol.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('SNOWLIST SYSTEM')
    .setDescription(`WELCOME TO THE SERVER \`@${member.user.tag}\`AUTOMATIC ROLE GIVEN`)
.setColor("ORANGE")
    .setFooter("BOT", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    let embed = new Discord.RichEmbed()
   .setTitle('SNOWLIST SYSTEM')
    giriscikiskanali.send(`》WELCOME TO THE SERVER \`@${member.user.tag}\` AUTOMATIC ROLE GIVEN《`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

  //let embed = new Discord.RichEmbed()
   // .setTitle('OTOROL SİSTEMİ')
    //.setDescription(`》<a:DOLUYOR:623950994115395604> | SUNUCUYA HOŞGELDİN \`@${member.user.tag}\` OTOMATİK ROL VERİLDİ《`)
//.setColor("ORANGE")
    //.setFooter("HBOT", client.user.avatarURL);
  
});

client.on("guildMemberAdd", async (member) => {
      let autorole =  JSON.parse(fs.readFileSync("./jsonlar/otorol.json", "utf8"));
      let role = autorole[member.guild.id].sayi

      member.addRole(role)

});




//

client.on('ready', async () => {
   client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
  
   require("./app.js")(client);
  
  client.user.setActivity(`SnowBot List`, { type:"WATCHING" })
  
  console.log("Active!")
});

setInterval(() => {

	if (db.has('botlar') && db.has('kbotlar')) {

for (var i = 0; i < Object.keys(db.fetch('kbotlar')).length; i++) {
for (var x = 0; x < Object.keys(db.fetch('botlar')).length; x++) {
var bot = Object.keys(db.fetch('botlar'))[x]
var user = Object.keys(db.fetch('kbotlar'))[i]
if (db.has(`oylar.${bot}.${user}`)) {
   setTimeout(() => {
        db.delete(`oylar.${bot}.${user}`)
    }, require('ms')(`${client.useful.seg(db.fetch(`oylar.${bot}.${user}`), 6)}h`));
}
}
}

	}

}, 10000);

const chalk = require('chalk')

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
fs.readdir(`./komutlar/`, (err, files) => {
	let jsfiles = files.filter(f => f.split(".").pop() === "js")

	if(jsfiles.length <= 0) {
		console.log("I couldn't find any scripts!")
	} else {
		if (err) {
			console.error("Error! There is no name or aliases part of a command!")
		}
		console.log(`${jsfiles.length} command will be loaded.`)

		jsfiles.forEach(f => {
			let props = require(`./komutlar/${f}`)
			client.commands.set(props.help.name, props)
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name)
			})
			console.log(`Loaded command: ${props.help.name}`)
		})
	}
});

client.on("message", async message => {

	if (message.author.bot) return
	if (!message.content.startsWith('!')) return
	var command = message.content.split(' ')[0].slice('!'.length)
	var args = message.content.split(' ').slice(1)
	var cmd = ''

	if (client.commands.has(command)) {
		var cmd = client.commands.get(command)
	} else if (client.aliases.has(command)) {
		var cmd = client.commands.get(client.aliases.get(command))
	}

	if (cmd) {
    if (cmd.conf.permLevel === 'special') { //o komutu web yetkilileri kullanabsiln sadece diye yaptıgım bişe 
      if (client.yetkililer.includes(message.author.id) === false) {
        const embed = new Discord.RichEmbed()
					.setDescription(`Brother, you are not a WebSite representative. Don't deal with silly things!`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Insufficient Authority.")
				return
      }
    }
    
		if (cmd.conf.permLevel === 1) {
			if (!message.member.hasPermission("MANAGE_MESSAGES")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`You Need To Have manage messages Permission first then use this command.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Insufficient Authority.")
				return
			}
		}
		if (cmd.conf.permLevel === 2) {
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`You Don't Have Permission You Must Have ***KICK_MEMBERS*** Permission.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("You Don't Have Permission You Must Have ***KICK_MEMBERS*** Permission.")
				return
			}
		}
		if (cmd.conf.permLevel === 3) {
			if (!message.member.hasPermission("ADMINISTRATOR")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`You Need ***ADMINISTRATOR*** Permission To Use That Perm Lvl.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("You Need ***ADMINISTRATOR*** Permission To Use That Perm Lvl.")
				return
			}
		}
		if (cmd.conf.permLevel === 4) {
			const x = await client.fetchApplication()
      var arr = [x.owner.id, '644852897439547402', '543858517832892442', '680886252517457925']
			if (!arr.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Yetkin yetersiz.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("You Need Lvl 4 Permission To Use That Command.")
				return
			}
		}
		if (cmd.conf.enabled === false) {
			const embed = new Discord.RichEmbed()
				.setDescription(`This command is disabled.`)
				.setColor(client.ayarlar.renk)
				.setTimestamp()
			message.channel.send("This command is disabled.")
			return
		}
		if(message.channel.type === "dm") {
			if (cmd.conf.guildOnly === true) {
				const embed = new Discord.RichEmbed()
					.setDescription(`You cannot use this command in private messages.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("[You cannot use this command in private messages]")
				return
			}
		}
		cmd.run(client, message, args)
	}
});



client.on('message', function(msg) {
    if(msg.content.startsWith ('!server')) {
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(msg.guild.iconURL)
      .setTitle(`__**ServerInfo**__`)
      .addField('**اسم السيرفر**',`[** __${msg.guild.name}__ **]`,true)
      .addField('**نوع السيرفر**',`[** __${msg.guild.region}__ **]`,true)
      .addField('**عدد الاعضاء**',`[** __${msg.guild.memberCount}__ **]`,true)
      .addField('**عدد البشريين**',`[** __${msg.guild.memberCount - msg.guild.members.filter(m => m.user.bot).size}__ **]`,true)
      .addField('**عدد البوتات**',`[** __${msg.guild.members.filter(m => m.user.bot).size}__ **]`,true)
      .addField('**عدد الاعضاء الاونلاين**',`[** __${msg.guild.members.filter(m=>m.presence.status == 'online').size}__ **]`,true)
      .addField('**الرومات**',`[**${msg.guild.channels.filter(m => m.type === 'text').size}** **text | Voice** **${msg.guild.channels.filter(m => m.type === 'voice').size}**]`,true)
      .addField('**الأونـر**',`**${msg.guild.owner}**`,true)
      .addField('**ايدي السيرفر**',`[** __${msg.guild.id}__ **]`,true)
      .addField('**الرتب**',`[** __${msg.guild.roles.size}__ **]`,true)
      .addField('**تاريخ انشاء السيرفر**',`[** __${msg.guild.createdAt.toLocaleString()}__ **]`, true)
      msg.channel.send({embed:embed});
    }
  });    


client.login("Njc0Mzg5NTc2OTE1MjIyNTM2.XlcZYQ.WBugKEinErU3biKyXU8az_3j_M4") //tokeni yaz işte

process.env = {}
process.env.TOKEN = "Njc0Mzg5NTc2OTE1MjIyNTM2.XlcZYQ.WBugKEinErU3biKyXU8az_3j_M4";