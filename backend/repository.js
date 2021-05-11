// SUMMARY OF TABLES CREATED BY THIS FILE
// Teams: ID, Name, PIM, Hits - A row for each team's id (ex: ), full name (ex: New York Rangers), penalty minute and hit totals for the 2020/2021 season so far.
// Game_Schedule: game_id, date, status, data, Home_Team_ID, Home_Team_PIM, Home_Team_Hits, Away_Team_ID, Away_Team_PIM, Away_Team_Hits - A row for each game's id (ex: ), date (ex: ), status (ex: Final, Preview, Live), a string containing the entire Json object returned by calling the statsByGame NHL API, and the home and away teams' ids, penalty minute totals, and hit totals.
// 

const sqlite3 = require('sqlite3');
const nhlapi = require('./nhlapi.js');
// npm add-on to sqlite3 that allows usage of Promises and Async/Await
const sqlite = require('sqlite');

// Opens the database connection
async function openDB() {
    return sqlite.open({
        filename: './db.sqlite',
        driver: sqlite3.Database
    });
}

// function intersect(a, b) {
//     return a.filter(Set.prototype.has, new Set(b));
// }

// let db;
// openDB().then( async dbConn => {
//     db = dbConn;
//     populateSkaterTable(db);
// });

// Calls NHL API for a list of all NHL teams. Makes an array of individual teams. Drops/creates Teams table. Inserts a row for each team with id and full name (ex. New Jersey Devils). Also creates empty columns for team hits and pim.
// DOES NOT NEED TO BE UPDATED/RUN WHEN STARTING THE SERVER
async function initialTeamDatabase(db) {
    let allTeamsJson = await nhlapi.allTeams();
    const teamsArray = allTeamsJson.teams;
    await db.run(`DROP TABLE IF EXISTS Teams;`);
    await db.run(`CREATE TABLE IF NOT EXISTS Teams (
        ID INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        PIM INTEGER,
        Hits INTEGER
    ) WITHOUT ROWID;`
    );
    for(i = 0; i < teamsArray.length; i++) {
        await db.run(`INSERT INTO Teams (ID, Name)
            VALUES ($id, $name);`, {
                $id: teamsArray[i].id,
                $name: teamsArray[i].name
            }
        );
        console.log(i);
    }
    console.log("initialTeamDatabase Finished");
}


// Drops/creates Game_Schedule table. Creates empty columns for json data as a string, team pim and hits. Calls NHL API for the 2020/2021 game schedule. Makes an array of individual games. Inserts a row for each game's id, date, and status.
// Needs to be updated/run with every server startup.
// Populates table successfully but terminal says Database Locked.
async function createGameTable(db) {
    await db.run(`DROP TABLE IF EXISTS Game_Schedule;`);
    await db.run(`CREATE TABLE IF NOT EXISTS Game_Schedule (
        game_id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        data TEXT,
        Home_Team_ID INTEGER,
        Home_Team_PIM INTEGER,
        Home_Team_Hits INTEGER,
        Away_Team_ID INTEGER,
        Away_Team_PIM INTEGER,
        Away_Team_Hits INTEGER
    ) WITHOUT ROWID;`);
    let gameScheduleJson = await nhlapi.gameSchedule();
    const datesArray = gameScheduleJson.dates;
    let gamesArray = [];
    datesArray.forEach(date => gamesArray = gamesArray.concat(date.games));
    for(i = 0; i < gamesArray.length; i++) {
        await db.run(`INSERT INTO Game_Schedule (game_id, date, status)
            VALUES ($id, $date, $status);`, {
                $id: gamesArray[i].gamePk,
                $date: gamesArray[i].gameDate,
                $status: gamesArray[i].status.abstractGameState
            }
        );
        console.log(i);
    }
    console.log("createGameTable Finished");
}


