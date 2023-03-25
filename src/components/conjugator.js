import GRAMMAR_OBJECT from "../data/n5/grammar.json";
import { conjugate, conjugateAuxiliaries } from "kamiya-codec";
import { isHiragana, toRomaji } from "wanakana";


function isIchidan(verb) {
    return verb.category[0] === "i";
}

function doConjugation(form, aux, verb, formName, kuruRomaji="ko") {
    const output = {type: "verb", form: formName, verb: verb, category: verb.category};
    let index = 0;
    if(formName === "provisional") {
        index = 1;
    }

    if(verb.category === "irregular-suru") {
        output.word = verb.wStem + conjugateAuxiliaries("する", aux, form)[index];
        output.romaji = verb.rStem + toRomaji(output.word.slice(verb.wStem.length));
    }
    else if(verb.category === "irregular-kuru") {
        output.word = conjugateAuxiliaries("来る", aux, form)[index];
        output.romaji = kuruRomaji + toRomaji(output.word.slice(1));
        
    }
    else if(verb.type === "verb*") {
        if(form === "Negative") {
            output.word = verb.romaji === "da" ? "じゃない" : "じゃありません";
        }
        else if(form === "Ta") {
            output.word = verb.romaji === "da" ? "だった" : "でした";
        }
        output.romaji = toRomaji(output.word);
    }
    else {
        if(formName === "volitional" && !isIchidan(verb)) {
            index = 1;
        }
        output.word = conjugateAuxiliaries(verb.word, aux, form, isIchidan(verb))[index];
        output.romaji = verb.rStem + toRomaji(output.word.slice(verb.wStem.length));
    }
    return output;
}

export function getPoliteForm(verb, form="polite") {
    if(form !== "polite") {
        return doConjugation("Negative", ["Masu"], verb, form, "ki");
    }
    return doConjugation("Dictionary", ["Masu"], verb, form, "ki");
}

export function getPastForm(verb, form="") {
    if(form === "polite") {
        return doConjugation("Ta", ["Masu"], verb, "past-polite", "ki");
    }
    else if(form === "negative") {
        if(verb.type === "verb*") {
            let output = {type: "verb", form: "past-negative", verb: verb, category: verb.category};
            output.word = verb.romaji === "da" ? "じゃなかった" : "じゃありませんでした"
            output.romaji = toRomaji(output.word);
            return output;
        }
        return doConjugation("Ta", ["Nai"], verb, "past-negative");
    }
    else if(form === "polite-negative") {
        if(verb.type === "verb*") {
            let output = {type: "verb", form: "past-polite-negative", verb: verb, category: verb.category};
            output.word = "じゃありませんでした";
            output.romaji = toRomaji(output.word);
            return output;
        }
        let output = doConjugation("Negative", ["Masu"], verb, "past-polite-negative", "ki");
        output.word +=  "でした";
        output.romaji += "deshita";
        return output;
    }

    return doConjugation("Ta", [], verb, form, "ki");
}


export function getNegativeForm(verb) {
    if(verb.type === "verb*") {
        return doConjugation("Negative", [], verb, "negative");
    }
    return doConjugation("Dictionary", ["Nai"], verb, "negative");
}

export function getTeForm(verb, form="", nakuteForm=false) {
    if(form === "negative") {
        let output = doConjugation("Te", ["Nai"], verb, "te-negative", "ko");
        if(!nakuteForm) {
            output.word = output.word.slice(0, -3) + "ないで";
            output.romaji = output.romaji.slice(0, -6) + "naide";
        }
        return output;
    }
    return  doConjugation("Te", [], verb, "te", "ki");
   
}

export function getProvisionalForm(verb, form="") {
    if(form === "negative") {
        return doConjugation("Conditional", ["Nai"], verb, "provisional-negative");
    }
    return doConjugation("Conditional", [], verb, "provisional");
}

export function getConditionalForm(verb, form="") {
    if(form === "negative") {
        return doConjugation("Tara", ["Nai"], verb, "conditional-negative");
    }
    return doConjugation("Tara", [], verb, "conditional", "ki");
}

export function getImperativeForm(verb, form="") {
    return doConjugation("Imperative", [], verb, "imperative");
}

export function getVolitionalForm(verb, form="") {
    if(form === "polite") {
        return doConjugation("Volitional", ["Masu"], verb, "volitional-polite", "ki");
    }
    return doConjugation("Volitional", [], verb, "volitional");
}

export function getPotentialForm(verb, form="") {
    if(form === "negative") {
        if(verb.category === "irregular-suru") {
            return {type: "verb", form: "potential", word: verb.wStem + "できない", romaji: verb.rStem + "dekinai", verb: verb, category: verb.category};
        }
        else if(verb.category === "irregular-kuru") {
            return {type: "verb", form: "potential", word: "来られない", romaji: "korarenai", verb: verb, category: verb.category};
        }
        else if(isIchidan(verb)) {
            let output = doConjugation("Negative", ["Potential"], verb, "potential");
            output.word = output.word.slice(0, -1) + "ら" + output.word.slice(-1) + "ない";
            output.romaji = output.romaji.slice(0, -2) + "ra" + output.romaji.slice(-2) + "nai";
            return output;
        }
        else {
            let output = doConjugation("Negative", ["Potential"], verb, "potential-negative");
            output.word += "ない"
            output.romaji += "nai";
            return output;
        }
    }
    else if(form === "past-negative") {
        let output = getPotentialForm(verb, "negative");
        output.word = output.word.slice(0, -1) + "かった";
        output.romaji = output.romaji.slice(0, -1) + "katta";
        return output;
    }

    if(verb.category === "irregular-suru") {
        return {type: "verb", form: "potential", word: verb.wStem + "できる", romaji: verb.rStem + "dekiru", verb: verb, category: verb.category};
    }
    else if(verb.category === "irregular-kuru") {
        return {type: "verb", form: "potential", word: "来られる", romaji: "korareru", verb: verb, category: verb.category};
    }
    else if(isIchidan(verb)) {
        let output = doConjugation("Dictionary", ["Potential"], verb, "potential");
        output.word = output.word.slice(0, -2) + "ら" + output.word.slice(-2);
        output.romaji = output.romaji.slice(0, -4) + "ra" + output.romaji.slice(-4);
        return output;
    }
    return doConjugation("Dictionary", ["Potential"], verb, "potential");
}

export function getPassiveForm(verb, form="") {
    if(form === "past") {
        let output = doConjugation("Dictionary", ["ReruRareru"], verb, "passive-past");
        output.word = output.word.slice(0, -1) + "た";
        output.romaji = output.romaji.slice(0, -2) + "ta";
        return output;
    }
    return doConjugation("Dictionary", ["ReruRareru"], verb, "passive");
}

export function getCausativeForm(verb, form="") {
    if(form === "passive") {
        return doConjugation("Dictionary", ["CausativePassive"], verb, "causative-passive");
    }
    else if(form === "passive-past") {
        let output = doConjugation("Dictionary", ["CausativePassive"], verb, "causative-passive-past");
        output.word = output.word.slice(0, -1) + "た";
        output.romaji = output.romaji.slice(0, -2) + "ta";
        return output;
    }
    return doConjugation("Dictionary", ["SeruSaseru"], verb, "causative");
}