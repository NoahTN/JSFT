export function getRandomWord(level, type) {
    if(type === "adjective") {
        type =  Math.floor(Math.random()*2) === 1 ? "ii-adjective" : "na-adjective";
    }
    const data = require(`../data/${level}/${type}.json`);
    const index = Math.floor(Math.random() * Object.keys(data).length);
    return (data[index]);
}

export function generateProblem(level, request) {
    const result = [];
    for(let type of request.types) {
        if(!["na-particle", "grammar"].includes(type)) {
            result.push(getRandomWord(level, type));
        }
        else if(type === "na-particle") {
            // Push a particle that accepts a noun and a adjective
        }
    }
    return result;
}