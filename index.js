const creds = require('./creds.json')
const auth = require('./auth')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('tokens.json')
const adapter2 = new FileSync('creds.json')
const db = low(adapter2)
const tokens = low(adapter)
const moment = require('moment')
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const express = require('express')
const prefix = creds.discordPrefix
let app = express()
let path = require('path')
let port = 8080

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const stayAuth = () => {
    db.read()
    tokens.read()
    if (!tokens.get('access_token').value())
        auth.extAuth(db.get('access_token').value());
    else {
        let source = moment(tokens.get('refresh_date').value());
        let duration = tokens.get('expires_in').value();
        let limit = source.add(duration - 60, 'seconds');
    if (moment().isAfter(limit))
        auth.refreshTkn()
    }
}

tokens.defaults({"access_token": "","expires_in": "","refresh_token": "", "refresh_date": ""})
  .write()

stayAuth()

setInterval(() => {
    stayAuth()
}, 15000)

function asyncExtAuth(access_token) {
    return new Promise(resolve => {
      auth.extAuth(access_token, resolve);
    });
}
app.get('/', async function(req, res) {
    const access_token = req.query.code;
    if (access_token) {
        let authentication = await asyncExtAuth(access_token);
        if (authentication == 84)
            return res.send({error: "Please give a valid access_token"});
        res.sendFile(path.join(__dirname + '/success_page/index.html'));
        db.set('access_token', access_token).write()
        console.log("Access Token successfully refreshed")
    }
    else
        res.send({error: "Please specify an access token"})
})

app.listen(port, () =>  { 
    console.log('Express started')
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot || !msg.member.roles.cache.find(r => r.name === "Admin")) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
  });

client.login(creds.discordToken);