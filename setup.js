// ============================================================
//
// Setup bot.
// Created on Thu Jun 14 22:00:00 2018
// Author: Prasun Roy (https://github.com/prasunroy)
// GitHub: https://github.com/prasunroy/steam-bot
//
// ============================================================


// strict mode
'use strict';

// initialize
var SteamCommunity = require('steamcommunity');
var ReadLine = require('readline');
var fs = require('fs');

// create steam community object
var community = new SteamCommunity();

// create input output interface
var readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\nstarting setup..........\n');

// input steam account credentials
readline.question('Steam Username.........: ', function(accountName) {
  readline.question('Steam Password.........: ', function(password) {
    steamLogin(accountName, password);
  });
});

// steam login
function steamLogin(accountName, password, steamguard, authCode, twoFactorCode, captcha) {

  console.log('\nconnecting to steam.....');

  community.login({
    accountName: accountName,
    password: password,
    steamguard: steamguard,
    authCode: authCode,
    twoFactorCode: twoFactorCode,
    captcha: captcha
  },

  function(error, sessionID, cookies, steamguard, oAuthToken) {

    // login error
    if(error)
    {
      // Steam guard mobile authenticator is already enabled.
      if(error.message === 'SteamGuardMobile')
      {
        console.log('\nSteam Guard status.....: Steam Guard Mobile Authenticator already enabled');
        console.log('\nsetup aborted');
        process.exit();
        return;
      }

      // Steam guard authentication code is sent to registered email. Enter the
      // code and retry login.
      else if(error.message === 'SteamGuard')
      {
        console.log('\nSteam Guard status.....: authentication code sent to registered email');
        readline.question('Authentication code....: ', function(authCode) {
          steamLogin(accountName, password, steamguard, authCode);
        });
        return;
      }

      // Steam guard authentication requires a captcha. Enter the captcha and
      // retry login.
      else if(error.message === 'CAPTCHA')
      {
        console.log('\nSteam Guard status.....: captcha required for authentication');
        readline.question('Enter CAPTCHA..........: ', function(captcha) {
          steamLogin(accountName, password, steamguard, authCode, twoFactorCode, captcha);
        });
        return;
      }

      console.log('\nsetup aborted\n');
      console.log(error);
      process.exit();
      return;
    }

    // login successful
    console.log('connected');

    // enable steam guard mobile authenticator
    community.enableTwoFactor(function(error, response) {

      // error sending confirmation code
      if(error)
      {
        console.log('\nsetup aborted\n');
        console.log(error);
        process.exit();
        return;
      }

      // success sending confirmation code
      sgmaActivate(accountName, password, response);
    });
  });
}

// activate steam guard mobile authenticator
function sgmaActivate(accountName, password, response) {

  console.log('\nSteam Guard status.....: confirmation code sent to registered phone');
  readline.question('Enter SMS code.........: ', function(activationCode) {
    community.finalizeTwoFactor(response.shared_secret, activationCode, function(error) {

      // confirmation error
      if(error)
      {
        if(error.message === 'Invalid activation code')
        {
          console.log('Steam Guard status.....: invalid SMS code');
          sgmaActivate(accountName, password, response);
          return;
        }

        console.log('\nsetup aborted\n');
        console.log(error);
        process.exit();
        return;
      }

      // confirmation successful
      else
      {
        console.log('Steam Guard status.....: Steam Guard Mobile Authenticator enabled\n');

        response.accountName = accountName;
        response.password = password;

        readline.question('Admin SteamID64........: ', function(admin) {
          response.admin = admin;

          // save configurations
          console.log('\nsaving configurations...');

          fs.writeFile('config.json', JSON.stringify(response, null, '  '), function(error) {

            // save error
            if(error)
            {
              console.log('failed');
              console.log('\nWARNING: FOLLOWING SETUP CONFIGURATIONS MUST BE RETAINED MANUALLY\n');
              console.log(response);
            }

            // save successful
            else
            {
              console.log('saved');
            }

            console.log('\nsetup finished');
            process.exit();
            return;
          });
        });
      }
    });
  });
}
