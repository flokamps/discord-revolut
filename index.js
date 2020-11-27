const creds = require('./creds.json')
const auth = require('./auth')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('tokens.json')
const tokens = low(adapter)
const moment = require('moment')

tokens.defaults({"access_token": "","expires_in": "","refresh_token": "", "refresh_date": ""})
  .write()

if (!tokens.get('access_token').value())
    auth.extAuth(creds.access_token);
else {
    let source = moment(tokens.get('refresh_date').value());
    let duration = tokens.get('expires_in').value();
    let limit = source.add(duration - 60, 'seconds');
    if (moment().isAfter(limit))
        auth.refreshTkn()
}