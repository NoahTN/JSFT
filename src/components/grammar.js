import { getLast, getRandom, coinFlipHeads, stringSplice } from "./helper";
import { getAdjectiveForm, getNegativeForm, getPastForm, getTeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json";
import { DATA_OBJECT } from "./data";

export function applyN5Grammar(problem, tenses, difficulty, vocabLevel, force="") {
    const verbIndex = getPlainVerbIndex(problem);
    const daDesuIndex = getDaDesuIndex(problem);
    const hasModifiableParticle = getParticleIndex(problem) !== -1;
    const commonTenses = new Set(["Plain", "Past", "Negative"]);

    function getPossibleModifications() {
        const output = [];
        if(verbIndex !== -1) {
            output.push("chaikenai");
            output.push("hoshii");
            output.push("hougaii");
        }
        if(daDesuIndex !== -1) {
            output.push("darou");
            output.push("ndesu");
            output.push("doushite");
        }
        output.push(...["dake", "ka", "donna", "douyatte", "ichiban"]);

        return output;
    }
    const grammar = {
        "chaikenai": () => {
            const teForm = getTeForm(problem.children[verbIndex]);
            let wSuffix= "ちゃいけない";
            let rSuffix = "chaikenai";
            if(getLast(teForm.word) == "で") {
                wSuffix = "じゃいけない";
                rSuffix = "jaikenai"
            }
            problem.word = problem.word.slice(0, -problem.children[verbIndex].word.length) + teForm.word.slice(0, -1)+ wSuffix;
            let offset = 2;
            if(teForm.word[teForm.word.length-2] === "っ") {
                offset = 3;
                rSuffix = "cchaikenai";
            }
            problem.romaji = problem.romaji.slice(0, -problem.children[verbIndex].romaji.length) + teForm.romaji.slice(0, -offset) + rSuffix;
            problem.children.push(GRAMMAR_OBJECT["ちゃいけない"]);
            problem.children[verbIndex] = teForm;
            problem.indices["grammar"].push(problem.children.length-1);
            return problem;
        },
        "dake": () => {
            let possible = getPossibleTargets(problem);
            return applyModifyWord(problem, possible, "だけ");
        },
        "darou": () => {
            return applyReplaceDaDesu(problem, "だろう");
        },
        "demo": () => {
            
        },
        "deshou": () => {
            return applyReplaceDaDesu(problem, "でしょう");
        },
        "ka": () => {
            let last = getLast(problem.children);
            if(last.romaji === "da" || last?.verb?.romaji === "da") {
                problem.word = problem.word.slice(0, -last.word.length);
                problem.romaji = problem.romaji.slice(0, -last.romaji.length);
                problem.children.pop();
                problem.indices["grammar"].pop();
            }
            problem.word += "か";
            problem.romaji += "ka";
            problem.children.push(GRAMMAR_OBJECT["か"]);
            return problem;
        },
        "no": () => {

        },
        "ndesu": () => {
            let last = getLast(problem.children);
            if(last.romaji === "da" || last?.verb?.romaji === "da") {
                return applyReplaceDaDesu(problem, "nda");
            }
            if(last.romaji === "desu" || last?.verb?.romaji === "desu") {
                return applyReplaceDaDesu(problem, "ndesu");
            }
            let end = GRAMMAR_OBJECT["んです"];
            problem.word += end.word;
            problem.romaji += end.romaji;
            problem.children.push(end);
            return problem;
        },
        "donna": () => {
            problem = applyModifyWord(problem, ["noun"], "どんな", true);
            return applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
        },
        "doushite": () => {
            problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
            problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            return applyModifyWord(problem, ['noun'], "どうして", true);
        },
        "douyatte": () => {
            if(coinFlipHeads() || !hasModifiableParticle) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
                return applyModifyWord(problem, ["noun"], "どうやって", true);
            }
            let index = getParticleIndex(problem);
            let pos = getPositions(problem, index);
            if(coinFlipHeads()) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
            }
            problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            problem.word = stringSplice(problem.word, pos[0], "どうやって");
            problem.romaji = stringSplice(problem.romaji, pos[1], " douyatte");
            problem.children.splice(index, 0, GRAMMAR_OBJECT["どうやって"]);
            return problem;
        },
        "hoshii": () => {
            const teForm = getTeForm(problem.children[verbIndex]);
            const hoshii = getAdjectiveForm(DATA_OBJECT[vocabLevel.toLowerCase()]["i-adjective"]["hoshii"], getRandomFilteredTense(tenses, commonTenses));
            problem.word = problem.word.slice(0, -problem.children[verbIndex].word.length) + teForm.word + hoshii.word;
            problem.romaji = problem.romaji.slice(0, -problem.children[verbIndex].romaji.length) + teForm.romaji + " " + hoshii.romaji; 
            problem.children.push(hoshii);
            problem.children[verbIndex] = teForm;
            problem.indices["adjective"] ??= [];
            problem.indices["adjective"].push(problem.children.length-1);
            return problem;
        },
        "hougaii": () => {
            problem = conjugateEnd(problem, verbIndex, coinFlipHeads() ? "past": "negative");
            problem.word += "方がいい";
            problem.romaji += " hougaii";
            problem.children.push(GRAMMAR_OBJECT["方がいい"]);
            return problem;
        },
        "ichiban": () => {
            let gaIndex = getGaIndex(problem);
            if(gaIndex !== -1) { //

            }
            // add adverb
        }
    }

    if(force) {
        return grammar[force]();
    }
    const randomGrammar = getRandom(getPossibleModifications());
    // No possible modifcations
    if(!randomGrammar) {
        return null;
    }
    return grammar[randomGrammar]();

    // if(!category) {
    //     return getRandom(Object.entries(grammar));
    // }

    // if(difficulty[0] === "B") {
    //     // Apply one grammar
    // }
    // else if(difficulty[0] === "R") {
    //     // Apply up to two grammar
    // }
    // return grammar[category]();
}

