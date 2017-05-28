/**
 * Commands
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains the base commands for Cassius.
 *
 * @license MIT license
 */

'use strict';

let commands = {
	// Developer commands
	js: 'eval',
	eval: function (target, room, user) {
		if (!user.isDeveloper()) return;
		try {
			target = eval(target);
			this.say(JSON.stringify(target));
		} catch (e) {
			this.say(e.name + ": " + e.message);
		}
	},

	// Informational commands
	about: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say(Config.username + " code by sirDonovan: https://github.com/sirDonovan/Cassius with additions made by Spooktune~");
	},
	
	beep: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("boop");
	},

	argbeep: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		Client.send("/me boops" + arg);
	},
	
	intro: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		Client.send("scrabble|!htmlbox <div>Welcome to Scrabble! <li><a href='https://docs.google.com/document/d/1tUmTwieP-cdfaThcVVULmpa-4G_yVu6sXs_W7947o1U/edit'>Room Rules</a></li> <li> <a href='https://docs.google.com/document/d/1NrWGokTArxCd0GXeKMf3oWEZb7wDcRA7U9g_6uWPm9s/edit'>Scrabblemon Rules</a></li> <li><a href='https://pastebin.com/Grcz7NUQ'>Userhosted Games</a></li></ul></div>");
	},
	
	lingo: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("/wall " + arg + " is hosting a Scrabgame of Lingo! Use ``/me in`` to join!");
		this.say("The host selects a 5 letter word and reveals the first letter, players then guess possible answers. The word is Codes, so it would be C _ _ _ _. If Couch is guessed, it would then be C O _ _ _. Game Guide: https://docs.google.com/document/d/19VF4pRtkIMx9PEySWQShXr_NwCWZp17h1K_eUlcSBcU/edit?usp=sharing")
	},
	
	ww: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("/wall " + arg + " is hosting a Scrabgame of Watchog's Words! Use ``/me in`` to join!");
		this.say("Players receive 9 letters and must PM the host a word that can be formed using these letters. Points are awarded based on the length of the word. Game Guide: https://docs.google.com/document/d/1Rt2a-H1eXiMo2eqRMbLbtp-xHx_93XWGARXeX8INcnI/edit?usp=sharing")
	},
	
	wl: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("/wall " + arg + " is hosting a Scrabgame of Word Ladder! Use ``/me in`` to join!");
		this.say("Players are presented with a 4 letter word, and they may only change one letter to make a new word! CAPE - CAVE - COVE - CONE - CORE. Game Guide: https://docs.google.com/document/d/1iljWB7LpaIbW3p2c_tm2HlYnzlBp01mcgdQNFEAcz_E/edit?usp=sharing")
	},
	
	win: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("The winner is " + arg + "! Thanks for playing!")
		Client.send("scrabble|/mn Gamewinner: " + arg)
	},
	
	end: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("The game was ended.")
	},
	roomdesc: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		Client.send("scrabble|!htmlbox <div>Play Scrabble with friends, participate in or host fun Word Games, and compete in the exciting new Scrabblemons metagame!</div>");
	},
	
	nt: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("this is why I don't play with timer.");
	},
	
	//client.send("scrabble|/mn	
	// Game commands
	signups: 'creategame',
	creategame: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		if (!Config.games || !Config.games.includes(room.id)) return this.say("Games are not enabled for this room.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
	},
	start: 'startgame',
	startgame: function (target, room, user) {
		if (!room.game || !user.hasRank(room, '+')) return;
		room.game.start();
	},
	end: 'endgame',
	endgame: function (target, room, user) {
		if (!room.game || !user.hasRank(room, '+')) return;
		room.game.forceEnd();
	},
	join: 'joingame',
	joingame: function (target, room, user) {
		if (!room.game) return;
		room.game.join(user);
	},
	leave: 'leavegame',
	leavegame: function (target, room, user) {
		if (!room.game) return;
		room.game.leave(user);
	},

	// Storage commands
	bits: 'points',
	points: function (target, room, user) {
		if (room !== user) return;
		let targetUserid = target ? Tools.toId(target) : user.id;
		let points = [];
		user.rooms.forEach((rank, room) => {
			if (!(room.id in Storage.databases) || !('leaderboard' in Storage.databases[room.id])) return;
			if (targetUserid in Storage.databases[room.id].leaderboard) points.push("**" + room.id + "**: " + Storage.databases[room.id].leaderboard[targetUserid].points);
		});
		if (!points.length) return this.say((target ? target.trim() + " does not" : "You do not") + " have points on any leaderboard.");
		this.say(points.join(" | "));
	},

};

module.exports = commands;
