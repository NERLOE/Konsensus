#!/usr/bin/env node

const express = require("express");
const path = require("path");
const app = express();
//const mysql = require("mysql");

const gameCodeLength = 5;
var games = [];

app.use(express.static(path.join(__dirname, "client/build")));

function getGameFromID(id) {
	var game = null;
	games.forEach(g => {
		if (g.id == id) {
			game = g;
		}
	});

	return game;
}

function getPlayerFromGameWithID(game, id) {
	var player = null;
	game.players.forEach(p => {
		if (p.id == id) {
			player = p;
		}
	});

	return player;
}

function getPlayerFromGameWithIDOrName(game, pt) {
	var player = null;
	game.players.forEach(p => {
		if (p.id == pt || p.name == pt) {
			player = p;
		}
	});

	return player;
}

app.put("/api/game/addPlayer/:id/:name", (req, res) => {
	var gameID = req.params.id;
	var name = req.params.name;
	var game = getGameFromID(gameID);

	var player = {
		id: game.players.length + 1,
		name: name,
		stats: {
			points: 0
		}
	};

	game.players.push(player);

	updateGame(game, gameID);

	res.json(player);
});

function updateGame(game, id) {
	games = games.filter((v, i, arr) => {
		return v.id != id;
	});

	games.push(game);
}

app.put("/api/game/removePlayer/:gameID/:playerID", (req, res) => {
	var gameID = req.params.gameID;
	var game = getGameFromID(gameID);
	var player = getPlayerFromGameWithID(gameID, req.params.playerID);

	game = game.players.filter((v, i, arr) => {
		return v.id != player.id;
	});

	updateGame(game, gameID);

	res.json(player);
});

app.put("/api/game/create", (req, res) => {
	var randomString = Math.random()
		.toString(36)
		.slice(-gameCodeLength)
		.toUpperCase();

	var game = {
		id: randomString,
		players: [],
		time: 60 * 15,
		started: false
	};

	games.push(game);
	res.json(game);
});

app.put("/api/game/delete/:id", (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.json({ error: "ID er ikke defineret." });
		return;
	}

	var game = null;
	games.forEach(g => {
		if (id == g.id) {
			game = g;
		}
	});

	if (game == null) {
		res.json({ error: "Spillet med dette ID findes ikke!" });
		return;
	}

	games = games.filter((v, i, arr) => {
		return v.id != id;
	});

	res.json({ success: "Spillet blev slettet!" });
});

app.get("/api/game/getPlayer/:gameID/:player", (req, res) => {
	const gameID = req.params.gameID;
	const playerT = req.params.player;
	if (!gameID || !playerT) {
		res.json({
			error: "Spilleren eller gameID'et er ikke defineret."
		});
		return;
	}

	var game = null;
	games.forEach(g => {
		if (id == g.id) {
			game = g;
		}
	});

	if (game == null) {
		res.json({ error: "Spillet med dette ID findes ikke!" });
		return;
	}

	var player = getPlayerFromGameWithIDOrName(game, playerT);
	if (player == null) {
		res.json({
			error:
				"Spilleren med dette Navn eller ID findes ikke i spillet med id: " +
				game.id
		});
		return;
	}

	res.json(player);
});

app.get("/api/game/get/:id", (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.json({ error: "ID er ikke defineret." });
		return;
	}

	var game = { error: "Spillet med dette ID findes ikke!" };
	games.forEach(g => {
		if (id == g.id) {
			game = g;
		}
	});

	res.json(game);
});

app.get("/api/games", (req, res) => {
	res.json(games);
});

// Alle forespørgelser, som ikke er blevet brugt ovenover, bliver sendt til React.
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
	console.log(`Serveren åbnede på porten: ${port}`);
});
