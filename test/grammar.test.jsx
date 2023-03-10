import {describe, expect, test} from "vitest";
import { applyN5Grammar } from "../src/components/grammar";
import { getRandomWord, generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";
import { generateSentence } from "../src/components/generator";

describe("Grammar Tests", () => {
    test("Should apply the chaikenai grammar to an n5 sentence", () => {
        const options = {
            "Vocab Level": ["N5"],
            "Grammar Level": ["N5"],
            "Tenses": ["Plain"],
            "Types": ["Basic Sentence"],
        }
        const problem = generateSentence(options, "OV");
        logProblem(problem, false, true);
        const modified = applyN5Grammar(problem, "Basic Sentence", "N5", "ちゃいけない");
        logProblem(modified, false, true);
        expect(modified.word).toMatch(/(ちゃいけない|じゃいけない)$/);
        expect(modified.romaji).toMatch(/(chaikenai|jaikenai)$/);
    });

    test("Should apply the dake grammar to an n5 sentence", () => {

    });

    test("Should apply the darou grammar to an n5 sentence", () => {

    });

    test("Should apply the demo grammar to an n5 sentence", () => {

    });
});
