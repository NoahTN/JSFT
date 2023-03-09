import {describe, expect, test} from "vitest";
import { getRandomWord, generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = getRandomWord("n5", "noun");
        console.log([noun.word, noun.romaji]);
        expect(noun.type).toBe("noun");
    });

    test("Should get a N5 Single Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Noun"],
            "Vocab Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Single Word"],
        });
        logProblem(problem);
        expect(problem.type).toEqual("noun");

    });

    test("Should get a N5 Adjective-Noun Problem", () => {
        const problem = generateProblem({
            "Words": ["Noun", "Adjective"],
            "Vocab Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Adjective-Noun"],
        });
        logProblem(problem);
        const children = problem.children;
        expect(["i-adjective", "na-adjective"]).toContain(children[0].type);
        expect(children[children.length-1].type).toBe("noun");
    });

    test.skip("Should get a noun, the 'wa' particlem, and an adjective", () => {
        const problem = generateProblem("n5", {types: ["noun", "na-particle", "adjective"]});
        expect(problem[0].type).toBe("noun");
        expect(problem[problem].word).toBe("wa");
        expect(["i-adjective", "na-adjective"]).toContain(problem[2].type);
    });
    
    test("Should get an Basic Sentence", () => {
        const problem = generateProblem({
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Basic Sentence"],
        });
        logProblem(problem);
        const children = problem.children;
        if(children[children.length-1].type === "verb") { // Object, Verb
            expect(children[0].type).toBe("noun");
            expect(["で", "に", "へ", "と", "から"]).toContain(children[1].word);
            expect(children[2].type).toBe("verb")
        }
        else { // Subject, Object, Da/Desu
            expect(children[0].type).toBe("noun");
            expect(["が", "で", "は"]).toContain(children[1].word);
            expect(["na-adjective", "i-adjective", "noun"]).toContain(children[2].type);
            expect(["だ", "です"]).toContain(children[3].word);
        }
    });

    test.skip("Should get a Regular Sentence", () => {
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

    test.skip("Should get a Complex Sentence", () => {
        

    });

 
})