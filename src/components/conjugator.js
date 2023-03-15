import { getLast, getSlice } from "./helper";

export function getMasuForm(verb) {
    const output = {type: "verb", form: "masu", verb: verb};
    const map = {
       "う": ["い", "i"],
       "く": ["き", "ki"],
       "す": ["し", "shi"],
       "つ": ["ち", "chi"],
       "ぬ": ["に", "ni"],
       "む": ["み", "mi"],
       "る": ["り", "ri"],
       "ぐ": ["ぎ", "gi"],
       "ぶ": ["ぎ", "ba"],
    };
    if(verb.word === "desu") {
        return verb;
    }
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
        "む": ["ま", "ma"],
        "る": ["ら", "ra"],
        "ぐ": ["が", "ga"],
        "ぶ": ["ば", "ba"]
     };
    const output = {type: "verb", form: "negative", verb: verb};
    if(verb.category[2] === "/") {
        if(verb.romaji === "da") {
            output.word = "じゃない";
            output.romaji = "janai";
        }
        else {
            output.word = "じゃありません";
            output.romaji = "jaarimasen";
        }
    }
    else if(verb.category[1] === "r") {
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
    const output = {type: "verb", form: "past", verb: verb};
    if(verb.category[2] === "/") {
        if(verb.romaji === "da") {
            output.word = "だった";
            output.romaji = "datta";
        }
        else {
            output.word = "でした";
            output.romaji = "deshita";
        }
    }
    else if(verb.category[1] === "r") {
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
    if(verb.category[2] === "/") {
        const output = {
            form: "past-negative",
            type: "verb*",
            verb: verb
        }
        if(verb.romaji === "da") {
            output.word = "じゃなかった";
            output.romaji = "janakatta";
        }
        else {
            output.word = "じゃありませんでした";
            output.romaji = "jaarimasendeshita";
        }
        return output;
    }
    const negative = getNegativeForm(verb);
    return {
        form: "past-negative",
        type: "verb",
        word: negative.wStem + "かった",
        romaji: negative.rStem + "katta",
        verb: verb
    };
}

export function getTeForm(verb) {
    const output = {type: "verb", form: "te", verb: verb};
    // Make sure to handle exceptions up here
    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = getSlice(verb.word, 0, 2) + "して";
            output.romaji = getSlice(verb.romaji, 0, 4) + "shite";
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