// Makes an array of game ids from Game_Schedule. Loops over that array calling the NHL API for each game id. Returns detailed stats which are each converted to a string, then inserted into the data column of the Game_Schedule table.
// Updates about 75% of the games. Fetch request for those games is failing due to socket hang up. Terminal command never finishes. Needs to run multiple times.
async function gameDataAPI(db) {
    const rows = await db.all(`SELECT game_id FROM Game_Schedule WHERE status = 'Final' AND data IS NULL;`);
    for (i = 0; i < rows.length; i++) {
        let gameStatsJson = await nhlapi.statsByGame(rows[i].game_id);
        await db.run(`UPDATE Game_Schedule SET data = ? WHERE game_id = ?;`, [JSON.stringify(gameStatsJson), rows[i].game_id]);
        console.log(i);
    } 
    console.log("gameDataAPI Finished");
}


// Selects each game id and json data string from Game_Schedule. Converts the strings back into objects. Extracts then inserts team pim and hit totals for each game back into Game_Schedule table.
async function createTeamData(db) {
    const rows = await db.all(`SELECT game_id, data FROM Game_Schedule WHERE data IS NOT NULL AND Home_Team_ID IS NULL;`);
    for (i = 0; i < rows.length; i++) {
        const gameID = rows[i].game_id;
        let jsonData = JSON.parse(rows[i].data);
        const homeTeam = jsonData.liveData.boxscore.teams.home;
        const awayTeam = jsonData.liveData.boxscore.teams.away;    
        await db.run(`UPDATE Game_Schedule
            SET Home_Team_ID = ?,
                Home_Team_PIM = ?,
                Home_Team_Hits = ?,
                Away_Team_ID = ?,
                Away_Team_PIM = ?,
                Away_Team_Hits = ?
            WHERE game_id = ?;`, [
            homeTeam.team.id,
            homeTeam.teamStats.teamSkaterStats.pim,
            homeTeam.teamStats.teamSkaterStats.hits,
            awayTeam.team.id,
            awayTeam.teamStats.teamSkaterStats.pim,
            awayTeam.teamStats.teamSkaterStats.hits,
            gameID
        ]);
        console.log(i);
    }
    console.log("createTeamData Finished");
}


// Makes an array of team ids from Teams table. For each id, extracts sums of their pim and hit totals for the season from Game_Schedule table. Inserts totals into Teams table.
async function combineTeamData(db){
    const rows = await db.all(`SELECT ID FROM Teams;`);
    for (i = 0; i < rows.length; i++) {
        const htpRows = await db.all(`SELECT SUM(Home_Team_PIM) AS htpim FROM Game_Schedule WHERE Home_Team_ID = ${rows[i].ID};`);
        const hthRows = await db.all(`SELECT SUM(Home_Team_Hits) AS hthits FROM Game_Schedule WHERE Home_Team_ID = ${rows[i].ID};`);
        const atpRows = await db.all(`SELECT SUM(Away_Team_PIM) AS atpim FROM Game_Schedule WHERE Away_Team_ID = ${rows[i].ID};`);
        const athRows = await db.all(`SELECT SUM(Away_Team_Hits) AS athits FROM Game_Schedule WHERE Away_Team_ID = ${rows[i].ID};`);
        await db.run(`UPDATE Teams
            SET PIM = ?,
                Hits = ?
            WHERE ID = ?;`, [
            htpRows[0].htpim + atpRows[0].atpim,
            hthRows[0].hthits + athRows[0].athits,
            rows[i].ID
        ]);
        console.log(i);
    }
    console.log("combineTeamData Finished");
}


