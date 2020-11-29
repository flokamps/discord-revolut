![Logo](https://i.imgur.com/r2sBGZM.png)

# Installation of this integration

## Prerequisite
- Docker v19+
- Node.JS v14+
- Git v2+

## Revolut configuration
First, clone this repo
```sh
git clone https://github.com/RootMestudy/discord-revolut.git
```
and go in the folder.
```sh
cd discord-revolut
```
Now, generate a new pair of SSH keys
```sh
openssl genrsa -out privatekey.pem 1024
openssl req -new -x509 -key privatekey.pem -out publickey.cer -days 1825
```


Next, go on [this page](https://business.revolut.com/settings/api) and create and add a certificate.

- Name: name the certificate as you want
- X509 Public key: Copy your `publickey.cer` and paste it on this field
- Oauth Redirect URI: Public adress IP of your server (ex: https://50.66.23.54/) (DON'T FORGET THE HTTPS)

Next click continue.

## Discord bot configuration
Moove the `creds.json.example` to `creds.json`
```sh
mv creds.json.example creds.json
```
then modify this creds.json
```sh
sudo nano creds.json
```
```json
{
    "private_key": "privatekey.pem",
    "client_id": "Your Revolut certificate ClientId",
    "iss": "Your server IP with port 8080 ex: 50.66.23.54:8080",
    "discordToken": "Your Discord bot Token",
    "discordPrefix": "!",
    "monitorChannel": "The Discord channel you want to monitor transactions ex: monitor-account",
}
```
Save your file and exit.

## Getting up
### IN CONSTRUCTION