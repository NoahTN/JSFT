import { getLast, getRandom, coinFlipHeads, stringSplice, formatOutput } from "./helper";
import { getAdjectiveForm, getNegativeForm, getPastForm, getTeForm, getPoliteForm, getMashouForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json";
import { DATA_OBJECT, getRandomWord } from "./data";

export function applyN5Grammar(problem, tenses, difficulty, vocabLevel, force="") {
    const verbIndex = getPlainVerbIndex(problem);
    const daDesuIndex = getDaDesuIndex(problem);
    const hasModifiableParticle = getModifiableParticleIndex(problem) !== -1;
    const commonTenses = new Set(["Plain", "Past", "Negative"]);

    function getPossibleModifications() {
        const output = [];
        if(verbIndex !== -1) {
            output.push(...["chaikenai", "hoshii", "hougaii", "kata", "mashou"]);
        }
        if(daDesuIndex !== -1) {
            output.push(...["darou", "ndesu", "doushite"]);
        }
        if(hasCategory(problem, "adjective") && (getIndex(problem, "grammar", "ga") || getIndex(problem, "grammar", "wa"))) {
            output.push(...["kata"]);
        }
        if(false) {
            output.push(...["kara"]);
        }
        output.push(...["dake", "ka", "donna", "douyatte", "ichiban", "isshoni", "itsumo", "maeni"]);

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
            let index = getModifiableParticleIndex(problem);
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
            let gaIndex = getIndex(problem, "grammar", "ga");
            if(gaIndex !== -1 && coinFlipHeads()) { //
               applyModifyAtIndex(problem, gaIndex, GRAMMAR_OBJECT["一番"]);
               return problem;
            }
            return addToFront(problem, GRAMMAR_OBJECT["一番"]);
        },
        "isshoni": () => {
            let toIndex = getIndex(problem, "grammar", "to");
            if(coinFlipHeads()) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            }
            if(toIndex !== -1 && coinFlipHeads()) {
                applyModifyAtIndex(problem, toIndex, GRAMMAR_OBJECT["一緒に"]);
                return problem;
            }
            return addToFront(problem, GRAMMAR_OBJECT["一緒に"])
        },
        "itsumo": () => {
            let pIndex = getAnyParticleIndex(problem);
            if(coinFlipHeads() && !["he", "kara", "ni", "no"].includes(problem.children[pIndex].romaji)) {
                applyModifyAtIndex(problem, pIndex, GRAMMAR_OBJECT["いつも"]);
                return problem;
            }
            return addToFront(problem, GRAMMAR_OBJECT["いつも"]);
        },
        "kara": () => {
            // save for complex sentence
        },
        "kata": () => {
            let nounIndex = getLast(problem.indices["noun"]);
            applyModifyAtIndex(problem, nounIndex, GRAMMAR_OBJECT["の"]);
            applyModifyAtIndex(problem, nounIndex+1, getRandomWord(vocabLevel, "verb"));
            applyModifyAtIndex(problem, nounIndex+2, GRAMMAR_OBJECT["方"])
            return problem;;
        },
        "kedo": () => {
            // save for complex setnence
        },
        "keredemo": () => {
            // save for complex setnence
        },
        "mada": () => {
            //teiru
        },
        "made": () => {

        },
        "maeni": () => {
            let clause = getStartClause(vocabLevel);
            if(!clause.children) { // noun
               clause = formatOutput([clause, GRAMMAR_OBJECT["の"]]);
            }
            return formatOutput([clause, GRAMMAR_OBJECT["前に"], problem]);
        },
        "mashou": () => {
            let conjugated = getMashouForm(problem.children[verbIndex]);
            applyReplaceAtIndex(problem, verbIndex, conjugated);
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

function getStartClause(vocabLevel) {
    if(coinFlipHeads()) {
        return getRandomWord(vocabLevel, "noun");
    }
    return formatOutput([getRandomWord(vocabLevel, "noun"), GRAMMAR_OBJECT["を"], getRandomWord(vocabLevel, "verb")]);
}

function addToFront(problem, word) {
    problem.word = word.word + problem.word;
    problem.romaji = word.romaji + " " + problem.romaji;
    problem.children.unshift(word);
    return problem;
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
function applyReplaceAtIndex(problem, index, word) {
    const pos = getPositions(problem, index, true);
    let target = problem.children[index];
    problem.word = problem.word.slice(0, pos[0]) + word.word + problem.word.slice(pos[0] + target.word.length);
    problem.romaji = problem.romaji.slice(0, pos[1]) + word.romaji + problem.romaji.slice(pos[1] + target.romaji.length);
    problem.children[index] = word;  
}

function applyModifyAtIndex(problem, index, word, before=false) {
    const pos = getPositions(problem, index, before);
    problem.word = stringSplice(problem.word, pos[0], word.word);
    problem.romaji = stringSplice(problem.romaji,  pos[1], before ? (word.romaji + " ") : (" " + word.romaji));
    problem.children.splice(index, 0, word);
}

function applyModifyWord(problem, possible, key, before=false) {
    let grammar = GRAMMAR_OBJECT[key];
    let target = getRandom(possible);
    let index = getRandom(problem.indices[target]);
    if(grammar.alt && grammar.alt[target]) {
        grammar.word = grammar.alt[target].word;
        grammar.romaji = grammar.alt[target].romaji;
    }
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

function getModifiableParticleIndex(problem) {
    const set = new Set(["ga", "wa", "de", "to"]);
    for(let i of problem.indices["grammar"]) {
        if(set.has(problem.children[i].romaji)) {
            return i;
        }
    }
    return -1;
}

function getAnyParticleIndex(problem) {
    const set = new Set(["ga", "wa", "de", "to", "ni", "kara", "no"]);
    for(let i of problem.indices["grammar"]) {
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

function getIndex(problem, category, romaji) {
    for(let i of problem.indices[category])  {
        if(problem.children[i] === romaji) {
            return i;
        }
    }
    return -1;
}

function hasCategory(problem, category) {
    if(category[0] === "a") {
        return problem.indices["i-adjective"] || problem.indices["na-adjective"];
    }
    return problem.indices[category];
}

export function getPositions(problem, targetIndex, before=false) {
    let result = before ? [0, 0] : [problem.children[targetIndex].word.length, problem.children[targetIndex].romaji.length];
    for(let i = 0; i < targetIndex; ++i) {
        result[0] += problem.children[i].word.length;
        result[1] += problem.children[i].romaji.length+1;
    }
    return result;
}