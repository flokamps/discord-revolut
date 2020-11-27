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
const client = new Discord.Client()
const express = require('express')
let app = express()
let path = require('path')
let port = 8080

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
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });

client.login(creds.discordToken);