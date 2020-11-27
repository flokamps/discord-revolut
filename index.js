const creds = require('./creds.json')
const auth = require('./auth')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('tokens.json')
const tokens = low(adapter)
const moment = require('moment')
const Discord = require('discord.js');
const client = new Discord.Client();

const stayAuth = () => {
    if (!tokens.get('access_token').value())
        auth.extAuth(creds.access_token);
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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });

client.login(creds.discordToken);