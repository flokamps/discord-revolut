const infos = require('../api/infos')
const Discord = require('discord.js')

let currency_symbols = {
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

function componentToHex(c) {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

module.exports = {
	name: 'accounts',
	description: 'Display all your accounts',
	async execute(message, args) {
		function asyncAccounts() {
			return new Promise(resolve => {
			  infos.accounts(resolve);
			});
		}

		let accounts = await asyncAccounts()
		accounts.forEach(element => {
			let money = element.balance
			let g = Math.round(255*money/10000)
			let r = Math.round(255-g)
			let accountEmbed = new Discord.MessageEmbed()
			accountEmbed.color = rgbToHex(r, g, 0)
			accountEmbed.fields = [
				{
					name: ":unlock: Account ID",
					value: element.id
				},
				{
					name: ":man_raising_hand: Account name",
					value: element.name
				},
				{
					name: ":moneybag: Account balance",
					value: element.balance + currency_symbols[element.currency]
				}
				]
			message.channel.send(accountEmbed);
		});
	},
};