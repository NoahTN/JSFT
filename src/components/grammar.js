import { getLast, getRandom } from "./helper";
import { getTeForm } from "./conjugator";
import GRAMMAR_OBJECT from "../data/n5/grammar.json";

export function applyN5Grammar(problem, difficulty, vocabLevel, category="") {
    function getPossibleModifications() {
        const output = [];
        const verbIndex = problem.breakpoints.types.indexOf("verb");
        if(verbIndex !== -1 && !problem.children[verbIndex].form) {
            output.push("ちゃいけない");
           // output.push("だけ");
        }
        return output;
    }
    const grammar = {
        "ちゃいけない": () => {
            const verbIndex = problem.breakpoints.types.indexOf("verb");
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
            console.log(teForm.word.slice(0, -2));
            problem.romaji = problem.romaji.slice(0, -problem.children[verbIndex].romaji.length) + teForm.romaji.slice(0, -offset) + rSuffix;
            problem.children.push(GRAMMAR_OBJECT["ちゃいけない"]);
            problem.children[verbIndex] = teForm;
            problem.breakpoints.words[problem.breakpoints.words.length-1] -= (problem.children[verbIndex].word.length - teForm.word.length);
            problem.breakpoints.words.push(getLast(problem.breakpoints.words)+wSuffix.length);
            problem.breakpoints.romaji[problem.breakpoints.romaji.length-1] -= (problem.children[verbIndex].romaji.length - teForm.romaji.length);
            problem.breakpoints.romaji.push(getLast(problem.breakpoints.romaji)+rSuffix.length);
            problem.breakpoints.types.push("grammar");
            return problem;
        }
    }

    if(category) {
        return grammar[category]();
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