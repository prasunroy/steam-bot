// ============================================================
//
// Steam bot.
// Created on Thu Jun 14 22:00:00 2018
// Author: Prasun Roy (https://github.com/prasunroy)
// GitHub: https://github.com/prasunroy/steam-bot
//
// ============================================================


// strict mode
'use strict';

// initialize
var SteamUser = require('steam-user');
var SteamCommunity = require('steamcommunity');
var SteamTradeOfferManager = require('steam-tradeoffer-manager');
var SteamTOTP = require('steam-totp');
// var fs = require('fs');
var database = require('./database');

try {
  var config = require('./config');
}
catch(error) {
  var config = {
    accountName: process.env.ACCOUNT_NAME,
    password: process.env.PASSWORD,
    shared_secret: process.env.SHARED_SECRET,
    identity_secret: process.env.IDENTITY_SECRET,
    admin: process.env.ADMIN
  };
}

// create a steam client
var client = new SteamUser();

// create a steam community object
var community = new SteamCommunity();

// create a steam trade offer manager
var manager = new SteamTradeOfferManager({
  steam: client,
  language: 'en'
});

// poll information
// if(fs.existsSync('polldata.json')) {
//   manager.pollData = JSON.parse(fs.readFileSync('polldata.json'));
// }

// steam login
console.log('connecting to steam account...');

client.logOn({
  accountName: config.accountName,
  password: config.password,
  twoFactorCode: SteamTOTP.getAuthCode(config.shared_secret)
});

// login successful
client.on('loggedOn', function(details, parental) {

  console.log('connected\n');
  console.log('SteamID2R :', client.steamID.getSteam2RenderedID());
  console.log('SteamID3R :', client.steamID.getSteam3RenderedID());
  console.log('SteamID64 :', client.steamID.getSteamID64());

  // set persona state to online
  client.setPersona(SteamUser.EPersonaState.Online);

  // acknowledge admin
  client.chatMessage(config.admin, 'Yo! I am now online.');
});

// login error
client.on('error', function(error) {

  console.log('connection error\n');
  console.log(error);
});

// account information
client.on('accountInfo', function(name, country, authedMachines, flags, fbID, fbName) {

  console.log('SteamName :', name);
  console.log('SteamDevs :', authedMachines);
});

// account limitations
client.on('accountLimitations', function(limited, communityBanned, locked, canInviteFriends) {

  console.log('IsLimited :', limited);
  console.log('IsCBanned :', communityBanned);
  console.log('IsSLocked :', locked);
  console.log('CanInvite :', canInviteFriends);
});

// web session
client.on('webSession', function(sessionID, cookies) {

  community.setCookies(cookies);

  manager.setCookies(cookies, null, function(error) {

    // failed to obtain steam api key
    if(error) {
      console.log('\nError: Failed to Obtain Steam API Key\n');
      console.log(error);
      process.exit();
      return;
    }
  });
});

// admin commands
client.on('friendMessage#' + config.admin, function(steamID, message) {

  console.log('--------------------------------------------------------------------------------');
  console.log('AdminsCmd :', steamID.getSteam3RenderedID(), message);

  var command = message.toLowerCase();

  // GIVE AN AUTHENTICATION CODE
  if(command === '!authcode') {
    // generate an authentication code
    var authCode = SteamTOTP.getAuthCode(config.shared_secret);

    // send the authentication code to admin
    client.chatMessage(config.admin, authCode);
  }

  // SEND INVENTORY ITEMS TO ADMIN
  // [1] STEAM ITEMS
  else if(command === '!send steam items') {
    sendTradeOffer(steamID, 753, 6);
  }

  // [2] TEAM FORTRESS 2 ITEMS
  else if(command === '!send tf2 items') {
    sendTradeOffer(steamID, 440, 2);
  }

  // [3] DOTA 2 ITEMS
  else if(command === '!send dota2 items') {
    sendTradeOffer(steamID, 570, 2);
  }

  // [4] COUNTER-STRIKE GLOBAL OFFENSIVE ITEMS
  else if(command === '!send csgo items') {
    sendTradeOffer(steamID, 730, 2);
  }

  // UNKNOWN COMMAND
  else {
    // acknowledge admin
    client.chatMessage(config.admin, 'Sorry! I didn\'t understand that.');
  }
});

// process a received trade offer
manager.on('newOffer', function(offer) {

  console.log('--------------------------------------------------------------------------------');
  console.log(`StatusMsg : Received new trade offer #${offer.id} from ${offer.partner.getSteam3RenderedID()}`);
  
  processTradeOffer(offer);
})

// sent trade offer changed
manager.on('sentOfferChanged', function(offer, oldState) {

  console.log(`StatusMsg : Trade Offer #${offer.id} updated [${SteamTradeOfferManager.ETradeOfferState[oldState]} -> ${SteamTradeOfferManager.ETradeOfferState[offer.state]}]`);
});

// received trade offer changed
manager.on('receivedOfferChanged', function(offer, oldState) {

  console.log(`StatusMsg : Trade Offer #${offer.id} updated [${SteamTradeOfferManager.ETradeOfferState[oldState]} -> ${SteamTradeOfferManager.ETradeOfferState[offer.state]}]`);
});

