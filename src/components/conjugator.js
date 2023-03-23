import { getLast, getSlice } from "./helper";
import GRAMMAR_OBJECT from "../data/n5/grammar.json";


export function getPoliteForm(verb, form="") {
    if(form === "negative") {
        if(verb.category[2] === "/") {
            return {
                form: "polite-negative",
                type: "verb*",
                word:"じゃありません",
                romaji: "jaarimasen",
                verb: verb
            };
        }
        verb = getPoliteForm(verb);
        verb.form = "polite-negative";
        verb.word = getSlice(verb.word, 0, 1) + "せん";
        verb.romaji = getSlice(verb.romaji, 0, 2)  + "sen";
        return verb;
    }

    const output = {type: "verb", form: "polite", verb: verb, category: verb.category};
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
    if(verb.category[2] === "/") {
        return GRAMMAR_OBJECT["です"];
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

export function getPastForm(verb, form="") {
    if(form === "polite") {
        verb = getPoliteForm(verb);
        verb.form = "past-polite"
        verb.word = getSlice(verb.word, 0, 1) + "した";
        verb.romaji = getSlice(verb.romaji, 0, 2) + "shita";
        return verb;
    }
    else if(form === "negative") {
        if(verb.category[2] === "/") {
            verb.form = "past-negative";
            if(verb.romaji === "da") {
                verb.word = "じゃなかった";
                verb.romaji = "janakatta";
            }
            else {
               verb.word = "じゃありませんでした";
               verb.romaji = "jaarimasendeshita";
            }
            return verb;
        }
        verb = getNegativeForm(verb);
        verb.form = "past-negative";
        verb.word = verb.wStem + "かった";
        verb.romaji = verb.rStem +"katta";
        return verb;
    }
    else if(form === "polite-negative") {
        verb = getPoliteForm(verb, "negative");
        verb.form ="past-poilte-negative"
        verb.word = getSlice(verb.word, 0, 2) + "せんでした";
        verb.romaji = getSlice(verb.romaji, 0, 3)  + "sendeshita"
        return verb;
    }

    const output = {type: "verb", form: "past", verb: verb, category: verb.category};
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
    const output = {type: "verb", form: "negative", verb: verb, category: verb.category};
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
            output.word = getSlice(verb.wStem, 0, 2) + "来ない";
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
        output.wStem = "来な";
        output.rStem = "kona";
    }
    else {
        output.wStem = getSlice(output.word, 0, 1);
        output.rStem = getSlice(output.romaji, 0, 1);
    }
    return output;
}

export function getTeForm(verb, form="", nakuteForm=false) {
    if(form === "negative") {
        if(verb.category[1] === "r") {
            verb = getNegativeForm(verb);
            verb.word = verb.wStem + (nakuteForm ? "くて" : "いで");
            verb.romaji = verb.rStem + (nakuteForm ? "kute" : "ide");
        }
        else if(verb.category[1] === "c") {
            verb.word = verb.verb.wStem + (nakuteForm ? "なくて" : "ないで");
            verb.romaji = verb.verb.rStem + (nakuteForm ? "nakute" : "naide");
            verb.verb = verb;
        }
        else {
            verb = getNegativeForm(verb);
            verb.word = getSlice(verb.word, 0, 1) + (nakuteForm ? "くて" : "いで");
            verb.romaji = getSlice(verb.romaji, 0, 1) + (nakuteForm ? "kute" : "ide");
        }
        verb.form = "te-negative";
        return verb;
    }

    const output = {type: "verb", form: "te", verb: verb, category: verb.category};
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

export function getProvisionalForm(verb, form="") {
    if(form === "negative") {
        if(verb.category[1] === "r") {
            if(verb.category === "irregular-suru") {
                verb.word = verb.wStem + "しなければ";
                verb.romaji = verb.rStem + "shinakereba";
            }
            else {
                verb.word = "来なければ";
                verb.romaji = "konakereba";
            }
            verb.form = "provisional-negative";
            return verb;
        }
        else if(verb.category[1] === "c") {
            verb.word = verb.wStem + "ければ";
            verb.romaji = verb.rStem + "kereba";
            verb.form = "provisional-negative";
            return verb;
        }
        verb = getNegativeForm(verb);
        verb.form = "provisional-negative";
        verb.word = getSlice(verb.word, 0, 1) + "ければ";
        verb.romaji = getSlice(verb.romaji, 0, 1) + "kereba";
        return verb;
    }

    const output = {type: "verb", form: "provisional", verb: verb, category: verb.category};
    if(verb.category[1] === "r") {
        if(verb.category === "irregular-suru") {
            output.word = verb.wStem + "すれば";
            output.romaji = verb.rStem + "sureba";
        }
        else {
            output.word = "来れば";
            output.romaji = "koreba";
        }
    }
    else if(verb.category[1] === "c") {
        output.word = verb.wStem + "れば";
        output.romaji = verb.rStem + "reba";
    }
    else {
        let wSuffix = "";
        let rSuffix = "";
        switch(getLast(verb.word)) {
            case "く":
                wSuffix = "けば";
                rSuffix = "keba";  
                break;
            case "す":
                wSuffix = "せば";
                rSuffix = "seba";
                break;
            case "ぶ":
                wSuffix = "べば";
                rSuffix = "beba";
                break;
            case "む":
                wSuffix = "めば";
                rSuffix = "meba";
                break;
            case "ぬ":
                wSuffix = "ねば";
                rSuffix = "neba";
                break;
            case "ぐ":
                wSuffix = "げば";
                rSuffix = "geba";
                break;
            case "う":
                wSuffix = "えば";
                rSuffix = "eba";
                break;
            case "つ":
                wSuffix = "てば";
                rSuffix = "teba";
                break;
            case "る":
                wSuffix = "れば";
                rSuffix = "reba";
                break;
                
        }
        output.word = verb.wStem + wSuffix,
        output.romaji = verb.rStem + rSuffix
    }
    return output;
}