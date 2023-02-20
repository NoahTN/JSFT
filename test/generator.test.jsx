import {describe, expect, test} from "vitest";
import { getRandomWord, generateProblem } from "/src/components/generator";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = getRandomWord("n5", "noun");
        expect(noun.type).toBe("noun");
    });

    test("Should get an adjective and a noun", () => {
        const problem = generateProblem("n5", {types: ["adjective", "noun"]});
        expect(["ii-adjective", "na-adjective"]).toContain(problem[0].type);
        expect(problem[1].type).toBe("noun");
    });


    // TO IMPLEMENT
    test.skip("Should get a noun, the 'wa' particlem, and an adjective", () => {
        const problem = generateProblem("n5", {types: ["noun", "na-particle", "adjective"]});
        expect(problem[0].type).toBe("noun");
        expect(problem[1].word).toBe("wa");
        expect(["ii-adjective", "na-adjective"]).toContain(problem[2].type);
    });
})