// ============================================================
//
// Reset bot.
// Created on Thu Jun 14 22:00:00 2018
// Author: Prasun Roy (https://github.com/prasunroy)
// GitHub: https://github.com/prasunroy/steam-bot
//
// ============================================================


// strict mode
'use strict';

// initialize
var SteamCommunity = require('steamcommunity');
var SteamTOTP = require('steam-totp');
var fs = require('fs');
var config = require('./config');

// create steam community object
var community = new SteamCommunity();

// steam login
console.log('\nconnecting to steam.....');

community.login({
  accountName: config.accountName,
  password: config.password,
  twoFactorCode: SteamTOTP.getAuthCode(config.shared_secret)
},

function(error, sessionID, cookies, steamguard, oAuthToken) {

  // login error
  if(error)
  {
    // Steam guard mobile authenticator is already disabled.
    if(error.message === 'SteamGuard')
    {
      console.log('\nSteam Guard status.....: Steam Guard Mobile Authenticator already disabled');
      console.log('\nfinished');
      process.exit();
    }

    console.log('connection error\n');
    console.log(error);
    process.exit();
  }

  // login successful
  console.log('connected');

  // disable steam guard mobile authenticator
  community.disableTwoFactor(config.revocation_code, function(error) {

    // disable error
    if(error)
    {
      console.log('\nprocess terminated\n');
      console.log(error);
      process.exit();
    }

    // disable successful
    console.log('\nSteam Guard status.....: Steam Guard Mobile Authenticator disabled');

    // clean configurations
    fs.writeFile('config.json', JSON.stringify({}, null, '  '), function(error) {
      return;
    });

    console.log('\nfinished');
    process.exit();
  });
});
