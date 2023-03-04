import { getLast, getSlice, getRandom } from "./helper";
import { applyN5Grammar } from "./grammar";
const GRAMMAR_OBJECT = require("../data/n5/grammar.json");


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

export function generateSentence(level, vLevel, gLevel, forceOB=false) {
    let subject;
    let object;
    let verb;

    if(level[0] === "B") { // Basic, includes n5 Grammar
        if(Math.floor(Math.random()*2) === 1 || forceOB) { // Object, Verb
            object = generateObjectPart(level, vLevel, gLevel);
            verb = generateVerbPart(level, vLevel, gLevel);
            return formatOutput([object, verb]);
        } // Subject, object, verb
        subject = generateSubjectPart(level, vLevel, gLevel);
        object = generateObjectPart(level, vLevel, gLevel, subject, "short");
        verb = generateVerbPart(level, vLevel, gLevel, "short");
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

export function generateObjectPart(level, vLevel, gLevel, subject, short="") {
    function getObjectParticle(gLevel) { 
        if(gLevel === "N5") {
            const particles = ["で", "に", "へ", "と", "から"].map(p => GRAMMAR_OBJECT[p]);
            return getRandom(particles);
        }
    }
    
    if(short) {
        if(Math.floor(Math.random) === 1 && subject.word[subject.word.length-1] !== "で") {
            return getRandomWord(vLevel, "Adjectives");
            
        }
        return getRandomWord(vLevel, "Nouns");
    }
    const noun = getRandomWord(vLevel, "Nouns");
    const objectParticle = getObjectParticle(gLevel);
    return formatOutput([noun, objectParticle]);
    
}

export function generateVerbPart(level, vLevel, gLevel, short="") {
    if(short) {
        return GRAMMAR_OBJECT[getRandom(["だ", "です"])];
    }
    return getRandomWord(vLevel, "Verbs");
}