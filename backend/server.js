const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

const repo = require('./repository.js');
const dbCalls = require('./repo2.js');

app.use(cors());


//look into keeping db connection alive, connection pooling?
repo.openDB().then( async db => {
    // await repo.createGameTable(db);
    // console.log("createGameTable");
    // await repo.gameDataAPI(db);
    // console.log("gameDataAPI");
    // await repo.createTeamData(db);
    // console.log("createTeamData");
    // await repo.combineTeamData(db);
    // console.log("combineTeamData");
    // await repo.createPenaltyData(db);
    // console.log("createPenaltyData");
    // await repo.createSaveData(db);
    // console.log("createSaveData");
    // await repo.getRosters(db);
    // console.log("getRosters");
    // await repo.createGoalieTable(db);
    // console.log("createGoalieTable");
    // await repo.populateGoalieTable(db);
    // console.log("populateGoalieTable");
    // await repo.createSkaterTable(db);
    // console.log("createSkaterTable");
    // await repo.populateSkaterTable(db);
    // console.log("populateSkaterTable");
    // console.log('All tables in database populated! :)');
});


app.get('/savePercentage', (req, res, next) => {
    repo.openDB().then( async db => {
        let savePercentageData = await dbCalls.savePercentage(db);
        res.status(200).send(savePercentageData);
    });
});

app.get('/shutOuts', (req, res, next) => {
    repo.openDB().then( async db => {
        let shutOutsData = await dbCalls.shutOuts(db);
        res.status(200).send(shutOutsData);
    });
});

app.get('/goalsAgainstAverage', (req, res, next) => {
    repo.openDB().then( async db => {
        let goalsAgainstAverageData = await dbCalls.goalsAgainstAverage(db);
        res.status(200).send(goalsAgainstAverageData);
    });
});

app.get('/mostGoals', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostGoalsData = await dbCalls.mostGoals(db);
        res.status(200).send(mostGoalsData);
    });
});

app.get('/mostAssists', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostAssistsData = await dbCalls.mostAssists(db);
        res.status(200).send(mostAssistsData);
    });
});

app.get('/mostPoints', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostPointsData = await dbCalls.mostPoints(db);
        res.status(200).send(mostPointsData);
    });
});

app.get('/mostPPGoals', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostPPGoalsData = await dbCalls.mostPPGoals(db);
        res.status(200).send(mostPPGoalsData);
    });
});

app.get('/mostSHGoals', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostSHGoalsData = await dbCalls.mostSHGoals(db);
        res.status(200).send(mostSHGoalsData);
    });
});

app.get('/bestPlusMinus', (req, res, next) => {
    repo.openDB().then( async db => {
        let bestPlusMinusData = await dbCalls.bestPlusMinus(db);
        res.status(200).send(bestPlusMinusData);
    });
});

app.get('/mostPIM', async (req, res, next) => {
    repo.openDB().then( async db => {
        let mostPIMData = await dbCalls.mostPIM(db);
        res.status(200).send(mostPIMData);
    });
});

app.get('/mostHits', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostHitsData = await dbCalls.mostHits(db);
        res.status(200).send(mostHitsData);
    });
});

app.get('/mostTeamPIM', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostTeamPIMData = await dbCalls.mostTeamPIM(db);
        res.status(200).send(mostTeamPIMData);
    });
});

app.get('/mostTeamHits', (req, res, next) => {
    repo.openDB().then( async db => {
        let mostTeamHitsData = await dbCalls.mostTeamHits(db);
        res.status(200).send(mostTeamHitsData);
    });
});


app.listen(port, () => {
    console.log(`server.js listening at port:${port}`);
});