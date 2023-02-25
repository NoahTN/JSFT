import { getLast, getSlice } from "./helper";
import { getTeForm } from "./conjugator";

export function getRandomWord(level, type) {
    level = level.toLowerCase();
    type = type.toLowerCase();
    if(type === "adjectives") {
        type =  Math.floor(Math.random()*2) === 1 ? "ii-adjectives" : "na-adjectives";
    }
    const data = require(`../data/${level}/${type}.json`);
    const index = Math.floor(Math.random() * Object.keys(data).length);
    return (data[index]);
}

export function generateProblem(options) {
    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    options = structuredClone(options);
    for(let key of Object.keys(options)) {
        options[key] = options[key].filter(v => v);
    }
    const result = [];
    const randomType = getRandom(options["Types"]);

    switch(randomType) {
        case "Basic":
            result.push(getRandomWord(getRandom(options["Vocab"]), getRandom(options["Words"])));
            break;
        case "Adjective-Noun":
            result.push(getRandomWord(getRandom(options["Vocab"]), "Adjectives"));
            result.push(getRandomWord(getRandom(options["Vocab"]), "Nouns"));
            break;
        case "Basic Sentence":
            result.push(getRandomWord(getRandom(options["Vocab"]), "Nouns"));
            result.push(getRandomWord(getRandom(options["Vocab"]), getRandom(options["Particles"])));
            result.push(getRandomWord(getRandom(options["Vocab"]), "Nouns"));
            break;
        case "N5-Grammar":
            result.push(getN5Grammar("random", getRandom(options["Vocab"])));
            break;

    }
    return result;
}

export function getN5Grammar(category, vocabLevel, child) {
    const grammar = {
        "ちゃいけない": () => {
            const verb = child ?? getRandomWord(vocabLevel, "verbs");
            const teForm = getTeForm(verb);
            let wSuffix= "ちゃいけない";
            let rSuffix = "chaikenai";
            if(getLast(teForm.word) == "で") {
                wSuffix = "じゃいけない";
                rSuffix = "jaikenai"
            }
            return {word: getSlice(teForm.word, 0, 1) + wSuffix, romaji: getSlice(teForm.romaji, 0, 2) + rSuffix, grammar: "ちゃいけない", child: verb}
        }
    };
    if(category === "random") {
        return grammar[Math.floor(Math.random() * grammar.length)];
    }
    return grammar[category]();
    
}