// update the poll information
// manager.on('pollData', function(pollData) {

//   fs.writeFile('polldata.json', JSON.stringify(pollData));
// });


// send a trade offer
function sendTradeOffer(steamID, appID, contextID) {

  // load inventory
  console.log('StatusMsg : Loading intentory...');

  manager.getInventoryContents(appID, contextID, true, function(error, inventory, currencies) {

    // failed to load inventory
    if(error) {
      console.log('\nError: Failed to load inventory\n');
      console.log(error);
      return;
    }

    // empty inventory
    if(inventory.length === 0) {
      console.log('StatusMsg : No tradable items found in inventory');

      // acknowledge admin
      client.chatMessage(config.admin, 'Sorry! I don\'t have any item to send.');

      return;
    }

    // inventory loaded
    console.log('StatusMsg : Total ' + inventory.length + ' tradable items found in inventory');

    // create a trade offer
    var offer = manager.createOffer(steamID);
    offer.addMyItems(inventory);

    // send the trade offer
    offer.send(function(error, status) {

      // failed to send the trade offer
      if(error) {
        console.log('\nError: Failed to send the trade offer\n');
        console.log(error);
        return;
      }

      // the trade offer is sent but needs confirmation
      else if(status === 'pending') {
        console.log('StatusMsg : The trade offer is sent but needs confirmation');

        // confirm the trade offer
        community.acceptConfirmationForObject(config.identity_secret, offer.id, function(error) {

          // failed to confirm the trade offer
          if(error) {
            console.log('\nError: Failed to confirm the trade offer\n');
            console.log(error);
            return;
          }

          // the trade offer is confirmed
          else {
            console.log('StatusMsg : The trade offer is confirmed');

            // acknowledge admin
            client.chatMessage(config.admin, 'Yo! I have sent you ' + inventory.length + ' items.');

            return;
          }
        });
      }

      // the trade offer is sent successfully
      else {
        console.log('StatusMsg : The trade offer is sent');

        // acknowledge admin
        client.chatMessage(config.admin, 'Yo! I have sent you ' + inventory.length + ' items.');

        return;
      }
    });
  });
}


// process a received trade offer
function processTradeOffer(offer) {

  // unconditionally decline trade offers if glitched or in escrow
  if(offer.isGlitched() || offer.state === 11) {
    console.log(`StatusMsg : Received invalid trade offer #${offer.id}`);
    declineTradeOffer(offer);
  }

  // unconditionally accept a trade offer from admin
  else if(offer.partner.getSteamID64() === config.admin) {
    console.log(`StatusMsg : Received trade offer #${offer.id} from admin`);
    acceptTradeOffer(offer);
  }

  // trade offer from others
  else {
    var itemsToGive = offer.itemsToGive;
    var itemsToReceive = offer.itemsToReceive
    var outgoingValue = 0;
    var incomingValue = 0;

    // calculate total value of outgoing items
    for(var i in itemsToGive) {
      var item = itemsToGive[i].market_hash_name;
      if(database[item]) {
        outgoingValue += database[item].sell;
      }
      else {
        outgoingValue += 99999999;
      }
    }

    // calculate total value of incoming items
    for(var i in itemsToReceive) {
      var item = itemsToReceive[i].market_hash_name;
      if(database[item]) {
        incomingValue += database[item].buy;
      }
    }

    console.log('StatusMsg : Total outgoing value is ' + outgoingValue);
    console.log('StatusMsg : Total incoming value is ' + incomingValue);

    // accept trade offer if total outgoing value is less than or equal to
    // total incoming value decline otherwise
    if(outgoingValue <= incomingValue) {
      acceptTradeOffer(offer);
    }

    else {
      declineTradeOffer(offer);
    }
  }
}


// decline a trade offer
function declineTradeOffer(offer) {

  offer.decline(function(error) {

    // failed to decline the trade offer
    if(error) {
      console.log(`\nError: Failed to decline the trade offer #${offer.id}\n`);
      console.log(error);
      return;
    }

    // the trade offer is declined
    else {
      console.log(`StatusMsg : The trade offer #${offer.id} is declined`);
      return;
    }
  });
}


// accept a trade offer
function acceptTradeOffer(offer) {

  offer.accept(false, function(error, status) {

    // failed to accept the trade offer
    if(error) {
      console.log(`\nError: Failed to accept the trade offer #${offer.id}\n`);
      console.log(error);
      return;
    }

    // the trade offer is accepted but needs confirmation
    else if(status === 'pending') {
      console.log(`StatusMsg : The trade offer #${offer.id} is accepted but needs confirmation`);

      // confirm the trade offer
      community.acceptConfirmationForObject(config.identity_secret, offer.id, function(error) {

        // failed to confirm the trade offer
        if(error) {
          console.log(`\nError: Failed to confirm the trade offer #${offer.id}\n`);
          console.log(error);
          return;
        }

        // the trade offer is confirmed
        else {
          console.log(`StatusMsg : The trade offer #${offer.id} is confirmed`);
          return;
        }
      });
    }

    // the trade offer is accepted successfully
    else {
      console.log(`StatusMsg : The trade offer #${offer.id} is accepted`);
      return;
    }
  });  
}
