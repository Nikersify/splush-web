# splush-web

code behind https://splush.nikerino.com

see the splush-cli repo [here](https://github.com/nikersify/splush-cli)

# api

endpoint: `https://splush.nikerino.com`

### `POST /:key/:msg?` or `GET /:key/:msg?`

create a new push notification with the given `key`, optionally with a `msg`.

# running

```bash
$ git clone https://github.com/nikersify/splush-web.git
$ cd splush-web
$ npm install
$ cp config.example.json config.json
$ $EDITOR config.json
$ npm start # for production: NODE_ENV=PRODUCTION npm start
```

# license

MIT
