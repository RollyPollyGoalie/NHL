const fetch = require('node-fetch');

// Team data - does not need to be current
async function allTeams() {
    const response = await fetch('https://statsapi.web.nhl.com/api/v1/teams');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allTeamsJson = await response.json();
    return allTeamsJson;
}

// Returns roster for given team
// Needs to be current
// Will need: player ID, player name, player type
async function rosterByTeam(teamID) {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/teams/${teamID}?expand=team.roster`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rosterJson = await response.json();
    // console.log(rosterJson);
    // console.log('roster by team');
    return rosterJson;
}

// Returns stats for a given player for the 2020/2021 season
// Needs to be current
// Will need two versions: Goalies - save percentage, GAA, shutouts
//      Skaters - goals, assists, points, pp goals, sh goals, +/-, pim, hits
async function statsByPlayer(playerID) {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerID}/stats?stats=statsSingleSeason&season=20202021`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const playerStatsJson = await response.json();
    return playerStatsJson;
}

// Returns all scheduled games for the 2020/2021 season - past, present, and future
// Needs to be current
// Will need: game ID, game state, 
async function gameSchedule() {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?season=20202021`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gameScheduleJson = await response.json();
    return gameScheduleJson;
}

// Returns hyper-detailed stats for a given game
// Needs to be current
// Will need: (fights, major penalties, players involved), (save and goal events, type of shot, goalie involved), (pim by team)
async function statsByGame(gameID) {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameID}/feed/live`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gameStatsJson = await response.json();
    return gameStatsJson;
}

module.exports = { allTeams, rosterByTeam, statsByPlayer, gameSchedule, statsByGame };