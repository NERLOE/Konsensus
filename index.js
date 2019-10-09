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

const dilemmas = [
	{
		continent: "afrika",
		questions: [
			{
				question:
					"Der er kommet ekstrem fattigdom i Afrika syd for Sahara hvor både børn og voksne dør pga. deres mangel på mad og vand, men det er også pga. deres mangel på penge fordi forældrene til børnene ikke har penge nok til at betale for den medicin som børnene eller dem selv skal bruge når de bliver syge. I kan enten vælge at bruge penge til mad og vand til dem eller sende penge til dem så de kan betale for deres medicin.",
				answerOne: {
					text: "Brug penge på mad og vand",
					resultText:
						"Folk i Afrika er galde for alt det mad og vand som de har fået tilsendt af jer, men de har stadig ikke råd til medicin til deres børn eller dem selv. Selvom der er blevet færre der dør af sult eller tørst, så er der stadig nogen som dør af sygdom og bid fra dyr.",
					points: 250
				},
				answerTwo: {
					text: "Sende penge til medicin",
					resultText:
						"Folk i Afrika er begyndt at få det bedre og bedre pga. den medicin som de har fået, men medicin bliver man ikke mæt af og man får heller ikke slukket tørsten af det, nu er der ikke så mange børn og voksne som dør af sygdomme som før, men der er stadig stor mangel på mad og rent drikkevand.",
					points: 250
				}
			},
			{
				question:
					"Der er kommet meget ekstrem fattigdom i Afrika syd for Sahara og folk har ikke råd til hverken bedre huse så de har et godt sted at bo, men det er ikke alle som vil have et bedre sted at bo fordi der er mange som kan li’ det hus som de allerede bor i, men de vil bare have opgraderet deres hus, så det kan holde til vejret. Det er jer der skal bestemme om i vil bruge penge på bedre huse, som ikke kan holde til vejret, eller opgradere husene så de kan holde til vejret, men som ikke er li’ så gode at bo i.",
				answerOne: {
					text: "Brug penge på bedre huse",
					resultText:
						"Folk i Afrika har fået bedre huse som de kan bo i, men der er et problem med deres nye huse og det problem er at de ikke kan holde til naturen fx kan de ikke holde til regnvejr fordi vand kan meget nemt komme igennem deres tage på kraftigt blæsevejr kan få nogle af husene falder sammen.",
					points: 250
				},
				answerTwo: {
					text: "Brug penge på at opgradere deres gamle huse",
					resultText:
						"Folk i Afrika er glade for at der er blevet gjort noget ved deres gamle huse, fordi nu kan de bo i deres huse uden at være bange for at der vil ske noget med dem, hvis der kom en stor storm, så vil deres nye huse kunne holde til det og de skal ikke bruge penge og resurser på at bygge dem op igen.",
					points: 250
				}
			},
			{
				question:
					"Du har en masse fødevare som du skal flyve ud til et land der har brug for det. To lande som virkelig har brug mad er Uganda og Yemen, men du har kun tid til at nå til et af landene. Hvilket land vil du vælge? ",
				answerOne: {
					text: "Uganda",
					resultText:
						"De indfødte i Uganda er rigtig taknemmelige for dit valg.",
					points: 250
				},
				answerTwo: {
					text: "Yemen",
					resultText:
						"De indfødte i Yemen er rigtig taknemmelige for dit valg.",
					points: 250
				}
			},
			{
				question:
					"Du skal sende mad til et land som har brug for det. Du får at vide at vide at du kan enten bruge lidt penge og give dem dåsemad. Eller du kan bruge mange penge og give dem godt økologisk mad.",
				answerOne: {
					text: "Lidt penge... dåsemad",
					resultText:
						"De indfødte er rigtig glad for maden, men kunne godt have brugt noget bedre.",
					points: 100
				},
				answerTwo: {
					text: "Mange penge... økologisk mad",
					resultText:
						"De indfødte i landet er rigtig taknemmelige for dit valg.",
					points: 250
				}
			},
			{
				question:
					"Rundt omkring i de forskellige lande som er under udvikling (også kaldt for Uland) mangler resurser til forskning i vacciner og medicin som gør børnedødeligheden mindre, men også så færre kvinder dør under fødslen, men i har kun råd til at betale for resurserne til for mindskning af børnedødeligheden eller så færre kvinder dør under fødslen. Grunden til at der er så mange der dør er fordi i Afrika syd for Sahara er AIDS den største dødsårsag og de hærges af HIV-epidemien.",
				answerOne: {
					text: "Forsk i medicin til børn",
					resultText:
						"Børnedødeligheden i de forskellige Ulande bliver mindre og mindre, men det samme kan man ikke sige om de kvinder som dør under fødslen, i nogle lande er der stadig lige så mange kvinder der dør under fødslen, hvis ikke flere.",
					points: 200
				},
				answerTwo: {
					text: "Forsk i medicin til kvinder",
					resultText:
						"Der bliver langsomt færre og færre kvinder som dør under fødslen, men selvom der er færre kvinder som dør, så er der stadig mange børn som der i en tidlig alder som gør at børnedødeligheden som gør at børnedødeligheds procenten bliver hvor den er, men det kan ende med at den bliver højere og højere.",
					points: 200
				}
			},
			{
				question:
					"Med alle de mange dyr som der er rundt omkring i Afrika, så er der en stor chance for at nogle af deres krybdyr er giftige og hvis der er nogen som bliver bidt af nogle af de her giftige dyr, så skal de have noget medicin, men i kan kun bruge penge på at lave medicin imod giftige edderkopper, eller giftige slanger.",
				answerOne: {
					text: "Lav medicin imod giftige edderkopper",
					resultText:
						"Ved hjælp af jeres modgift, er der færre og færre der dør til de giftige edderkopper, men der er et lille problem med jeres modgift, er at folk i Afrika er blevet mere sårbare over for slangernes gift, hvilket vil sige at de vil dø inde for kort tid, hvis de bliver bidt af en giftig slange.",
					points: 200
				},
				answerTwo: {
					text: "Lav en medicin imod giftige slanger",
					resultText:
						"Ved hjælp af jeres modgift er der færre og færre der dør til de giftige slanger, men der er et lille problem med jeres modgift og det er at folk i Afrika er mere sårbare over edderkoppernes gift, hvilket vil sige at de vil dø efter et kort stykke tid, hvis de bliver bidt af en giftig edderkop. ",
					points: 200
				}
			}
		]
	},
	{
		continent: "nordamerika",
		questions: [
			{
				question:
					"Der er for mange skoleskyderier i USA, flere eller færre pistoler?",
				answerOne: {
					text: "Flere",
					resultText:
						"Spade! Der skal selvfølgelig ikke sælges fleres pistoler, det ville tydeligvis gøre situationen værre.",
					points: 0
				},
				answerTwo: {
					text: "Færre",
					resultText:
						"Godt arbejde, selvfølgelig skal der fjernes pistoler og laves et system for at undgå alle de massemord.",
					points: 400
				}
			},
			{
				question:
					"Der er mange kvinder der oplever seksuelt og normale overgreb, vil du vælge at sætte fængselsstraffen op for at få færre til at begå det eller vælger du at lade straffen blive på den er?",
				answerOne: {
					text: "Forlæng straffen på overgreb",
					resultText:
						"Fantastisk der er blevet meget færrere overgreb, efter forlængelsen af straffen.",
					points: 300
				},
				answerTwo: {
					text: "Lad straffen være som den er",
					resultText: "Alt er som det plejer. Folk bliver stadig overgrebet.",
					points: 200
				}
			}
		]
	}
];

function contintentExist(continent) {
	var exist = false;
	dilemmas.forEach(c => {
		if (c.continent == continent) {
			exist = true;
		}
	});

	return exist;
}

app.get("/api/game/getRandomDilemma/:gameID/:continent", (req, res) => {
	const gameID = req.params.gameID;
	const continent = req.params.continent;

	if (!contintentExist(continent)) {
		res.json({ error: "Kontinentet " + continent + " er ikke med i spillet!" });
		return;
	}

	var dilemma = null;
	dilemmas.forEach(c => {
		if (c.continent == continent) {
			var d = c.questions[Math.floor(Math.random() * c.questions.length)];
			dilemmas = d;
		}
	});

	res.json(dilemma);
});

/* function getDilemmaFromList(list, used) {
	var d = c.questions[Math.floor(Math.random() * c.questions.length)];
	dilemmas = d;
} */

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
		if (gameID == g.id) {
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
