import { getLast, getRandom, getRandomNumber } from "./helper";
import { getAdjectiveForm, getTeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json";
import { DATA_OBJECT } from "./data";
import { generateSentence } from "./generator";

export function applyN5Grammar(problem, tenses, difficulty, vocabLevel, force="") {
    const hasPlainVerb = checkHasPlainVerb(problem);
    const hasDaDesu = checkHasDaDesu(problem);
    const hasModifiableParticle = getParticleIndex(problem) !== -1;

    function getPossibleModifications() {
        const output = [];
        if(hasPlainVerb) {
            output.push("chaikenai");
            output.push("hoshii");
        }
        if(hasDaDesu) {
            output.push("darou");
            output.push("ndesu");
            output.push("doushite");
        }
        output.push(...["dake", "ka", "donna", " douyatte"]);

        return output;
    }
    const grammar = {
        "chaikenai": () => {
            const verbIndex = problem.types.indexOf("verb");
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
            problem.types.push("chaikenai");
            return problem;
        },
        "dake": () => {
            let possible = getPossibleTargets(problem, hasPlainVerb);
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
                problem.types.pop();
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
            if(getRandomNumber(2) === 0 || !hasModifiableParticle) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
                return applyModifyWord(problem, ["noun"], "どうやって", true);
            }
            let index = getParticleIndex(problem);
            let pos = getPositions(problem, index);
            if(getRandomNumber(2) === 0) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
            }
            problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            problem.word = stringSplice(problem.word, pos[0], "どうやって");
            problem.romaji = stringSplice(problem.romaji, pos[1], " douyatte");
            problem.children.splice(index, 0, GRAMMAR_OBJECT["どうやって"]);
            return problem;
        },
        "hoshii": () => {
            const verbIndex = problem.types.indexOf("verb");
            const teForm = getTeForm(problem.children[verbIndex]);
            const hoshii = getAdjectiveForm(DATA_OBJECT[vocabLevel.toLowerCase()]["i-adjective"]["hoshii"], getRandom(tenses));
            problem.word = problem.word.slice(0, -problem.children[verbIndex].word.length) + teForm.word + hoshii.word;
            problem.romaji = problem.romaji.slice(0, -problem.children[verbIndex].romaji.length) + teForm.romaji + " " + hoshii.romaji; 
            problem.children.push(hoshii);
            problem.children[verbIndex] = teForm;
            problem.types.push("adjective");
            return problem;
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


function applyModifyWord(problem, possible, key, before=false) {
    let grammar = GRAMMAR_OBJECT[key];
    let target = getRandom(possible);
    let index = problem.types.indexOf(target);
    let pos = getPositions(problem, index);
    pos[0] -= before ? problem.children[index].word.length : 0;
    pos[1] -= before ? problem.children[index].romaji.length : 0;
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
    problem.types.pop();
    problem.children.push(grammar);
    return problem;
}

function getPossibleTargets(problem, hasPlainVerb) {
    let result = ["noun"];
    if(problem.set.has("i-adjective"))
        result.push("i-adjective");
    if(problem.set.has("na-adjective"))
        result.push("na-adjective");
    if(hasPlainVerb) {
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

function checkHasPlainVerb(problem) {
    for(let c of problem.children) {
        if(c.type === "verb" && !c.form) {
            return true;
        }
    }
    return false;
}

function checkHasDaDesu(problem) {
    for(let c of problem.children) {
        if(c.type === "verb*") {
            return true;
        }
    }
    return false;
}

function getPositions(problem, targetIndex) {
    let result = [problem.children[targetIndex].word.length, problem.children[targetIndex].romaji.length];
    for(let i = 0; i < targetIndex; ++i) {
        result[0] += problem.children[i].word.length;
        result[1] += problem.children[i].romaji.length+1;
    }
    return result;
}

function stringSplice(string, pos, newString) {
    return string.slice(0, pos) + newString + string.slice(pos);
}