export function generateProblem(level, type) {
    const data = require(`./data/${level}/${type}.json`);
    const index = Math.floor(Math.random()* Object.keys(data).length);
    return (data[index]);
}