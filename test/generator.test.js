import {describe, expect, test} from "vitest";
import { getRandomWord, generateProblem } from "/src/components/generator";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = getRandomWord("n5", "nouns");
        console.log([noun.word, noun.romaji]);
        expect(noun.type).toBe("noun");
    });

    test("Should get a N5 Single Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Nouns"],
            "Vocab Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Single Word"],
        });
        console.log([problem.word, problem.romaji]);
        expect(problem.type).toEqual("noun");

    });

    test("Should get a N5 Adjective-Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Nouns", "Adjectives"],
            "Vocab Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Adjective-Noun"],
        });
        console.log([problem.word, problem.romaji]);
        const children = problem.children;
        expect(["ii-adjective", "na-adjective"]).toContain(children[0].type);
        expect(children[children.length-1].type).toBe("noun");
    });

    test.skip("Should get a noun, the 'wa' particlem, and an adjective", () => {
        const problem = generateProblem("n5", {types: ["noun", "na-particle", "adjective"]});
        expect(problem[0].type).toBe("noun");
        expect(problem[problem].word).toBe("wa");
        expect(["ii-adjective", "na-adjective"]).toContain(problem[2].type);
    });
    
    test("Should get an Basic Sentence", () => {
        const problem = generateProblem({
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Basic Sentence"],
        });
        console.log([problem.word, problem.romaji]);
        const children = problem.children;
        expect(children[0].type).toBe("noun");
        expect(["が", "で", "は"]).toContain(children[1].word);
        expect(children[2].type).toBe("noun")
        expect(["で", "に", "へ", "と", "から"]).toContain(children[3].word);
        expect(children[4].type).toBe("verb")
    });

    test.skip("Should get a Regular Sentence", () => {
        

    });

    test.skip("Should get a Complex Sentence", () => {
        

    });

 
})