import { getLast, getSlice, getRandom, getRandomNumber } from "./helper";
import { applyN5Grammar } from "./grammar";
const GRAMMAR_OBJECT = require("../data/n5/grammar.json");

export function getRandomWord(level, type) {
    level = level.toLowerCase();
    type = type.toLowerCase();
    if(type === "adjective") {
        type =  Math.floor(Math.random()*2) === 1 ? "i-adjective" : "na-adjective";
    }
    const data = require(`../data/${level}/${type}.json`);
    const index = Math.floor(Math.random() * Object.keys(data).length);
    return (data[Object.keys(data)[index]]);
}

export function generateProblem(options) {
    const randomType = getRandom(options["Types"]);
    const randomVLevel = () => getRandom(options["Vocab Level"]);
    const randomGLevel = () => getRandom(options["Grammar Level"]);

    switch(randomType) {
        case "Single Word":
            return getRandomWord(randomVLevel(), getRandom(options["Words"]));
        case "Adjective-Noun":
            const adjective = getRandomWord(randomVLevel(), "Adjective");
            const noun = getRandomWord(randomVLevel(), "Noun");
            if(adjective.type === "na-adjective") {
                return formatOutput([adjective, GRAMMAR_OBJECT["な"], noun]);
            }
            return formatOutput([adjective, noun]);
        case "Basic Sentence":
            return generateSentence("Basic", randomVLevel(), randomGLevel());
    }
}

export function generateSentence(level, vLevel, gLevel, forceOV=false) {
    if(level[0] === "B") { // Basic, includes n5 Grammar
        const noun  = getRandomWord(vLevel, "Noun");
        if(getRandomNumber(2) === 0 && !forceOV) { // Subject, Object, Verb (Da/Desu)
            let subject = formatOutput([noun, getSubjectParticle(gLevel)]);
            let object = {};
            if(getRandomNumber(2) === 0 && subject.word[subject.word.length-1] !== "で") {
                object = getRandomWord(vLevel, "Adjective");
            }
            else {
                object = getRandomWord(vLevel, "Noun");
            }
            const verb = GRAMMAR_OBJECT[getRandom(["だ", "です"])];
            return formatOutput([subject, object, verb]);
        } // Object, Verb
        const object = formatOutput([noun, getObjectParticle(gLevel)]);
        const verb =  getRandomWord(vLevel, "Verb");
        return formatOutput([object, verb]);
    }
    else if(level[0] === "R") { // Regular

    }
    else { // Complex

    }
    // need recurisve word getter
}

function getSubjectParticle(gLevel) { 
    if(gLevel === "N5") {
        const particles = ["が", "で", "は"].map(p => GRAMMAR_OBJECT[p]);
        return getRandom(particles);
    }
}

function getObjectParticle(gLevel) { 
    if(gLevel === "N5") {
        const particles = ["で", "に", "へ", "と", "から"].map(p => GRAMMAR_OBJECT[p]);
        return getRandom(particles);
    }
}

function formatOutput(words) {
    // Maybe custom breakpoints too for subject, object, etc.
    function addBreakpoint(word) {
        const bLenW = breakpoints.words.length;
        const bLenR = breakpoints.romaji.length;
        breakpoints.words.push(bLenW ? (breakpoints.words[bLenW-1] + word.word.length) : word.word.length);
        breakpoints.romaji.push(bLenR ? (breakpoints.romaji[bLenR-1] + word.romaji.length) : word.romaji.length);
        breakpoints.types.push(word.type);
    }
    
    let children = [];
    let breakpoints = {words: [], romaji: [], types: []};
    for(let w of words) {
        if(w.children) {
            for(let c of w.children) {
                children.push(c);
                addBreakpoint(c);
            }
        }
        else {
            children.push(w);
            addBreakpoint(w);
        }
    }
    return {
        word: words.map(w => w.word).join(""),
        romaji: words.map(w => w.romaji).join(" "),
        children: children,
        breakpoints: breakpoints
    }
}