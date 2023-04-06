import n5Nouns from "../data/n5/noun.json";
import n5Verbs from "../data/n5/verb.json";
import n5IAdjectives from "../data/n5/i-adjective.json";
import n5NaAdjectives from "../data/n5/na-adjective.json";
import n5Adverbs from "../data/n5/adverb.json";
import n5Katakana from "../data/n5/katakana.json";

export const DATA_OBJECT = {
    n5: {
        noun: n5Nouns,
        verb: n5Verbs,
        "i-adjective": n5IAdjectives,
        "na-adjective": n5NaAdjectives,
        "adverb": n5Adverbs,
        "katakana":n5Katakana
    }
}

export function getRandomWord(level, type) {
    level = level.toLowerCase();
    type = type.toLowerCase();
    if(type === "adjective") {
        type = (Math.floor(Math.random() * 2) === 0) ? "i-adjective" : "na-adjective";
    }
    const data = DATA_OBJECT[level][type];
    const key = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
    return data[key];
}