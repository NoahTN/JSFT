import {  getRandom, getRandomNumber } from "./helper";
import { applyN5Grammar } from "./grammar";
import { getPoliteForm, getNegativeForm, getPastForm, getTeForm, getAdjectiveForm, getProvisionalForm, getConditionalForm, getImperativeForm, getVolitionalForm, getPotentialForm, getPassiveForm, getCausativeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json"
import { DATA_OBJECT } from "./data";

export function generateProblem(options) {
    const randomType = getRandom(options["Types"]);

    switch(randomType) {
        case "Single Word":
            const wordCategory = getRandom(options["Words"]);
            if(wordCategory === "Verb") {
                return getRandomVerbForm(getRandom(options["Vocab Level"]), options["Tenses"])
            }
            else if(wordCategory === "Adjective") {
                return getRandomAdjectiveForm(getRandom(options["Vocab Level"]), options["Tenses"]);
            }
            return getRandomWord(getRandom(options["Vocab Level"]), wordCategory);
        case "Adjective-Noun":
            const adjective = getRandomWord(getRandom(options["Vocab Level"]), "Adjective");
            const noun = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
            if(adjective.type === "na-adjective") {
                return formatOutput([adjective, GRAMMAR_OBJECT["な"], noun]);
            }
            return formatOutput([adjective, noun]);
        default:
            return generateSentence(options);
    }
}

export function generateSentence(options, force={}) {
    const typeIndex = options["Types"].indexOf("Basic Sentence");
    let difficulty = getRandom(options["Types"].slice(typeIndex));

    if(difficulty[0] === "B") { // Basic
        if((getRandomNumber(options["Tenses"].length) === 0 && force["sentence-form"] !== "OV") || force["sentence-form"]=== "SOV") {
            return getSOVSentence(options);
        }
        return getOVSentence(options);
    }
    else if(difficulty[1] === "5") { // Regular, includes n5 grammar
        return applyN5Grammar(getOVSentence(options, true), difficulty, getRandom(options["Vocab Level"]));
    }
    else { // Complex

    }
    // need recurisve word getter
}

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

function calculateTenses(tenses, isVerb=true) {
    let output = [...tenses];
    const set = new Set(tenses);

    if(set.has("Polite") && set.has("Past")) {
        output.push("Past-Polite");
        if(set.has("Negative")) {
            output.push("Past-Polite-Negative");
        }
    }
    if(set.has("Polite") && set.has("Negative")) {
        output.push("Polite-Negative");
    }
    if(set.has("Past") && set.has("Negative")) {
        output.push("Past-Negative");
    }

    if(isVerb) {
        if(set.has("Te") && set.has("Negative")) {
            output.push("Te-Negative");
        }
        if(set.has("Provisional") && set.has("Negative")) {
            output.push("Provisional-Negative");
        }
        if(set.has("Conditional") && set.has("Negative")) {
            output.push("Conditional-Negative");
        }
        if(set.has("Volitional") && set.has("Polite")) {
            output.push("Volitional-Polite");
        }
        if(set.has("Potential") && set.has("Negative")) {
            output.push("Potential-Negative");
            if(set.has("Past")) {
                output.push("Potential-Past-Negative");
            }
        }
        if(set.has("Passive") && set.has("Past")) {
            output.push("Passive-Past");
        }
        if(set.has("Causative") && set.has("Passive")) {
            output.push("Causative-Passive");
            if(set.has("Past")) {
                output.push("Causative-Passive-Past");
            }
        }
    }
   
    return output;
}

function getRandomVerbForm(level, tenses, force="") {
    const verb = getRandomWord(level, "verb");
    const tense = getRandom(calculateTenses(tenses));
   
    const conjugator = {
        "Plain": (verb) => verb,
        "Polite": (verb) => getPoliteForm(verb),
        "Past": (verb) => getPastForm(verb),
        "Negative": (verb) => getNegativeForm(verb),
        "Te": (verb) => getTeForm(verb),
        "Past-Polite": (verb) => getPastForm(verb, "polite"),
        "Polite-Negative": (verb) => getPoliteForm(verb, "negative"),
        "Past-Negative": (verb) => getPastForm(verb, "negative"),
        "Past-Polite-Negative": (verb) => getPastForm(verb, "polite-negative"),
        "Te-Negative": (verb) => getTeForm(verb, "negative"),
        "Provisional": (verb) => getProvisionalForm(verb),
        "Provisional-Negative": (verb) => getProvisionalForm(verb, "negative"),
        "Conditional": (verb) => getConditionalForm(verb),
        "Conditional-Negative": (verb) => getConditionalForm(verb, "negative"),
        "Imperative": (verb) => getImperativeForm(verb),
        "Volitional": (verb) => getVolitionalForm(verb),
        "Volitional-Polite": (verb) => getVolitionalForm(verb, "polite"),
        "Potential": (verb) => getPotentialForm(verb),
        "Potential-Negative": (verb) => getPotentialForm(verb, "negative"),
        "Potential-Past-Negative": (verb) => getPotentialForm(verb, "past-negative"),
        "Passive": (verb) => getPassiveForm(verb),
        "Passive-Past": (verb) => getPassiveForm(verb, "past"),
        "Causative": (verb) => getCausativeForm(verb),
        "Causative-Passive": (verb) => getCausativeForm(verb, "passive"),
        "Causative-Passive-Past": (verb) => getCausativeForm(verb, "passive-past")
    }

    return force ? conjugator[force](verb) : conjugator[tense](verb);
}

function getRandomAdjectiveForm(level, tenses, force="") {
    const adj = getRandomWord(level, "adjective");
    const allowed = new Set(["Plain", "Polite", "Past", "Negative", "Polite-Negative", "Past-Polite", "Past-Negative", "Past-Polite-Negative"]);
    const tense = getRandom(calculateTenses(tenses.filter(t => allowed.has(t)), false));

    return force ? getAdjectiveForm(adj, force) : getAdjectiveForm(adj, tense.toLowerCase());
}

function getSOVSentence(options) {
    let noun  = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
    let subject = formatOutput([noun, getSubjectParticle(options)]);
    let object = {};
    if(getRandomNumber(2) === 0 && subject.word[subject.word.length-1] !== "で")
        object = getRandomAdjectiveForm(getRandom(options["Vocab Level"]), options["Tenses"]);
    else
        object = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
    
    if(!object.form) {
        let verb = getRandomNumber(2) === 0 ? GRAMMAR_OBJECT["だ"] : GRAMMAR_OBJECT["です"];
        return formatOutput([subject, object, verb]);
    }
    return formatOutput([subject, object]);
}

function getOVSentence(options, forcePlain=false) {
    let noun  = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
    let object = formatOutput([noun, getObjectParticle(options)]);
    let verb = getRandomVerbForm(getRandom(options["Vocab Level"]), forcePlain ? ["Plain"] : options["Tenses"]);
    return formatOutput([object, verb]);
}


function getRandomDaDesuForm(isIAdjective, tenses, force="") {
    const verb = isIAdjective ? GRAMMAR_OBJECT["です"] : GRAMMAR_OBJECT[getRandom(["だ", "です"])];
    const allowed = new Set(["Plain", "Polite", "Past", "Negative"])
    const tense = getRandom(calculateTenses(tenses.filter(t => allowed.has(t))));
    const conjugator = {
        "Plain": (verb) => verb,
        "Polite": () => getPoliteForm(verb),
        "Past": (verb) => getPastForm(verb),
        "Negative": (verb) => getNegativeForm(verb),
        "Past-Polite": (verb) => getPastForm(verb, "polite"),
        "Polite-Negative": (verb) => getPoliteForm(verb, "negative"),
        "Past-Negative": (verb) => getPastForm(verb, "negative"),
        "Past-Polite-Negative": (verb) => getPastForm(verb, "polite-negative"),
    }
    return force ? conjugator[force](verb) : conjugator[tense](verb);
}

function getSubjectParticle() { 
    const particles = ["が", "で", "は"].map(p => GRAMMAR_OBJECT[p]);
    return getRandom(particles);
    
}
// Need to tag SOME nouns with stuff like location for use with ni, de, he, etc.
function getObjectParticle() { 
    const particles = ["が", "は", "で", "に", "へ", "と", "から"].map(p => GRAMMAR_OBJECT[p]);
    return getRandom(particles);
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