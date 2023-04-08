import { getLast, getRandom, coinFlipHeads, stringSplice, formatOutput, getRandomNumber } from "./helper";
import { getAdjectiveForm, getNegativeForm, getPastForm, getTeForm, getPoliteForm, getMashouForm, getPotentialForm, getTaiForm, getTeiruForm } from "./conjugator";
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
            output.push(...["chaikenai", "hoshii", "hou ga ii", "kata", "mashou", 
                            "mou", "nakutemo ii", "nakucha", "nakute wa ikenai", "nakute wa naranai", 
                            "ni iku", "no ga heta", "no ga jouzu", "no ga suki", "sugiru"]);
        }
        if(daDesuIndex !== -1) {
            output.push(...["darou", "ndesu", "doushite"]);
        }
        if(hasCategory(problem, "adjective")) {
            if(getIndex(problem, "grammar", "ga") || getIndex(problem, "grammar", "wa")) {
                output.push(...["kata", "naru", "sugiru"]);
            }
        }
        if(false) { // complex
            output.push(...["kara", "node", "shikashi"]);
        }
        if(lastIsNoun()) {
            output.push(...["nisuru"]);
        }
        output.push(...["dake", "ka", "donna", "douyatte", "ichiban", "isshoni", "itsumo", "mae ni", "na", "ne"]);

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
            problem.romaji += " ka";
            problem.children.push(GRAMMAR_OBJECT["か"]);
            return problem;
        },
        "no": () => {

        },
        "ndesu": () => {
            let last = getLast(problem.children);
            if(last.romaji === "da" || last?.verb?.romaji === "da") {
                return applyReplaceDaDesu(problem, "んだ");
            }
            if(last.romaji === "desu" || last?.verb?.romaji === "desu") {
                return applyReplaceDaDesu(problem, "んです");
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
        "hou ga ii": () => {
            conjugateEnd(problem, verbIndex, coinFlipHeads() ? "past": "negative");
            problem.word += "方がいい";
            problem.romaji += " hou ga ii";
            problem.children.push(GRAMMAR_OBJECT["方がいい"]);
            return problem;
        },
        "ichiban": () => {
            let gaIndex = getIndex(problem, "particle", "ga");
            if(gaIndex !== -1 && coinFlipHeads()) { //
               applyModifyAtIndex(problem, gaIndex, GRAMMAR_OBJECT["一番"]);
               return problem;
            }
            addToFront(problem, GRAMMAR_OBJECT["一番"]);
            return problem;
        },
        "isshoni": () => {
            let toIndex = getIndex(problem, "particle", "to");
            if(coinFlipHeads()) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            }
            if(toIndex !== -1 && coinFlipHeads()) {
                applyModifyAtIndex(problem, toIndex, GRAMMAR_OBJECT["一緒に"]);
                return problem;
            }
            addToFront(problem, GRAMMAR_OBJECT["一緒に"]);
            return problem;
        },
        "itsumo": () => {
            let pIndex = getAnyParticleIndex(problem);
            if(coinFlipHeads() && !["he", "kara", "ni", "no"].includes(problem.children[pIndex].romaji)) {
                applyModifyAtIndex(problem, pIndex, GRAMMAR_OBJECT["いつも"]);
                return problem;
            }
            addToFront(problem, GRAMMAR_OBJECT["いつも"]);
            return problem;
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
        "mae ni": () => {
            let clause = getStartClause(vocabLevel);
            if(!clause.children) { // noun
               clause = formatOutput([clause, GRAMMAR_OBJECT["の"]]);
            }
            return formatOutput([clause, GRAMMAR_OBJECT["前に"], problem]);
        },
        "mashou": () => {
            let conjugated = getMashouForm(problem.children[verbIndex]);
            applyReplaceAtIndex(problem, verbIndex, conjugated);
            if(coinFlipHeads()) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            }
            return problem;              
        },
        "mou": () => {
            let verb = problem.children[verbIndex];
            let conjugated = coinFlipHeads() ? getPastForm(verb) : getNegativeForm(verb);
            applyReplaceAtIndex(problem, verbIndex, conjugated);
            addToFront(problem, GRAMMAR_OBJECT["もう"]);
            return problem;
        },
        "na": () => {
            if(coinFlipHeads()) {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ka");
            }
            return formatOutput([problem, GRAMMAR_OBJECT["なあ"]]);
        },
        "nakutemo ii": () => {
            conjugateEnd(problem, verbIndex, "negative");
            problem.word = problem.word.slice(0, -1) + "くてもいい";
            problem.romaji = problem.romaji.slice(0, -1) + "kutemo ii";
            problem.children.push(GRAMMAR_OBJECT["なくてもいい"]);
            if(coinFlipHeads()) {
                addToEnd(problem, GRAMMAR_OBJECT["です"]);
            }
            if(coinFlipHeads()) {
                addToEnd(problem, GRAMMAR_OBJECT["よ"]);
            }
            return problem;
        },
        "ikenai": () => {
            addToEnd(problem, GRAMMAR_OBJECT["いけない"]);
            return problem;
        },
        "nakucha": () => {
            conjugateEnd(problem, verbIndex, "negative");
            problem.word = problem.word.slice(0, -1) + "くちゃ";
            problem.romaji = problem.romaji.slice(0, -1) + "kucha";
            problem.children.push(GRAMMAR_OBJECT["なくちゃ"]);
            if(coinFlipHeads()) {
                if(coinFlipHeads()) {
                    addToEnd(problem, DATA_OBJECT["n5"]["na-adjective"]["dame"]);
                }
                else {
                    problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ikenai");
                }
            }
            return problem;
        },
        "nakute wa ikenai": () => {
            conjugateEnd(problem, verbIndex, "negative");
            problem.word = problem.word.slice(0, -1) + "くてはいけない";
            problem.romaji = problem.romaji.slice(0, -1) + "kute wa ikenai";
            problem.children.push(GRAMMAR_OBJECT["なくてはいけない"]);
            return problem;
        },
        "nakute wa naranai": () => {
            conjugateEnd(problem, verbIndex, "negative");
            problem.word = problem.word.slice(0, -1) + "くてはならない";
            problem.romaji = problem.romaji.slice(0, -1) + "kute wa naranai";
            problem.children.push(GRAMMAR_OBJECT["なくてはならない"]);
            return problem;
        },
        "naru": () => {
            let naru = DATA_OBJECT["n5"]["verb"]["naru"];
            let naIndices = problem.indices["na-adjective"] ?? [];
            let iIndices = problem.indices["i-adjective"] ?? [];
            let adjIndex = getRandom(naIndices.concat(iIndices));
            let adj = problem.children[adjIndex];
            let formMap = {
                "polite": () => getPoliteForm(naru),
                "past": () => getPastForm(naru),
                "tai": () => getTaiForm(naru),
                "teiru": () => getTeiruForm(naru),
            };
            naru = formMap[getRandom(Object.keys(formMap))]();

            if(adj.type === "na-adjective") {
                applyModifyAtIndex(problem, adjIndex, GRAMMAR_OBJECT["に"]);
                applyModifyAtIndex(problem, adjIndex+1, naru);
            }
            else {
                adj.word = adj.word.slice(0, -1) + "く";
                adj.romaji = adj.romaji.slice(0, -1) + "ku";
                applyReplaceAtIndex(problem, adjIndex, adj);
                applyModifyAtIndex(problem, adjIndex, naru);
            }
            if(getLast(problem.children).type === "verb*") {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
            }
            return problem;
        },
        "ne": () => {
            addToEnd(problem, GRAMMAR_OBJECT["ね"]);
            return problem;
        },
        "ni iku": () => {
            let verb = getPoliteForm(problem.children[verbIndex]);
            verb.word = verb.word.slice(0, -2);
            verb.romaji = verb.romaji.slice(0, -4);
            applyReplaceAtIndex(problem, verbIndex, verb, false);
            applyModifyAtIndex(problem, verbIndex, GRAMMAR_OBJECT["に行く"]);
            return problem;
        },
        "ni suru": () => {
            if(daDesuIndex !== -1) {
                removeFromEnd(problem);
            }
            addToEnd(problem, GRAMMAR_OBJECT["にする"]);
            return problem;
        },
        "no ga heta": () => {
            addToEnd(problem, GRAMMAR_OBJECT["のが下手"]);
            return problem;
        },
        "no ga jouzu": () => {
            addToEnd(problem, GRAMMAR_OBJECT["のが上手"]);
            return problem;
        },
        "no ga suki": () => {
            addToEnd(problem, GRAMMAR_OBJECT["のが好き"]);
            return problem;
        },
        "node": () => {
            // complex
        },
        "shikashi": () => {
            // complex   
        },
        "sugiru": () => {
            let index = verbIndex === -1 ? (getLast(problem.indices["na-adjective"] ?? problem.indices["i-adjective"])) : verbIndex;
            let target = problem.children[index];
            if(target.type === "verb") {
                let verb = getPoliteForm(target);
                verb.word = verb.word.slice(0, -2);
                verb.romaji = verb.romaji.slice(0, -4);
                applyReplaceAtIndex(problem, index, verb, false);
                
            }

            applyModifyAtIndex(problem, index, GRAMMAR_OBJECT["すぎる"]);

            if(target.type[0] === "i") {
                let pos = getPositions(problem, index, true);
                problem.word = problem.word.slice(0, pos[0]) + target.word.slice(0, -1) + problem.word.slice(pos[0]+target.word.length);
                problem.romaji = problem.romaji.slice(0, pos[1]) + target.romaji.slice(0, -1) + problem.romaji.slice(pos[1]+target.romaji.length);
            }
            
            if(getLast(problem.children).type === "verb*") {
                problem = applyN5Grammar(problem, tenses, difficulty, vocabLevel, "ndesu");
            }
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
}

function addToEnd(problem, word) {
    problem.word += word.word
    problem.romaji += " " + word.romaji;
    problem.children.push(word);
}

function removeFromEnd(problem) {
    let removed = problem.children.pop();
    problem.indices[removed.type].pop();
    problem.word = problem.word.slice(0, -removed.word.length);
    problem.romaji = problem.romaji.slice(0, -removed.romaji.length);
    problem.romaji = problem.romaji.trim();
}

function conjugateEnd(problem, index, tense) {
    if(tense !== "plain") {
        let end = getLast(problem.children);
        problem.word = problem.word.slice(0, -end.word.length);
        problem.romaji = problem.romaji.slice(0, -end.romaji.length);
        if(tense === "past") {
            problem.children[index] = getPastForm(end);    
        }
        else if(tense === "negative"){
            problem.children[index] = getNegativeForm(end);
        }
        problem.word += problem.children[index].word;
        problem.romaji += problem.children[index].romaji;
    }
}

function getRandomFilteredTense(tenses, set) {
    return getRandom(tenses.filter(t => set.has(t))).toLowerCase();
}
function applyReplaceAtIndex(problem, index, word, conjugation=true) {
    const pos = getPositions(problem, index, true);
    let target = problem.children[index];
    problem.word = problem.word.slice(0, pos[0]) + word.word + problem.word.slice(pos[0] + target.word.length);
    problem.romaji = problem.romaji.slice(0, pos[1]) + word.romaji + problem.romaji.slice(pos[1] + target.romaji.length);
    if(conjugation) {
        problem.children[index] = word;  
    }
}

function applyModifyAtIndex(problem, index, word, before=false) {
    const pos = getPositions(problem, index, before);
    problem.word = stringSplice(problem.word, pos[0], word.word);
    problem.romaji = stringSplice(problem.romaji, pos[1], before ? (word.romaji + " ") : (" " + word.romaji));
    problem.children.splice(index, 0, word);
}

function applyModifyWord(problem, possible, key, before=false, suffix=null) {
    let grammar = GRAMMAR_OBJECT[key];
    let target = getRandom(possible);
    let index = getRandom(problem.indices[target]);
    let pos = getPositions(problem, index, before);
    problem.word = stringSplice(problem.word, pos[0], grammar.word);
    problem.romaji = stringSplice(problem.romaji, pos[1], before ? (grammar.romaji + " ") : (" " + grammar.romaji));
    problem.children.splice(before ? index : index+1, 0, grammar);
    return problem;
}

function applyReplaceDaDesu(problem, key, remove=false) {
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
    let particles = ["ga", "wa", "de", "to"];
    for(let p of particles) {
        if(problem.particles[p]) {
            return getRandom(problem.particles[p]);
        }
    }
    return -1;
}

function getAnyParticleIndex(problem) {
    let keys = Object.keys(problem.particles);
    return keys.length ? getRandom(problem.particles[getRandom(keys)]) : -1;
}

function getPlainVerbIndex(problem) {
    for(let i of problem.indices["verb"] ?? [])  {
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

function lastIsNoun(problem) {
    let last = getLast(problem.children);
    if(["da", "desu"].incluldes(last.romaji)) {
        last = problem.children.slice(-2, -1);
    }
    return ["noun", "na-adjective"],includes(last.type);
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