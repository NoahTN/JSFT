import {describe, expect, test} from "vitest";
import { getRandomWord, generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";
import { generateSentence } from "../src/components/generator";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = getRandomWord("n5", "noun");
        console.log([noun.word, noun.romaji]);
        expect(noun.type).toBe("noun");
    });

    test("Should get a n5 single noun problem", () => {
        const problem = generateProblem({
            "Words": ["Noun"],
            "Vocab Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Single Word"],
        });
        logProblem(problem);
        expect(problem.type).toEqual("noun");

    });

    test("Should get a n5 adjective-noun problem", () => {
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
    
    test("Should get an basic sentence", () => {
        const options = {
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Basic Sentence"],
        };
        const sentenceOV = generateSentence(options, "OV");
        logProblem(sentenceOV);
        let children = sentenceOV.children;
        expect(children[0].type).toBe("noun");
        expect(["が", "は", "で", "に", "へ", "と", "から"]).toContain(children[1].word);
        expect(children[2].type).toBe("verb");

        const sentenceSOV = generateSentence(options, "SOV");
        logProblem(sentenceSOV);
        children = sentenceSOV.children;
        expect(children[0].type).toBe("noun");
        expect(["が", "で", "は"]).toContain(children[1].word);
        expect(["na-adjective", "i-adjective", "noun"]).toContain(children[2].type);
        expect(children[3].type).toBe("verb*");
    });

    test("Should get a basic object-verb sentence with a past-negative conjugated verb", () => {
        const options = {
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Past-Negative"],
            "Types": ["Basic Sentence"],
        }
        const sentence = generateSentence(options, "OV");
        logProblem(sentence);
        const children = sentence.children;
        expect(children[0].type).toBe("noun");
        expect(["が", "は", "で", "に", "へ", "と", "から"]).toContain(children[1].word);
        expect(children[2].type).toBe("verb");
        expect(children[2].form).toBe("past-negative");
    });

    test("Should get a basic subject-object-verb sentence with a past-negative conjugated da/desu", () => {
        const options = {
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Past-Negative"],
            "Types": ["Basic Sentence"],
        }
        const sentence = generateSentence(options, "SOV");
        logProblem(sentence);
        const children = sentence.children;
        expect(children[0].type).toBe("noun");
        expect(["が", "で", "は"]).toContain(children[1].word);
        expect(["na-adjective", "i-adjective", "noun"]).toContain(children[2].type);
        if(children[3].form) {
            expect(children[3].form).toBe("past-negative");
        }
        else {
            expect(children[3].type).toBe("verb*");
        }
        
    });

    test.skip("Should get a Complex Sentence", () => {
        

    });

 
})