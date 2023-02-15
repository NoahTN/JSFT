import {describe, expect, test} from "vitest";
import { generateProblem } from "/src/generator";

describe("Generator Tests", () => {
    test("Should get random noun", () => {
        const noun = generateProblem("n5", "nouns");
        expect(Object.keys(noun)).toEqual(Object.keys({word: "", kana: "", romaji: "", meaning: ""}));
    });
})