const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('tokens.json')
const tokens = low(adapter)
const Discord = require('discord.js')

function accountCallback(result) {
    return result;
}

const accounts = async (accountCallback) => {
    let https = require('follow-redirects').https;

    let options = {
    'method': 'GET',
    'hostname': 'b2b.revolut.com',
    'path': '/api/1.0/accounts',
    'headers': {
        'Authorization': `Bearer ${tokens.get('access_token').value()}`
    },
    'maxRedirects': 20
    };

    let req = https.request(options, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        let body = Buffer.concat(chunks);
        let final = JSON.parse(body);
        accountCallback(final);
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
}

exports.accounts = accounts;