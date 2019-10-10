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

  return games;
}

function updatePlayer(players, player, id) {
  players = players.filter((v, i, arr) => {
    return v.id != id;
  });

  players.push(player);

  return players;
}

app.put("/api/game/removePlayer/:gameID/:playerID", (req, res) => {
  var gameID = req.params.gameID;
  var game = getGameFromID(gameID);
  var player = getPlayerFromGameWithID(game, req.params.playerID);

  game = game.players.filter((v, i, arr) => {
    return v.id != player.id;
  });

  updateGame(game, gameID);

  res.json(player);
});

app.get("/api/game/addPoints/:gameID/:playerID/:points", (req, res) => {
  var gameID = req.params.gameID;
  var game = getGameFromID(gameID);

  if (game == null) {
    res.json({ error: "Spillet med dette ID findes ikke!" });
    return;
  }

  var player = getPlayerFromGameWithID(game, req.params.playerID);

  if (player == null) {
    res.json({
      error:
        "Spilleren med ID'et (" +
        req.params.playerID +
        ") findes ikke i spillet: " +
        gameID
    });
    return;
  }

  console.log(player.stats.points);
  console.log(req.params.points);

  // var newPoints = parseInt(
  // 	parseInt(player.stats.points) + parseInt(req.params.points)
  // );
  var newPoints = +player.stats.points + +req.params.points;
  console.log(newPoints);
  player.stats.points = newPoints;

  var players = updatePlayer(game.players, player, req.params.playerID);

  game.players = players;

  updateGame(game, gameID);

  res.json(game);
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
    continent: "europa",
    questions: [
      {
        question:
          "Flere og flere børn vælger af uvisse grunde, at holde sig væk fra skolen. Det vil på længere sigt blive til et stort problem, hvordan skal det løses?",
        answerOne: {
          text: "Med tvang",
          resultText:
            "Børnene kommer nu i skole, men uden nogen lyst overhovedet. Kunne være bedre med en anden mulighed...",
          points: 200
        },
        answerTwo: {
          text: "Med finansiering",
          resultText:
            "Godt du gider bruge dine penge :)), børnene går i skole nu!",
          points: 300
        }
      },
      {
        question:
          "Der er blevet mangel på skolelærere, hvilket er et problem. Vi har brug for flere skolelærere, men hvordan skal vi skaffe dem?",
        answerOne: {
          text: "Uddan flere lærere",
          resultText:
            "Flere lærere bliver nu uddannet, men det er stadig svært at uddanne lærere, når der ikke er så mange som vil være det!",
          points: 200
        },
        answerTwo: {
          text: "Importer lærere",
          resultText:
            "Lærere er nu blevet importeret og eleverne kan nu modtage undervisning igen!",
          points: 300
        }
      },
      {
        question:
          "Rundt omkring i verden bliver der begået flere og flere forbrydelser og nogle er værre end andre og politiet har en løsning til dette problem og det er at genindfører dødsstraf i de lande hvor der bliver begået mest forbrydelser, men synes folk ikke er en god ide, så det er p til jer. I kan enden vælge at genindfører dødsstraffen eller ej.",
        answerOne: {
          text: "Genindfør dødsstraf",
          resultText:
            "Med dødsstraffen nu genindsat er der flere og flere der får dødsstraffen for deres forbrydelser, men det er folket ikke glad for, fordi der er kommet mange flere demonstrationer rundt omkring i verden pga. Dødsstraffen er blevet genindsat og i nogle af landene er demonstrationerne blevet til borgerkrige.",
          points: 200
        },
        answerTwo: {
          text: "Ingen dødsstraf",
          resultText:
            "pga. Dødsstraffen ikke er genindsat er der ikke nogen straf for nogle af de stører forbrydelser og i nogle af landene er der blevet gået mindre forbrydelser, men der er også nogle lande hvor der kommer flere og flere forbrydelser og nogle af dem bliver værre og værre og politiet kan ikke gøre andet end at smide dem i fængsel uden nogen anden form for straf.",
          points: 300
        }
      },
      {
        question:
          "I nogle forskellige lande skal man betale for at gå i skole og ifølge nogle folk, så hvis man ikke har gået på en meget dyr skole, så mener de at dem som har gået på en billigere skole ikke kan bruge deres uddannelse til noget, så der er nogle som er kommet med et forslag om at alle skole skal koste det samme at gå på, det er nu op til jer om at bestemme og det er en god ide at alle skoler skal koste det samme eller ej. ",
        answerOne: {
          text: "Koste det samme",
          resultText:
            "Det er nu blevet nemmere for familier med ikke så mange penge at få deres børn ind på deres drømme skoler, men det har bare gjort det at de børn som kommer fra de mere rigere familier, begynder at mobbe dem som komme fra de mere fattige familier fx siger de til dem at de aldrig skulle have gået på denne skole og det gør så at der er mange som går ud af skolen fordi de ikke kan klare at blive mobbet længere.",
          points: 200
        },
        answerTwo: {
          text: "Ikke koste det samme",
          resultText:
            "Der er færre og færre elever som ikke kommer ind på deres drømme skoler fordi deres forældre ikke har nok penge til at de kan komme på deres drømme skole, hvilket vil sige at de ikke kan få den uddannelse de gerne vil have og de ikke kan få det job som de gerne vil have og derfor må de nøjes med et andet job som de ikke vil have.",
          points: 300
        }
      }
    ]
  },
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
    continent: "asien",
    questions: [
      {
        question:
          "Der er mange piger der bliver gift før de bliver 18 år gamle i ulandene, dog kan man aldrig vide hvordan et land ville tage imod en lov der forbyder noget som er meget normalt. Vil du lave en lov der forbyder at have ægteskab når man er under 18 med fængselsstraf eller vil du lade være med at lave en lov.",
        answerOne: {
          text: "Forbyd ægteskab under 18",
          resultText:
            "Perfekt ægteskabet er faldet, da stodderne som vil gifte sig med de unge piger nu er forbrydere.",
          points: 400
        },
        answerTwo: {
          text: "Ingen lov",
          resultText: "Alt er som før. Ik så meget at sige.",
          points: 200
        }
      },
      {
        question:
          "Skal man fortsat kunne få spredt sin aske udover havet, hvilket forurener og fiskene der forveksler det med mad, eller skal man stoppe med at gøre det og ikke opfylde det menneskes ønske efter den tid, de har tjent landet.",
        answerOne: {
          text: "Stoppe",
          resultText: "Ingen forurening, men folk bliver sure.",
          points: 200
        },
        answerTwo: {
          text: "Fortsætte",
          resultText: "Folk er glade, men der er stadig forurening.",
          points: 200
        }
      },
      {
        question:
          "Skal man fortsætte med det, så man er sikker på at det virker, hvis man engang skal forsvare sig i krig, men det forurener vandet eller skal man stoppe med at gøre det.",
        answerOne: {
          text: "Stoppe",
          resultText:
            "Ingen forurening, men intet bliver testet og er mere farligt.",
          points: 200
        },
        answerTwo: {
          text: "Fortsætte",
          resultText: "Mere forurening, og flere bomber. Ik godt!",
          points: 200
        }
      },
      {
        question:
          "Landmændene har et stort problem med insekter og andet kryb som spiser af afgrøderne, som så kan ende med at høsten vil slå fejl og landmændene vil ikke kunne tjene nogle penge, der er to ting som I kan gøre, men I kan kun vælge én af tingene. I kan enden vælge at lave en gas som dræber insekterne, men som også er dårligt for afgrøderne eller i kan bruge penge på en gift som bliver sprøjtet ind i planterne som vil dræber insekterne når de spiser af afgrøderne, men det er også for mennesker.",
        answerOne: {
          text: "Giftgas imod insekter",
          resultText:
            "Ved hjælp af den nye giftgas er der næsten ingen insekter som spiser af afgrøderne mere, men det er ikke kun pga. den nye giftgas, men det er også fordi afgrøderne ikke kan tåle de kemikalier som er i giftgassen og de ender med at dø.",
          points: 200
        },
        answerTwo: {
          text: "Gør noget ved planterne",
          resultText:
            "Den nye gift i har sprøjtet i planter virker godt imod insekterne, men der er et lille problem og det er at det gøre andre mennesker syge, hvis de spiser af de afgrøder der er blevet sprøjtet med giften, hvilket gør at landmændene ikke vil tjene nogle penge.",
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
          "Skal vi bruge penge på billige flybilletter, men det forurener mere, dog er der penge til andre nødvendige udgifter eller købe de dyre flybilletter, som skaber mindre forurening, dog er der ikke nær så mange penge til andre nødvendige afgifter.",
        answerOne: {
          text: "Billige",
          resultText:
            "Billige biletter skaber flere flyafgange, hvilket betyder mere forurening! Det kan vi IKKE lide!",
          points: 100
        },
        answerTwo: {
          text: "Dyre",
          resultText:
            "Biletterne er nu dyrere, og det skaber mindre flyafgange, hvilket betyder mindre forurening! Det kan vi GODT lide! ;))",
          points: 400
        }
      },
      {
        question:
          "Skal vi investere i elbiler, så forureningen bliver meget mindre, dog belaster det elnettet og gør det svagere eller skal vi fortsætte med at bruge benzinbiler, hvilket forurener meget mere, til gengæld belaster det ikke elnettet.",
        answerOne: {
          text: "El-Biler",
          resultText: "Mindre forurening, el-biler for life, fuck el-nettet!",
          points: 500
        },
        answerTwo: {
          text: "Benzinbiler",
          resultText: "Lort på lort på lort på lort!",
          points: 100
        }
      },
      {
        question:
          "Skal det fortsat være lovligt at ryge, hvilket forurener luften en del, eller skal man gøre det ulovligt at ryge, så det ikke forurener, hvilket nok ville skabe rigtig meget drama. Man kunne også vælge at øge prisen på tobak.",
        answerOne: {
          text: "Lovligt og øg prisen",
          resultText: "Folk bliver sure, men mindre ryger da de ikke har råd!",
          points: 250
        },
        answerTwo: {
          text: "Ulovligt",
          resultText:
            "Mindre folk ryger, men smøger bliver solgt sort nu, ligesom stoffer!",
          points: 200
        }
      }
    ]
  },
  {
    continent: "oceanien",
    questions: [
      {
        question:
          "Det nationale mandelandshold bliver betalt mere end det kvindelige fodboldlandshold. De kvindelige spillere mener at der er sexistisk selvom det mandlige hold spiller i turneringer hvor penge præmier er større og derfor bliver betalt mere. Det kvindelige hold vinder flere kampe og klare sig bedre men holdet spiller på lavere niveau. Er det så sexistisk at give en kvinde mindre løn end en mand selvom hun arbejde mindre? Vil du give det kvindelige hold lige så mange penge som det mandlige hold da begge er fodboldhold og eller vil du lave lønnen blive det samme?",
        answerOne: {
          text: "Lige løn",
          resultText:
            "Godt valg, begge køn skal da have lige løn, vi lever i 2019!",
          points: 400
        },
        answerTwo: {
          text: "Flere penge til mændene",
          resultText:
            "Din sexcist, selvfølgelig skal begge køn have lige meget i løn... vi lever i 2019!",
          points: 100
        }
      },
      {
        question:
          "Du arbejder i en butik hvor alle arbejder er hvide. Dette her har så gjort nogen mennesker sure siden et du ikke har nogen arbejdere med etnisk baggrund, og de har ny besluttede sig for at stoppe med at handle i butikken. Du kan enten fyre nogle af dine hvide arbejdere og skift dem ud med nogen fra etnisk baggrund eller ignorer disse klager.",
        answerOne: {
          text: "Skift de hvide ud",
          resultText:
            "Din racist, selvfølgelig skal du ikke gøre hvad andre siger, når du ved det ikke er etnisk korrekt.",
          points: 100
        },
        answerTwo: {
          text: "Ignorér klagerne",
          resultText:
            "Godt valg, ignorer klagerne, så skal der sku nok komme kunder i biksen igen.",
          points: 250
        }
      },
      {
        question:
          "Du er ny formanden for et firma, hvis tidligere boss ikke gad at hyrer kvinder. På grund a det er alle arbejderne mænd, og du skal snart til at hyre en ny arbejder. Til sidst er der kun 2 kandidater tilbage. Den første kandidat er en kvinde som er lidt kvalificeret, men ville være den første kvindelig arbejder i firmaets historie. Den anden er en mand som er virkelig kvalificeret, men ved at hyre ham så ville der stadig kun være mandlige arbejdere i firmaet. Hvem ville du vælge? ",
        answerOne: {
          text: "Kvinden",
          resultText: "Godt du indføre noget kvindeligt i firmaet.",
          points: 150
        },
        answerTwo: {
          text: "Manden",
          resultText:
            "Stadig kun mænd i firmaet, men altsååå ny medarbejder, som kan sit shiiit.",
          points: 150
        }
      }
    ]
  },
  {
    continent: "sydamerika",
    questions: [
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
      },
      {
        question:
          "Landet har meget dårlige veje, som skaber dårligere handle både indbyrdes og med andre lande, og derfor skader landets økonomi. Vil du lade vejene være eller reparere dem?",
        answerOne: {
          text: "Reparér vejene",
          resultText:
            "Det har kostet en masse penge men borgerne er blevet glade da de får nogle ordentlige veje. Over længere sigt vil det hjælpe økonomien men på kort sigt ville det være dyrt.",
          points: 300
        },
        answerTwo: {
          text: "Lad vejene være",
          resultText:
            "Transporten forbliver fortsat med at være langsom og varene kommer ikke i den ønskede tilstand, det gør landet fattigere da de andre lande ikke vil handle med dem.",
          points: 100
        }
      },
      {
        question:
          "Der er ikke nok strøm til byen, byg vindmøller eller kræftværk?",
        answerOne: {
          text: "Vindmøller",
          resultText:
            "Der nu massere af energi, men det har været dyrt! Dog er det ekstremt bæredygtigt, så godt valg!",
          points: 400
        },
        answerTwo: {
          text: "Kraftværk",
          resultText:
            "Der er nu massere af billig energi, men det forurener verden, hvilet vi IKKE kan lide! Dårlig idé!",
          points: 100
        }
      },
      {
        question:
          "Der er ikke nok rent vand til byen, vil du bygge et vandværk eller give dem klordioxid tabletter?",
        answerOne: {
          text: "Vandværk",
          resultText:
            "Vandværker er dyre, men ekstremt effektive og gode. Godt valg.",
          points: 400
        },
        answerTwo: {
          text: "Kordioxid tabletter",
          resultText:
            "Klordioxid er ikke særlig sundt, så det havde været bedre med et alternativ.",
          points: 100
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
      dilemma = d;
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
