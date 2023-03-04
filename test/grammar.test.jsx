import {describe, expect, test} from "vitest";
import { applyN5Grammar } from "../src/components/grammar";
import { getRandomWord, generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";
import { generateSentence } from "../src/components/generator";

describe("Grammar Tests", () => {
    test("Should apply the chaikenai grammar to an n5 sentence", () => {
        const problem = generateSentence("Basic Sentence","N5", "N5", true);
        logProblem(problem, true);
        const modified = applyN5Grammar(problem, "Basic Sentence", "N5", "ちゃいけない");
        logProblem(modified, true);
        expect(modified.word).toMatch(/(ちゃいけない|じゃいけない)$/);
        expect(modified.romaji).toMatch(/(chaikenai|jaikenai)$/);
    });
});
