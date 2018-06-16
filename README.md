# Steam Bot
**An automated steam trading bot.**
<img align='right' height='100' src='https://github.com/prasunroy/steam-bot/blob/master/assets/logo.png' />

![badge](https://github.com/prasunroy/steam-bot/blob/master/assets/badge_1.svg)
![badge](https://github.com/prasunroy/steam-bot/blob/master/assets/badge_2.svg)

## Installation
#### Step 1: Install [Node.js](https://nodejs.org/en/download)
>Note: This application requires Node.js 6.0.0 or later and npm 5.5.0 or later.
#### Step 2: Clone repository
```
git clone https://github.com/prasunroy/steam-bot.git
cd steam-bot
```
#### Step 3: Install dependencies
```
npm install
```
#### Step 4: Create a file ***`config.json`*** in *steam-bot* directory with Steam account login credentials
```json
{
  "accountName": "<username>",
  "password"   : "<password>"
}
```
>Note: *`<username>`* and *`<password>`* need to be replaced by Steam account login credentials of bot.
#### Step 5: Setup bot
```
node setup
```
>Note: All ***login credentials*** and ***secret keys*** will be saved to ***config.json*** during setup. The linked Steam account can be accessed from any device using these information. Manually modifying, deleting, sharing or losing this file may lead to lose access to the linked Steam account. In such cases the only way to regain access is to contact Steam support. It is highly recommended to keep a backup of ***config.json*** in a safe location.

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
