const creds = require('./creds.json')
const auth = require('./api/auth')
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
const bodyParser = require('body-parser')
const prefix = creds.discordPrefix
let app = express()
let path = require('path')
let port = 8080

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const verifyAuth = () => {
    let date = moment(tokens.get('primary_autorization_date').value())
    let limit = date.add(82, 'days')
    if (moment().isAfter(limit)) {
        let chann = client.channels.cache.find(channel => channel.name === creds.monitorChannel)
        chann.send(auth.notifyOwer())
    }
}

const stayAuth = () => {
    db.read()
    tokens.read()
    let source = moment(tokens.get('refresh_date').value());
    let duration = tokens.get('expires_in').value();
    let limit = source.add(duration - 60, 'seconds');
    if (moment().isAfter(limit)) {
        function asyncRefresh() {
            return new Promise(resolve => {
                auth.refreshTkn(resolve);
            });
        }
        asyncRefresh()
    }
}

tokens.defaults({"access_token": "","expires_in": "","refresh_token": "", "refresh_date": "", "primary_autorization_date": ""})
  .write()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    stayAuth()
    verifyAuth()
    auth.createWebhook()
});

setInterval(() => {
    stayAuth()
}, 15000)

const currency_symbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
};

const monitor = (result) => {
    const channel = client.channels.cache.find(channel => channel.name === creds.monitorChannel)
    const monitorEmbed = new Discord.MessageEmbed()
    if (result.event == "TransactionCreated") {
        monitorEmbed.title = ':moneybag: New Transaction :moneybag:'
        monitorEmbed.fields = [
            {
                name: ":unlock: Transaction ID",
                value: '```' + result.data.id + '```'
            },
            {
                name: ":moneybag: Amount",
                value: '```' + result.data.legs[0].amount + ' ' + currency_symbols[result.data.legs[0].currency] + '```'
            },
            {
                name: ":envelope: Reference",
                value: '```' + result.data.reference + '```'
            },
            {
                name: ":mailbox: State",
                value: '```' + result.data.state + '```'
            },
            {
                name: ":dollar: Updated balance",
                value: '```' + result.data.legs[0].balance + ' ' + currency_symbols[result.data.legs[0].currency] + '```'
            }
            ]
    } else if (result.event == "TransactionStateChanged") {
        monitorEmbed.title = ':moneybag: Transaction updated :moneybag:'
        monitorEmbed.fields = [
            {
                name: ":unlock: Transaction ID",
                value: '```' + result.data.id + '```'
            },
            {
                name: ":outbox_tray: Old state",
                value: '```' + result.data.old_state + '```'
            },
            {
                name: ":inbox_tray: New state",
                value: '```' + result.data.new_state + '```'
            }
            ]
    }
    channel.send(monitorEmbed)
}

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
        //db.set('access_token', access_token).write()
        tokens.read()
        tokens.set('primary_autorization_date', moment()).write()
        console.log("Access Token successfully refreshed")
    }
    else
        res.send({error: "Please specify an access token"})
})

app.use(bodyParser.json())

app.post('/webhook', (req, res, next) => {
    monitor(req.body)
    res.status(201).json({
      message: 'Event successfully sended'
    });
  });

app.listen(port, () =>  { 
    console.log('Express started')
})

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