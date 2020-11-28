const creds = require('../creds.json')

const getJWT = () => {
    const fs = require('fs')
    const jwt = require('jsonwebtoken')
    const privateKeyName = creds.private_key
    const issuer = creds.iss
    const client_id = creds.client_id
    const aud = 'https://revolut.com'
    const payload = {
    "iss": issuer,
    "sub": client_id,
    "aud": aud
    }
    const privateKey = fs.readFileSync(privateKeyName);
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60});

    return token;
  };

function extAuthCallback(result) {
    return result;
}

async function extAuth (access_token, extAuthCallback) {
    const jwt = getJWT()
    let https = require('follow-redirects').https
    let qs = require('querystring')
    const low = require('lowdb')
    const moment = require('moment')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('tokens.json')
    const tokens = low(adapter)

    let options = {
    'method': 'POST',
    'hostname': 'b2b.revolut.com',
    'path': '/api/1.0/auth/token',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
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
            if (final.error !== undefined) {
                console.log("Initial authentication:", final.error_description, "Please refresh the authentication grant on your Revolut app");
                extAuthCallback(84);
            } else {
                tokens.set('access_token', final.access_token)
                    .set('expires_in', final.expires_in)
                    .set('refresh_token', final.refresh_token)
                    .set('refresh_date', moment())
                    .write()
                extAuthCallback(1);
            }
        });
        res.on("error", function (error) {
            console.error(error);
        });
    });

    let postData = qs.stringify({
        'grant_type': 'authorization_code',
        'code': access_token,
        'client_id': creds.client_id,
        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        'client_assertion': jwt
    });

    req.write(postData);

    req.end();
};

const refreshTkn = () => {
    let https = require('follow-redirects').https;
    let qs = require('querystring');
    const creds = require('../creds.json')
    const low = require('lowdb')
    const moment = require('moment')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('tokens.json')
    const tokens = low(adapter)
    const jwt = getJWT()
    
    let options = {
      'method': 'POST',
      'hostname': 'b2b.revolut.com',
      'path': '/api/1.0/auth/token',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      'maxRedirects': 20
    };
    
    let req = https.request(options, function (res) {
      let chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        let body = Buffer.concat(chunks);
        let final = JSON.parse(body);
        if (final.error !== undefined)
            return console.log("Refresh token:", final.error_description);
        else {
            tokens.set('access_token', final.access_token)
                  .set('expires_in', final.expires_in)
                  .set('refresh_date', moment())
                  .write()
        }
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    let postData = qs.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': tokens.get('refresh_token').value(),
      'client_id': creds.client_id,
      'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      'client_assertion': jwt
    });
    
    req.write(postData);
    
    req.end();
}

const deleteWebhook = () => {
  let https = require('follow-redirects').https
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const adapter = new FileSync('tokens.json')
  const tokens = low(adapter)

  let options = {
    'method': 'DELETE',
    'hostname': 'b2b.revolut.com',
    'path': '/api/1.0/webhook',
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

    res.on("end", function (chunk) {
      let body = Buffer.concat(chunks);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  req.end();
}

const createWebhook = () => {
  deleteWebhook()
  let https = require('follow-redirects').https
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const adapter = new FileSync('tokens.json')
  const tokens = low(adapter)

  let options = {
    'method': 'POST',
    'hostname': 'b2b.revolut.com',
    'path': '/api/1.0/webhook',
    'headers': {
      'Authorization': `Bearer ${tokens.get('access_token').value()}`,
      'Content-Type': 'application/json'
    },
    'maxRedirects': 20
  };

  let req = https.request(options, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      let body = Buffer.concat(chunks);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  let postData = JSON.stringify({"url":`https://${creds.iss}/webhook`});

  req.write(postData);

  req.end();
}

exports.extAuth = extAuth;
exports.refreshTkn = refreshTkn;
exports.extAuthCallback = extAuthCallback;
exports.createWebhook = createWebhook;