// Drops/Creates the MajorPenalties table. Makes an array of parsed json data objects from Game_Schedule. Extracts all Major Penalties (more than 5 min) and inserts into the MajorPenalties table.
async function createPenaltyData(db) {
    await db.run(`DROP TABLE IF EXISTS MajorPenalties;`);
    await db.run(`CREATE TABLE IF NOT EXISTS MajorPenalties (
        Game_ID INTEGER,
        Player_One_ID INTEGER,
        Player_One_Name TEXT,
        Player_One_Type TEXT,
        Player_Two_ID TEXT,
        Player_Two_Name TEXT,
        Player_Two_Type TEXT,
        Penalty TEXT,
        Severity TEXT,
        Minutes INTEGER,
        Description TEXT
    );`);
    const rows = await db.all(`SELECT game_id, data FROM Game_Schedule WHERE data IS NOT NULL;`);
    for (i = 0; i < rows.length; i++) {
        const gameID = rows[i].game_id;
        let jsonData = JSON.parse(rows[i].data);
        const allPlays = jsonData.liveData.plays.allPlays;
        const allMajors = allPlays.filter(play => 
            play.result.event === "Penalty" && play.result.penaltyMinutes > 4
        );
        // Same as allMajors but without fight penalty duplicates.
        // let uniqueMajors = [];
        // // Checks if each penalty from allMajors is fighting. Pushes the non-fights into uniqueMajors. Uses intersect to compare fighting penalties by player ID and period time. Pushes unique fighting penalties into uniqueMajors.
        // allMajors.forEach(play => {
        //     if (play.result.secondaryType === "Fighting") {
        //         if (!uniqueMajors.find(major => {
        //             if (major.result.secondaryType !== "Fighting") {
        //                 return false;
        //             }
        //             majorPlayers = major.players.map(player => player.id);
        //             playPlayers = play.players.map(player => player.id);
        //             samePlayers = intersect(majorPlayers, playPlayers).length === majorPlayers.length;
        //             if (samePlayers && major.period === play.period && major.periodTime === play.periodTime) {
        //                 return true;
        //             }
        //             return false;
        //         })) {
        //             // Pushes non-duplicate fighting majors
        //             uniqueMajors.push(play);
        //         }
        //     } else {
        //         // Pushes non-fighting majors
        //         uniqueMajors.push(play);
        //     }
        // });
        // Inserts every item from allMajors into MajorPenalties table.
        for (j = 0; j < allMajors.length; j++) {
            // If two players are listed, runs an INSERT statement with columns for two players' data. Else, runs an INSERT statement for one player.
            if (allMajors[j].players[1]) {
                await db.run(`INSERT INTO MajorPenalties (
                    Game_ID,
                    Player_One_ID,
                    Player_One_Name,
                    Player_One_Type,
                    Player_Two_ID,
                    Player_Two_Name,
                    Player_Two_Type,
                    Penalty,
                    Severity,
                    Minutes,
                    Description
                ) VALUES (
                    $game,
                    $p1id,
                    $p1name,
                    $p1type,
                    $p2id,
                    $p2name,
                    $p2type,
                    $pen,
                    $sev,
                    $min,
                    $desc
                );`, {
                    $game: gameID,
                    $p1id: allMajors[j].players[0].player.id,
                    $p1name: allMajors[j].players[0].player.fullName,
                    $p1type: allMajors[j].players[0].playerType,
                    $p2id: allMajors[j].players[1].player.id,
                    $p2name: allMajors[j].players[1].player.fullName,
                    $p2type: allMajors[j].players[1].playerType,
                    $pen: allMajors[j].result.secondaryType,
                    $sev: allMajors[j].result.penaltySeverity,
                    $min: allMajors[j].result.penaltyMinutes,
                    $desc: allMajors[j].result.description
                });
            } else {
                await db.run(`INSERT INTO MajorPenalties (
                    Game_ID,
                    Player_One_ID,
                    Player_One_Name,
                    Player_One_Type,
                    Penalty,
                    Severity,
                    Minutes,
                    Description
                ) VALUES (
                    $game,
                    $p1id,
                    $p1name,
                    $p1type,
                    $pen,
                    $sev,
                    $min,
                    $desc
                );`, {
                    $game: gameID,
                    $p1id: allMajors[j].players[0].player.id,
                    $p1name: allMajors[j].players[0].player.fullName,
                    $p1type: allMajors[j].players[0].playerType,
                    $pen: allMajors[j].result.secondaryType,
                    $sev: allMajors[j].result.penaltySeverity,
                    $min: allMajors[j].result.penaltyMinutes,
                    $desc: allMajors[j].result.description
                });
            }
            console.log(j);
        }
        console.log(i);
    }
    console.log("createPenaltyData Finished");
}


