import { getLast, getSlice, getRandom } from "./helper";
import { getTeForm } from "./conjugator";
const GRAMMAR_OBJECT = require("../data/n5/grammar.json");


function formatOutput(words) {
    let children = [];
    for(let w of words) {
        if(w.children) {
            children = children.concat(w.children);
        }
        else {
            children.push(w);
        }
    }
    return {
        word: words.map(w => w.word).join(""),
        romaji: words.map(w => w.romaji).join(" "),
        children: children
    }
}

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
    const randomType = getRandom(options["Types"]);
    const randomVLevel = () => getRandom(options["Vocab Level"]);
    const randomGLevel = () => getRandom(options["Grammar Level"]);

    switch(randomType) {
        case "Single Word":
            return getRandomWord(randomVLevel(), getRandom(options["Words"]));
        case "Adjective-Noun":
            const adjective = getRandomWord(randomVLevel(), "Adjectives");
            const noun = getRandomWord(randomVLevel(), "Nouns");
            if(adjective.type === "na-adjective") {
                return formatOutput([adjective, GRAMMAR_OBJECT["な"], noun]);
            }
            return formatOutput([adjective, noun]);
        case "Basic Sentence":
            return generateSentence("Basic", randomVLevel(), randomGLevel());
    }
}

export function generateSentence(level, vLevel, gLevel) {
    let subject;
    let object;
    let verb;

    if(level[0] === "B") { // Basic, includes n5 Grammar
        subject = generateSubjectPart(level, vLevel, gLevel);
        object = generateObjectPart(level, vLevel, gLevel);
        verb = generateVerbPart(level, vLevel, gLevel);
    }
    else if(level[0] === "R") { // Regular

    }
    else { // Complex

    }
    // need recurisve word getter
    return formatOutput([subject, object, verb]);
}

export function generateSubjectPart(level, vLevel, gLevel) {
    function getSubjectParticle(gLevel) { 
        if(gLevel === "N5") {
            const particles = ["が", "で", "は"].map(p => GRAMMAR_OBJECT[p]);
            return getRandom(particles);
        }
    }
    const noun = getRandomWord(vLevel, "Nouns");
    const subjectParticle = getSubjectParticle(gLevel);
    return formatOutput([noun, subjectParticle]);
}

export function generateObjectPart(level, vLevel, gLevel) {
    function getObjectParticle(gLevel) { 
        if(gLevel === "N5") {
            const particles = ["で", "に", "へ", "と", "から"].map(p => GRAMMAR_OBJECT[p]);
            return getRandom(particles);
        }
    }
    const noun = getRandomWord(vLevel, "Nouns");
    const objectParticle =  getObjectParticle(gLevel);
    return formatOutput([noun, objectParticle]);
}

export function generateVerbPart(level, vLevel, gLevel) {
    return getRandomWord(vLevel, "Verbs");
}


export function modifyWord() {

}


export function getN5Grammar(category, vocabLevel, siblings=null) {
    const grammar = {
        "ちゃいけない": () => {
            const verb = siblings["verb"] ?? getRandomWord(vocabLevel, "verbs");
            const teForm = getTeForm(verb);
            let wSuffix= "ちゃいけない";
            let rSuffix = "chaikenai";
            if(getLast(teForm.word) == "で") {
                wSuffix = "じゃいけない";
                rSuffix = "jaikenai"
            }
            return {word: getSlice(teForm.word, 0, 1) + wSuffix, romaji: getSlice(teForm.romaji, 0, 2) + rSuffix, grammar: "ちゃいけない", siblings: [verb]}
        }
    };
    if(category === "random") {
        return grammar[Math.floor(Math.random() * grammar.length)];
    }
    return grammar[category]();
    
}