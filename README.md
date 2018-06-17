# Steam Bot
**An automated Steam trading bot.**
<img align='right' height='100' src='https://github.com/prasunroy/steam-bot/blob/master/assets/logo.png' />

![badge](https://github.com/prasunroy/steam-bot/blob/master/assets/badge_1.svg)
![badge](https://github.com/prasunroy/steam-bot/blob/master/assets/badge_2.svg)

## Installation
#### *`A Steam account with verified email address and mobile number is required to setup bot.`*

#### Step 1: Install [Node.js](https://nodejs.org/en/download) and [npm](https://www.npmjs.com)
>**Note:** This application requires Node.js 6.0.0 or later and npm 5.5.0 or later.

#### Step 2: Clone repository
```
git clone https://github.com/prasunroy/steam-bot.git
cd steam-bot
```

#### Step 3: Install dependencies
```
npm install
```

#### Step 4: Setup bot
```
node setup
```
>**Note:** All sensitive data such as ***login credentials*** and ***secret keys*** will be written to ***config.json*** during setup. The linked Steam account can be accessed and controlled using these information. Modifying, deleting, sharing or losing this file may lead to lose access to the linked Steam account. In such cases account owner needs to contact [***Steam Support***](https://help.steampowered.com/en) to regain access. It is highly recommended to keep a backup of ***config.json***.

>**Note:** After setup account restrictions may apply in accordance with [***Steam Subscriber Agreement***](https://store.steampowered.com/subscriber_agreement).

## Usage
### Starting bot
```
npm start
```
>**Note:** Alternatively the bot can also be started with command `node bot`.

### Administrator commands
| Command | Description |
| :------ | :---------- |
| ***!authcode***         | Request a Steam Guard Mobile Authenticator code |
| ***!send steam items*** | Request all tradable Steam inventory items      |
| ***!send tf2 items***   | Request all tradable TF2 inventory items        |
| ***!send dota2 items*** | Request all tradable DOTA2 inventory items      |
| ***!send csgo items***  | Request all tradable CS:GO inventory items      |
>**Note:** These commands can be issued by bot administrator as ***Steam chat messages***.

### Managing database
On receiving a trade offer the bot will look for the price of a trade item in ***`database.json`*** by ***market hash name***. The bot can only recognize items specified in this file. The database can be managed by modifying this file while retaining the general structure.
#### Example
```json
{
  "Market hash name of item 1":
  {
    "buy" : 1,
    "sell": 2
  },
  
  "Market hash name of item 2":
  {
    "buy" : 50,
    "sell": 100
  }
}
```
>**Note:** The bot needs to be restarted after modifying the database to reflect updated prices.

### Reset bot
```
node reset
```
>**Note:** Reseting bot removes ***Steam Guard Mobile Authenticator*** from the linked Steam account.

>**Note:** After reset account restrictions may apply in accordance with [***Steam Subscriber Agreement***](https://store.steampowered.com/subscriber_agreement).

## References
>[Logo](https://github.com/prasunroy/steam-bot/raw/master/assets/logo.png) is obtained from [Pixabay](https://pixabay.com) made available under [Creative Commons CC0 License](https://creativecommons.org/publicdomain/zero/1.0/deed.en).

## License
MIT License

Copyright (c) 2018 Prasun Roy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<br />
<br />

**Made with** :heart: **and GitHub**
