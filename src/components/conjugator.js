import { getLast, getSlice } from "./helper";

export function getTeForm(verb) {
    const lastKana = getLast(verb.word);
    let suffixOffset = 2;
    let wSuffix = "";
    let rSuffix = "";
    // Make sure to handle exceptions up here
    switch(lastKana) {
        case "く":
            wSuffix = "いて";
            rSuffix = "ite";
            break;
        case "す":
            wSuffix = "して";
            rSuffix = "shite";
            break;
        case "ぶ":
        case "む":
        case "ぬ":
            wSuffix = "んで";
            rSuffix = "nde";
            break;
        case "ぐ":
            wSuffix = "いで";
            rSuffix = "ide";
            break;
        case "う":
        case "つ":
        case "る":
            wSuffix = "って";
            rSuffix = "tte";
            if(lastKana === "う")
                suffixOffset = 1;
            else if(lastKana === "つ")
                suffixOffset = 3;
            else {
                if(["i", "e"].includes(verb.romaji[verb.romaji.length-3])) {
                    wSuffix = "て";
                    rSuffix = "te";
                }
            }
            break;
    }
    return {
        form: "te", 
        word: getSlice(verb.word, 0, 1) + wSuffix,
        romaji: getSlice(verb.romaji, 0, suffixOffset) + rSuffix
    };
   
}