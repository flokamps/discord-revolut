![Logo](https://i.imgur.com/r2sBGZM.png)

# Installation of this integration

## Prerequisite
- Node.JS v14+
- Git v2+
- NGINX
- A domain name (you can register one on Namecheap.com)
- Open ports 80 & 443 on your server

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


Next, go on [this page](https://business.revolut.com/settings/api) and create a certificate.

- Name: name the certificate as you want
- X509 Public key: Copy your `publickey.cer` and paste it on this field
- Oauth Redirect URI: The domain name of your server (ex: https://test.floriankamps.fr/) (DON'T FORGET THE HTTPS)

Next click continue.
#### !Don't enable the API for the moment!

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
    "iss": "The ISS field of your Revolut certificate",
    "discordToken": "Your Discord bot Token",
    "discordPrefix": "!",
    "monitorChannel": "The Discord channel you want to monitor transactions ex: monitor-account",
}
```
Save your file and exit.

## Getting up
##### Go on your domain name's provider website and point a `A` registration to your IP adress

Modify the `default` file
```sh
sudo nano /etc/nginx/sites-available/default
```

```
upstream backend_discord_revolut{
    server 127.0.0.1:8080;
}

server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # SSL configuration
        #
        # listen 443 ssl default_server;
        # listen [::]:443 ssl default_server;

        root /path/to/your/discord-revolut (for me it's /home/euser/discord-revolut);

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name <your-domain-name>;

        location / {
        include proxy_params;
        proxy_pass http://backend_discord_revolut;
        }
        location /webhook {
        include proxy_params;
        proxy_pass http://backend_discord_revolut;
        }
```
Reload nginx
```sh
sudo systemctl reload nginx
```
Install SSL certificate
```sh
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx
```
Select your domain name then
```sh
sudo certbot renew --dry-run
```

### Startup the bot and autorize Revolut

So now, we've configured Nginx. We are ready to startup the bot!

Install dependencies
```
npm i
```
And startup!
```
node index.js
```

When the bot is up, go to your Revolut certificate page and "Enable API access to your account".
That's it! Your integration is ready to use! You can try to make the `!ping` command to ping the bot

## Contributions

Feel free to contribute to this project by fork and pull request this repo!

## Donations
<a href="https://www.buymeacoffee.com/rootmeih"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=rootmeih&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>