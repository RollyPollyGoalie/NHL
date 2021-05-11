const sqlite3 = require('sqlite3');

// Returns top 5 goalies by SV%.
async function savePercentage(db) {
    return await db.all(`SELECT *, SVP AS stat, Player_Name AS name FROM Goalies WHERE GP > 4 ORDER BY SVP DESC LIMIT 5;`);
}

// Returns top 5 goalies by ShutOuts.
async function shutOuts(db) {
    return await db.all(`SELECT *, SO AS stat, Player_Name AS name FROM Goalies WHERE GP > 4 ORDER BY SO DESC LIMIT 5;`);
}

// Returns top 5 goalies by GAA.
async function goalsAgainstAverage(db) {
    return await db.all(`SELECT *, GAA AS stat, Player_Name AS name FROM Goalies WHERE GP > 4 ORDER BY GAA ASC LIMIT 5;`);
}

// Returns top 5 skaters by goals.
async function mostGoals(db) {
    return await db.all(`SELECT *, Goals AS stat, Player_Name AS name FROM Skaters ORDER BY Goals Desc LIMIT 5;`);
}

// Returns top 5 skaters by assists.
async function mostAssists(db) {
    return await db.all(`SELECT *, Assists AS stat, Player_Name AS name FROM Skaters ORDER BY Assists Desc LIMIT 5;`);
}

// Returns top 5 skaters by points.
async function mostPoints(db) {
    return await db.all(`SELECT *, Points AS stat, Player_Name AS name FROM Skaters ORDER BY Points Desc LIMIT 5;`);
}

// Returns top 5 skaters by power play goals.
async function mostPPGoals(db) {
    return await db.all(`SELECT *, PP_Goals AS stat, Player_Name AS name FROM Skaters ORDER BY PP_Goals Desc LIMIT 5;`);
}

// Returns top 5 skaters by short handed goals.
async function mostSHGoals(db) {
    return await db.all(`SELECT *, SH_Goals AS stat, Player_Name AS name FROM Skaters ORDER BY SH_Goals Desc LIMIT 5;`);
}

// Returns top 5 skaters by best plus/minus.
async function bestPlusMinus(db) {
    return await db.all(`SELECT *, Plus_Minus AS stat, Player_Name AS name FROM Skaters ORDER BY Plus_Minus Desc LIMIT 5;`);
}

// Returns top 5 skaters by most penalty minutes.
async function mostPIM(db) {
    return await db.all(`SELECT *, PIM AS stat, Player_Name AS name FROM Skaters ORDER BY PIM Desc LIMIT 5;`);
}

// Returns top 5 skaters by most hits.
async function mostHits(db) {
    return await db.all(`SELECT *, Hits AS stat, Player_Name AS name FROM Skaters ORDER BY Hits Desc LIMIT 5;`);
}

// Returns top 5 teams with most PIM.
async function mostTeamPIM(db) {
    return await db.all(`SELECT *, PIM AS stat, Name AS name FROM Teams ORDER BY PIM Desc LIMIT 5;`);
}

// Returns top 5 teams with most hits
async function mostTeamHits(db) {
    return await db.all(`SELECT *, Hits AS stat, Name AS name FROM Teams ORDER BY Hits Desc LIMIT 5;`);
}



module.exports = { savePercentage, shutOuts, goalsAgainstAverage, mostGoals, mostAssists, mostPoints, mostPPGoals, mostSHGoals, bestPlusMinus, mostPIM, mostHits, mostTeamPIM, mostTeamHits };