import { getLast, getSlice, getRandom, getRandomNumber } from "./helper";
import { applyN5Grammar } from "./grammar";
import { getMasuForm, getNegativeForm, getPastForm, getPastNegaitveForm, getTeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json"
import { DATA_OBJECT } from "./data";


const randomVLevel = (options) => getRandom(options["Vocab Level"]);
const randomGLevel = (options) => getRandom(options["Grammar Level"]);

export function getRandomWord(level, type) {
    level = level.toLowerCase();
    type = type.toLowerCase();
    if(type === "adjective") {
        type =  getRandomNumber(2) === 0 ? "i-adjective" : "na-adjective";
    }
    const data = DATA_OBJECT[level][type];
    const key = getRandom(Object.keys(data));
    return data[key];
}

export function generateProblem(options) {
    const randomType = getRandom(options["Types"]);

    switch(randomType) {
        case "Single Word":
            const wordCategory = getRandom(options["Words"]);
            if(wordCategory === "Verb") {
                return getRandomVerbForm(randomVLevel(options), options["Tenses"])
            }
            return getRandomWord(randomVLevel(options), wordCategory);
        case "Adjective-Noun":
            const adjective = getRandomWord(randomVLevel(options), "Adjective");
            const noun = getRandomWord(randomVLevel(options), "Noun");
            if(adjective.type === "na-adjective") {
                return formatOutput([adjective, GRAMMAR_OBJECT["な"], noun]);
            }
            return formatOutput([adjective, noun]);
        case "Basic Sentence":
            return generateSentence(options);
    }
}

function getRandomVerbForm(level, tenses) {
    const verb = getRandomWord(level, "verb");
    const tense = getRandom(tenses);
    const conjugator = {
        "Plain": (verb) => verb,
        "Masu": (verb) => getMasuForm(verb),
        "Past": (verb) => getPastForm(verb),
        "Negative": (verb) => getNegativeForm(verb),
        "Past-Negative": (verb) => getPastNegaitveForm(verb),
        "Te": (verb) => getTeForm(verb)
    }
    return conjugator[tense](verb);
}

function getRandomDaDesuForm(tenses) {
    const verb = GRAMMAR_OBJECT[getRandom(["だ", "です"])];
    const tense = getRandom(tenses.filter(t => ["Plain", "Masu", "Past", "Negative", "Past-Negative"].includes(t)));
    const conjugator = {
        "Plain": (verb) => verb,
        "Masu": GRAMMAR_OBJECT["です"],
        "Past": (verb) => getPastForm(verb),
        "Negative": (verb) => getNegativeForm(verb),
        "Past-Negative": (verb) => getPastNegaitveForm(verb)
    }
    return conjugator[tense](verb);
}

function getSOVSentence(options) {
    let noun  = getRandomWord(randomVLevel(options), "Noun");
    let subject = formatOutput([noun, getSubjectParticle(randomGLevel(options))]);
    let object = {};
    if(getRandomNumber(2) === 0 && subject.word[subject.word.length-1] !== "で")
        object = getRandomWord(randomVLevel(options), "Adjective");
    else
        object = getRandomWord(randomVLevel(options), "Noun");
    let verb = getRandomDaDesuForm(options["Tenses"]);
    return formatOutput([subject, object, verb]);
}

function getOVSentence(options) {
    let noun  = getRandomWord(randomVLevel(options), "Noun");
    let object = formatOutput([noun, getObjectParticle(randomGLevel(options))]);
    let verb =  getRandomVerbForm(randomVLevel(options), options["Tenses"]);
    return formatOutput([object, verb]);
}

export function generateSentence(options, force="") {
    const typeIndex = options["Types"].indexOf("Basic Sentence");
    let difficulty = getRandom(options["Types"]).slice(typeIndex);

    if(difficulty[0] === "B") { // Basic
        if((getRandomNumber(2) === 0 && force !== "OV") || force === "SOV") {
            return getSOVSentence(options);
        }
        return getOVSentence(options);
    }
    else if(difficulty[0] === "R") { // Regular, includes n5 grammar
        
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
// Need to tag SOME nouns with stuff like location for use with ni, de, he, etc.
function getObjectParticle(gLevel) { 
    if(gLevel === "N5") {
        const particles = ["が", "は", "で", "に", "へ", "と", "から"].map(p => GRAMMAR_OBJECT[p]);
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