// Drops/Creates SaveGoalData table. Makes an array of parsed json data objects from Game_Schedule. For each object, extracts all plays that resulted in a save or goal. Inserts goalie and play info into SaveGoalData table.
async function createSaveData(db) {
    await db.run(`DROP TABLE IF EXISTS SaveGoalData;`);
    await db.run(`CREATE TABLE IF NOT EXISTS SaveGoalData (
        Game_ID INTEGER NOT NULL,
        Goalie_ID INTEGER NOT NULL,
        Name TEXT NOT NULL,
        Event TEXT NOT NULL,
        Shot_Type TEXT NOT NULL
    );`);
    const rows = await db.all(`SELECT game_id, data FROM Game_Schedule WHERE data IS NOT NULL;`);
    for (i = 0; i < rows.length; i++) {
        const gameID = rows[i].game_id;
        let jsonData = JSON.parse(rows[i].data);
        const allPlays = jsonData.liveData.plays.allPlays;

        const goaliePresentPlays = allPlays.filter(play => play.result.emptyNet !== true && play.result.secondaryType);

        const allSavesGoals = goaliePresentPlays.filter(play => 
            play.result.event === "Goal" || play.result.event === "Shot"
        );
        for (j = 0; j < allSavesGoals.length; j++) {
            const goalie = allSavesGoals[j].players.find(type => type.playerType === "Goalie");
            
            await db.run(`INSERT INTO SaveGoalData (Game_ID, Goalie_ID,Name, Event, Shot_Type) VALUES ($game, $goalieID, $goalieName, $event, $shot)`, {
                $game: gameID,
                $goalieID: goalie.player.id,
                $goalieName: goalie.player.fullName,
                $event: allSavesGoals[j].result.event,
                $shot: allSavesGoals[j].result.secondaryType
            });
            console.log(j);
        }
    console.log(i); 
    }
console.log("createSaveData Finished");
}


// Drops/Creates Players table. Makes and array of team ids from Teams table. Loops over array calling NHL roster API for each team. Inserts all players into Players table.
async function getRosters(db){
    await db.run(`DROP TABLE IF EXISTS Players;`);
    await db.run(`CREATE TABLE IF NOT EXISTS Players (
        Player_ID INTEGER PRIMARY KEY,
        Player_Name TEXT,
        Team_ID INTEGER,
        Team_Name TEXT,
        Type TEXT
    ) WITHOUT ROWID;`);
    const rows = await db.all(`SELECT ID FROM Teams;`);
    for (i = 0; i < rows.length; i++) {
        let rosterJson = await nhlapi.rosterByTeam(rows[i].ID);
        const teamID = rosterJson.teams[0].id;
        const teamName = rosterJson.teams[0].name;
        // Seattle Kraken id is 55 - they have an empty roster.
        if (teamID === 55) {
            return;
        }
        const rosterArray = rosterJson.teams[0].roster.roster;
        for (j = 0; j < rosterArray.length; j++) {
            await db.run(`INSERT INTO Players (Player_ID, Player_Name, Team_ID, Team_Name, Type)
            VALUES ($id, $name, $teamId, $teamName, $type);`, {
                $id: rosterArray[j].person.id,
                $name: rosterArray[j].person.fullName,
                $teamId: teamID,
                $teamName: teamName,
                $type: rosterArray[j].position.type
            });
            console.log(j);
        }
        console.log(i);
    }
    console.log("getRosters Finished");
}


// Drops/Creates Goalies table. Extracts all goalies from Player table and inserts into Goalies table.
async function createGoalieTable(db) {
    await db.run(`DROP TABLE IF EXISTS Goalies;`);
    await db.run(`CREATE TABLE IF NOT EXISTS Goalies (
        Player_ID INTEGER PRIMARY KEY,
        Player_Name TEXT NOT NULL,
        Team_ID Integer NOT NULL,
        Team_Name TEXT NOT NULL,
        SVP INTEGER,
        GAA INTEGER,
        SO INTEGER,
        GP INTEGER
    );`);
    await db.run(`INSERT INTO Goalies (Player_ID, Player_Name, Team_ID, Team_Name) SELECT Player_ID, Player_Name, Team_ID, Team_Name FROM Players WHERE Type = 'Goalie';`);
    console.log("createGoalieTable Finished");
}


