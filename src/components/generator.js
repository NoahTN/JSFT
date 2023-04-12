import {  getRandom, getRandomNumber, stringSplice, coinFlipHeads, formatOutput } from "./helper";
import { applyN5Grammar, applyClauseChainingGrammar, getPositions } from "./grammar";
import { getPoliteForm, getNegativeForm, getPastForm, getTeForm, getAdjectiveForm, getProvisionalForm, getConditionalForm, getImperativeForm, getVolitionalForm, getPotentialForm, getPassiveForm, getCausativeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json"
import { DATA_OBJECT, getRandomWord } from "./data";

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
        case "Basic Sentence":
        case "N5 Grammar":
        case "Complex Sentence":
            return generateSentence(options);
    }

}

export function generateSentence(options, force={}) {
    const typeIndex = options["Types"].indexOf("Basic Sentence");
    let difficulty = getRandom(options["Types"].slice(typeIndex));
    let problem;
    if(difficulty[0] === "B") { // Basic
        if((getRandomNumber(options["Tenses"].length) === 0 && force["sentence-form"] !== "OV") || force["sentence-form"]=== "SOV") {
            problem = getSOVSentence(options, force);
        }
        else {
            problem = getOVSentence(options);
        }
        return applyAdverb(problem, options);

    }
    else if(difficulty[1] === "5") { // Regular, includes n5 grammar
        // grammar can take btoh sense
        problem = coinFlipHeads() ? getSOVSentence(options) : getOVSentence(options);
        problem = applyAdverb(problem, options);
        return applyN5Grammar(problem, getRandom(options["Tenses"]), difficulty, getRandom(options["Vocab Level"]));
    }
    else { // Complex
        let first = coinFlipHeads() ? getSOVSentence(options) : getOVSentence(options);
        let second = coinFlipHeads() ? getSOVSentence(options) : getOVSentence(options);
        return applyClauseChainingGrammar(first, second);
    }
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
    const tense = getRandom(calculateTenses(tenses.filter(t => allowed.has(t)), false)) ?? "Plain";

    return force ? getAdjectiveForm(adj, force) : getAdjectiveForm(adj, tense.toLowerCase());
}

function getSOVSentence(options, force={}) {
    let noun  = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
    let subject = formatOutput([noun, force["ga"] ? GRAMMAR_OBJECT["が"] : getSubjectParticle(options)]);
    let object = {};
    if(!force["noun"] && force["adj"] || (coinFlipHeads() && subject.word[subject.word.length-1] !== "で"))
        object = getRandomAdjectiveForm(getRandom(options["Vocab Level"]), options["Tenses"]);
    else
        object = getRandomWord(getRandom(options["Vocab Level"]), "Noun");
    
    if(force["no da/desu"] || !object.form) {
        let verb = coinFlipHeads() ? GRAMMAR_OBJECT["だ"] : GRAMMAR_OBJECT["です"];
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
    const particles = ["が", "は", "で", "に", "へ", "と", "から", "も"].map(p => GRAMMAR_OBJECT[p]);
    return getRandom(particles);
}

function applyAdverb(problem, options) {
    if(!options?.Words?.includes("Adverb") || coinFlipHeads()) {
        return problem;
    }

    let adverb = getRandomWord(getRandom(options["Vocab Level"]), "Adverb");
    let possible = [];
    for(let i = 0; i < problem.children.length; ++i) {
        if(problem.children[i].type !== "grammar") {
            possible.push(i);
        }
    }
    let index = getRandom(possible);
    problem.children.splice(index, 0, adverb);
    return formatOutput([problem]);
}