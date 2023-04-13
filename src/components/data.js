import n5Nouns from "../data/n5/noun.json";
import n5Verbs from "../data/n5/verb.json";
import n5IAdjectives from "../data/n5/i-adjective.json";
import n5NaAdjectives from "../data/n5/na-adjective.json";
import n5Adverbs from "../data/n5/adverb.json";
import n5Katakana from "../data/n5/katakana.json";

import n4Nouns from "../data/n4/noun.json";
import n4Verbs from "../data/n4/verb.json";
import n4IAdjectives from "../data/n4/i-adjective.json";
import n4NaAdjectives from "../data/n4/na-adjective.json";
import n4Adverbs from "../data/n4/adverb.json";

export const DATA_OBJECT = {
    n4: {
        noun: n4Nouns,
        verb: n4Verbs,
        "i-adjective": n4IAdjectives,
        "na-adjective": n4NaAdjectives,
        "adverb": n4Adverbs,
    },
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