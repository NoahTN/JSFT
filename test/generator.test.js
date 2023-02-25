import {describe, expect, test} from "vitest";
import { getRandomWord, generateProblem, getN5Grammar } from "/src/components/generator";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = getRandomWord("n5", "nouns");
        expect(noun.type).toBe("noun");
    });

    test("Should get a N5 Basic Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Nouns"],
            "Vocab": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Basic"],
        });
        expect(problem[0].type).toEqual("noun");

    });

    test("Should get a N5 Adjective-Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Nouns", "Adjectives"],
            "Vocab": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Adjective-Noun"],
        });
        expect(["ii-adjective", "na-adjective"]).toContain(problem[0].type);
        expect(problem[1].type).toBe("noun");
    });

    test.skip("Should get a Basic Sentence Problem", () => {

    });

    test("Should get a chaikenai problem", () => {
        const problem = getN5Grammar("ちゃいけない", "N5", {word: "歩く", romaji: "aruku"});
        expect(problem.word).toBe("歩いちゃいけない");
        expect(problem.romaji).toBe("aruichaikenai");
        expect(problem.child).toBeDefined();
    });

    test.skip("Should get a noun, the 'wa' particlem, and an adjective", () => {
        const problem = generateProblem("n5", {types: ["noun", "na-particle", "adjective"]});
        expect(problem[0].type).toBe("noun");
        expect(problem[1].word).toBe("wa");
        expect(["ii-adjective", "na-adjective"]).toContain(problem[2].type);
    });
    
    test.skip("Should get a 'cha-ikenai' problem", () => {

    });

    test.skip("Should get a random N5 grammar problem", () => {

    });
})