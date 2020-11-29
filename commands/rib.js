const infos = require('../api/infos')
const Discord = require('discord.js')
let countriesName = require("i18n-iso-countries")
const {flag, code, name, countries} = require('country-emoji');

module.exports = {
	name: 'rib',
	description: 'Display details of your main bank account',
	async execute(message, args) {
		function asyncRib() {
			return new Promise(resolve => {
			  infos.rib(resolve);
			});
		}
		let rib = await asyncRib()
		if (rib == 84)
			return message.channel.send("Please refresh autorization on your Revolut app");
		let country = countriesName.getName(rib[1].bank_country, "en", {select: "official"})
		let accountRib = new Discord.MessageEmbed()
		accountRib.title = ':bank: Bank account details :bank:'
		accountRib.fields = [
			{
				name: ":one: IBAN",
				value: '```' + rib[1].iban + '```'
			},
			{
				name: ":two: BIC",
				value: '```' + rib[1].bic + '```'
			},
			{
				name: ":three: Beneficiary",
				value: '```' + rib[1].beneficiary + '```'
			},
			{
				name: ":four: Beneficiary Adress",
				value: '```' + rib[1].beneficiary_address.street_line1 + ', ' + rib[1].beneficiary_address.postcode + ' ' + rib[1].beneficiary_address.city + ' ' + countriesName.getName(rib[1].beneficiary_address.country, "en", {select: "official"}) + '```'
			},
			{
				name: ":bank: Type of transfer",
				value: (rib[1].schemes[0]).toUpperCase()
			},
			{
				name: ":bank: Bank country",
				value: flag(rib[1].bank_country) + ' ' + country
			},
			{
				name: ":zap: Estimated time of a transfer",
				value: rib[1].estimated_time.min + ' - ' + rib[1].estimated_time.max + ' ' + rib[1].estimated_time.unit
			}
			]
		message.channel.send(accountRib);
	},
};