function conjugateEnd(problem, index, tense) {
    if(tense !== "plain") {
        let end = getLast(problem.children);
        problem.word = problem.word.slice(0, -end.word.length);
        problem.romaji = problem.romaji.slice(0, -end.romaji.length);
        if(tense === "past") {
            problem.children[index] = getPastForm(end);    
        }
        else {
            problem.children[index] = getNegativeForm(end);
        }
        problem.word += problem.children[index].word;
        problem.romaji += problem.children[index].romaji;
    }
    return problem;
}

function getRandomFilteredTense(tenses, set) {
    return getRandom(tenses.filter(t => set.has(t))).toLowerCase();
}

function applyModifyWord(problem, possible, key, before=false) {
    let grammar = GRAMMAR_OBJECT[key];
    let target = getRandom(possible);
    let index = getRandom(problem.indices[target]);
    let pos = getPositions(problem, index, before);
    problem.word = stringSplice(problem.word, pos[0], grammar.word);
    problem.romaji = stringSplice(problem.romaji, pos[1], before ? (grammar.romaji + " ") : (" " + grammar.romaji));
    problem.children.splice(before ? index : index+1, 0, grammar);
    return problem;
}

function applyReplaceDaDesu(problem, key) {
    let grammar = GRAMMAR_OBJECT[key];
    let last = getLast(problem.children);
    problem.word = problem.word.slice(0, -last.word.length) + grammar.word;
    problem.romaji = problem.romaji.slice(0, -last.romaji.length) + grammar.romaji;
    problem.children.pop();
    problem.indices["grammar"].pop();
    problem.children.push(grammar);
    return problem;
}

function getPossibleTargets(problem) {
    let result = ["noun"];
    if(problem.indices["i-adjective"])
        result.push("i-adjective");
    if(problem.indices["na-adjective"])
        result.push("na-adjective");
    if(problem.indices["verb"]) {
        result.push("verb");
    }
    return result;
}

function getParticleIndex(problem) {
    const set = new Set(["ga", "ha", "de", "to"]);
    for(let i = 0; i < problem.children.length; ++i) {
        if(set.has(problem.children[i].romaji)) {
            return i;
        }
    }
    return -1;
}

function getPlainVerbIndex(problem) {
    for(let i of problem.indices["verb"])  {
        if(!problem.children[i].form) {
            return i;
        }
    }
    return -1;
}

function getDaDesuIndex(problem) {
    return problem.indices["verb*"] ? problem.indices["verb*"][0] : -1;
}

function getAdverbIndex(problem) {
    return problem.indices["adverb"] ? problem.indices["adverb"][0] : -1;
}

function getGaIndex(problem) {
    for(let i of problem.indices["grammar"])  {
        if(problem.romaji === "ga") {
            return i;
        }
    }
    return -1;
}

export function getPositions(problem, targetIndex, before=false) {
    let result = before ? [0, 0] : [problem.children[targetIndex].word.length, problem.children[targetIndex].romaji.length];
    for(let i = 0; i < targetIndex; ++i) {
        result[0] += problem.children[i].word.length;
        result[1] += problem.children[i].romaji.length+1;
    }
    return result;
}