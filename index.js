#!/usr/bin/env node

const express = require("express");
const path = require("path");
const app = express();
//const mysql = require("mysql");

const gameCodeLength = 5;
var games = [];

app.use(express.static(path.join(__dirname, "client/build")));

app.put("/api/createGame", (req, res) => {
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

app.put("/api/deleteGame/:id", (req, res) => {
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

	games = games.filter(function(value, index, arr) {
		return value.id != id;
	});

	res.json({ success: "Spillet blev slettet!" });
});

app.get("/api/getGame/:id", (req, res) => {
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

app.get("/api/getGames", (req, res) => {
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