// Selects all ids from Goalies table and calls NHL stats by player API for each. Extracts relevant data and updates Goalies table.
async function populateGoalieTable(db) {
    const rows = await db.all(`SELECT Player_ID FROM Goalies`);
    for (i = 0; i < rows.length; i++) {
        let playerStatsJson = await nhlapi.statsByPlayer(rows[i].Player_ID);
        // Checks if goalie has played any games. Returns if no game data exists.
        if (!playerStatsJson.stats[0].splits[0]) {
            continue;
        }
        const svp = playerStatsJson.stats[0].splits[0].stat.savePercentage;
        const gaa = playerStatsJson.stats[0].splits[0].stat.goalAgainstAverage;
        const so = playerStatsJson.stats[0].splits[0].stat.shutouts;
        const gp = playerStatsJson.stats[0].splits[0].stat.games;
        await db.run(`UPDATE Goalies 
            SET SVP = ?,
            GAA = ?,
            SO = ?,
            GP = ?
        WHERE Player_ID = ?;`, [svp, gaa, so, gp, rows[i].Player_ID]);
        console.log(i);
    }
    console.log("populateGoalieTable Finished");
}

// Drops/Creates Skaters table. Extracts all Forwards and Defensemen from Player table and inserts into Skaters table.
async function createSkaterTable(db) {
    await db.run(`DROP TABLE IF EXISTS Skaters;`);
    await db.run(`CREATE TABLE IF NOT EXISTS Skaters (
        Player_ID INTEGER PRIMARY KEY,
        Player_Name TEXT NOT NULL,
        Team_ID INTEGER NOT NULL,
        Team_Name TEXT NOT NULL,
        Games_Played INTEGER,
        Goals INTEGER,
        Assists INTEGER,
        Points INTEGER,
        PP_Goals INTEGER,
        SH_Goals INTEGER,
        Plus_Minus INTEGER,
        PIM INTEGER,
        Hits INTEGER
    );`);
    await db.run(`INSERT INTO Skaters (Player_ID, Player_Name, Team_ID, Team_Name) SELECT Player_ID, Player_Name, Team_ID, Team_Name FROM Players WHERE Type = 'Forward' OR Type = 'Defenseman';`);
    console.log("createSkaterTable Finished");
}

// Selects all ids from Skaters table and calls NHL stats by player API for each. Extracts relevant data and updates Skaters table.
async function populateSkaterTable(db) {
    const rows = await db.all(`SELECT Player_ID FROM Skaters`);
    for (i = 0; i < rows.length; i++) {
        let playerStatsJson = await nhlapi.statsByPlayer(rows[i].Player_ID);
        if (!playerStatsJson.stats[0].splits[0]) {
            continue;
        }
        const stats = playerStatsJson.stats[0].splits[0].stat;
        const gp = stats.games;
        const goals = stats.goals;
        const asts = stats.assists;
        const pts = stats.points;
        const ppg = stats.powerPlayGoals;
        const shg = stats.shortHandedGoals;
        const pm = stats. plusMinus;
        const pim = stats.pim;
        const hits = stats.hits;
        await db.run(`UPDATE Skaters 
            SET Games_Played = ?,
            Goals = ?,
            Assists = ?,
            Points = ?,
            PP_Goals = ?,
            SH_Goals = ?,
            Plus_Minus = ?,
            PIM = ?,
            Hits = ?
        WHERE Player_ID = ?;`, [gp, goals, asts, pts, ppg, shg, pm, pim, hits, rows[i].Player_ID]);
        console.log(i);
    };
    console.log("populateSkaterTable Finished");
}



// nhlapi.statsByGame(2020020080).then(gameStatsJson => {
//     
// });

// Exports my database connection function, as well as all functions needed to populate database.
module.exports = { openDB,
    initialTeamDatabase,
    createGameTable,
    gameDataAPI,
    createTeamData,
    combineTeamData,
    createPenaltyData,
    createSaveData,
    getRosters,
    createGoalieTable,
    populateGoalieTable,
    createSkaterTable,
    populateSkaterTable };