const fetch = require('node-fetch');

async function getData(searchTerm) {
    let url = `http://localhost:8000/${searchTerm}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const topFive = await response.json();
    console.log(topFive);
    return topFive;
}


export default getData;