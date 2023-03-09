import { getLast, getSlice } from "./helper";

export function getMasuForm(verb) {
    const output = {form: "masu", verb: verb};
    const map = {
       "う": ["い", "i"],
       "く": ["き", "ki"],
       "す": ["し", "shi"],
       "つ": ["ち", "chi"],
       "ぬ": ["に", "ni"],
       "ふ": ["ひ", "hi"],
       "む": ["み", "mi"],
       "る": ["り", "ri"]
    };

    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = verb.wStem + "します";
            output.romaji = verb.rStem + "shimasu";
        }
        else {
            output.word = verb.wStem + "ます";
            output.romaji = getSlice(verb.rStem, 0, 1) + "imasu";
        }
    }
    else if(verb.category[1] === "c") {
        output.word = getSlice(verb.word, 0, 1) + "ます";
        output.romaji = getSlice(verb.romaji, 0, 2) + "masu";
    }
    else {
        output.word = verb.wStem + map[getLast(verb.word)][0] + "ます";
        output.romaji = verb.rStem + map[getLast(verb.word)][1]  + "masu";
    }
    return output;
}

export function getNegativeForm(verb) {
    const map = {
        "う": ["あ", "a"],
        "く": ["か", "ka"],
        "す": ["さ", "sa"],
        "つ": ["た", "ta"],
        "ぬ": ["な", "na"],
        "ふ": ["は", "ha"],
        "む": ["ま", "ma"],
        "る": ["ら", "ra"]
     };
    const output = {form: "negative"};
    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = verb.wStem + "しない"
            output.romaji = verb.rStem + "shinai"
        }
        else {
            output.word = getSlice(verb.wStem, 0, 2) + "こない";
            output.romaji = getSlice(verb.rStem, 0, 4) + "konai";
        }
    }
    else if(verb.category[1] === "c") {
        output.word = verb.wStem + "ない";
        output.romaji = verb.rStem + "nai";
    }
    else {
        if(getLast(verb.word) === "う") {
            output.word = verb.wStem + "わない";
            output.romaji = verb.rStem + "wanai";
        }
        else {
            output.word = verb.wStem + map[getLast(verb.word)][0] + "ない";
            output.romaji = verb.rStem + map[getLast(verb.word)][1] + "nai";
        }
    }
    if(verb.romaji === "kuru") {
        output.wStem = "こな";
        output.rStem = "kona";
    }
    else {
        output.wStem = getSlice(output.word, 0, 1);
        output.rStem = getSlice(output.romaji, 0, 1);
    }
    return output;
}

export function getPastForm(verb) {
    const output = {form: "past", verb: verb};
    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = verb.wStem + "した";
            output.romaji = verb.rStem + "shita";
        }
        else {
            output.word = verb.wStem + "た";
            output.romaji = getSlice(verb.rStem, 0, 3) + "ita";
        }
    }
    else if(verb.category[1] === "c") {
        output.word = verb.wStem + "た";
        output.romaji = verb.rStem + "ta";
    }
    else {
        let wSuffix = "";
        let rSuffix = "";
        switch(getLast(verb.word)) {
            case "く":
                if(verb.word === "行く") {
                    wSuffix = "った";
                    rSuffix = "tta";
                }
                else {
                    wSuffix = "いだ";
                    rSuffix = "ita";
                }     
                break;
            case "す":
                wSuffix = "しだ";
                rSuffix = "shita";
                break;
            case "ぶ":
            case "む":
            case "ぬ":
                wSuffix = "んだ";
                rSuffix = "nda";
                break;
            case "ぐ":
                wSuffix = "いだ";
                rSuffix = "ida";
                break;
            case "う":
            case "つ":
            case "る":
                wSuffix = "った";
                rSuffix = "tta";
                break;
                
        }
        output.word = verb.wStem + wSuffix,
        output.romaji = verb.rStem + rSuffix
    }
    return output;
}

export function getPastNegaitveForm(verb) {
    const negative = getNegativeForm(verb);
    return {
        form: "past-negative",
        word: negative.wStem + "かった",
        romaji: negative.rStem + "katta",
        verb: verb
    };
}

export function getTeForm(verb) {
    const output = {form: "te", verb: verb};
    // Make sure to handle exceptions up here
    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = "して";
            output.romaji = "shite";
        }
        else {
            output.word = verb.wStem + "て";
            output.romaji = getSlice(verb.rStem, 0, 1) + "ite";
        }
    }   
    else if(verb.category[1] === "c") {
        output.word = verb.wStem + "て";
        output.romaji = verb.rStem + "te";
    }
    else {
        let wSuffix = "";
        let rSuffix = "";
        switch(getLast(verb.word)) {
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
                break;
        }
        output.word = verb.wStem + wSuffix,
        output.romaji = verb.rStem + rSuffix
    }
    return output;
   
}
// const output = {form: "masu"};
// if(verb.category[1] === "r") {
//     if(verb.category === "irregular-suru") {
//     }
//     else {

//     }
// }
// else if(verb.category[1] === "c") {

// }
// else {
    
// }