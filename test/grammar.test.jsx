import {beforeEach, describe, expect, test} from "vitest";
import { applyN5Grammar } from "../src/components/grammar";
import { getRandomWord } from "../src/components/data";
import { generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";
import { generateSentence } from "../src/components/generator";

describe("Grammar Tests", () => {
    let options = {
        "Vocab Level": ["N5"],
        "Grammar Level": ["N5"],
        "Tenses": ["Plain"],
        "Types": ["Basic Sentence"],
    };
    let problem = {};

    beforeEach(() => {
        problem = generateSentence(options, {"sentence-form": "OV"});
        logProblem(problem);
    });

    test("Should apply the chaikenai grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "chaikenai");
        logProblem(modified);
        expect(modified.word).toMatch(/(ちゃいけない|じゃいけない)$/);
        expect(modified.romaji).toMatch(/(chaikenai|jaikenai)$/);
    });

    test("Should apply the dake grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "dake");
        logProblem(modified, true);
        expect(modified.word).toMatch(/だけ/);
        expect(modified.romaji).toMatch(/dake/);
       
    });

    test("Should apply the darou grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "darou");
        logProblem(modified);
        expect(modified.word).toMatch(/だろう$/);
        expect(modified.romaji).toMatch(/darou$/);
    });

    test.skip("Should apply the demo grammar to an n5 sentence", () => {
        // Requires the generation of a second sentence
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "demo");
        logProblem(modified);
        expect(modified.word).toMatch(/でも/);
        expect(modified.romaji).toMatch(/demo/);
    });

    test("Should apply the deshou grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses,"Basic Sentence", "N5", "deshou");
        logProblem(modified);
        expect(modified.word).toMatch(/でしょう$/);
        expect(modified.romaji).toMatch(/deshou$/);
    });

    test("Should apply the ka grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "ka");
        logProblem(modified);
        expect(modified.word).toMatch(/か$/);
        expect(modified.romaji).toMatch(/ka$/);
    });

    test("Should apply the donna grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses,"Basic Sentence", "N5", "donna");
        logProblem(modified);
        expect(modified.word).toMatch(/どんな.*か$/);
        expect(modified.romaji).toMatch(/donna.*ka$/);
    });

    test("Should apply the ndesu grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses,"Basic Sentence", "N5", "ndesu");
        logProblem(modified);
        expect(modified.word).toMatch(/(んだ|んです)$/);
        expect(modified.romaji).toMatch(/(nda|ndesu)$/);
    });

    test("Should apply the doushite grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "doushite");
        logProblem(modified);
        expect(modified.word).toMatch(/どうして.*か$/);
        expect(modified.romaji).toMatch(/doushite.*ka$/);
    });

    test("Should apply the douyatte grammar to an n5 sentence", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "douyatte");
        logProblem(modified);
        expect(modified.word).toMatch(/どうやって.*か$/);
        expect(modified.romaji).toMatch(/douyatte.*ka$/);
    });

    test("Should apply the hoshii grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(structuredClone(problem), options.Tenses, "Basic Sentence", "N5", "hoshii");
        logProblem(modified);
        expect(modified.word).toMatch(/欲しい$/);
        expect(modified.romaji).toMatch(/hoshii$/);

        modified = applyN5Grammar(structuredClone(problem), ["Past"], "Basic Sentence", "N5", "hoshii");
        logProblem(modified);
        expect(modified.word).toMatch(/欲しかった$/);
        expect(modified.romaji).toMatch(/hoshikatta$/);

        modified = applyN5Grammar(problem, ["Negative"], "Basic Sentence", "N5", "hoshii");
        logProblem(modified);
        expect(modified.word).toMatch(/欲しくない$/);
        expect(modified.romaji).toMatch(/hoshikunai$/);
    });

    test("Should apply the hougaii grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "hougaii");
        logProblem(modified);
        expect(modified.word).toMatch(/方がいい$/);
        expect(modified.romaji).toMatch(/hougaii$/);
    });

    test("Should apply the ichiban grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "ichiban");
        logProblem(modified);
        expect(modified.word).toMatch(/一番/);
        expect(modified.romaji).toMatch(/ichiban/);
    });

    test("Should apply the isshoni grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "isshoni");
        logProblem(modified);
        expect(modified.word).toMatch(/一緒に/);
        expect(modified.romaji).toMatch(/isshoni/);
    });

    test("Should apply the itsumo grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "itsumo");
        logProblem(modified);
        expect(modified.word).toMatch(/いつも/);
        expect(modified.romaji).toMatch(/itsumo/);
    });

    test("Should apply the kata grammar to an n5 sentence", () => {
        problem = generateSentence(options, {"sentence-form": "SOV", "ga": true, "adj": true});
        logProblem(problem);
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "kata");
        logProblem(modified);
        expect(modified.word).toMatch(/方/);
        expect(modified.romaji).toMatch(/kata/);
    });

    test.skip("Should apply the kedo grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "maeni");
        logProblem(modified);
        expect(modified.word).toMatch(/前に/);
        expect(modified.romaji).toMatch(/ maeni /);
    });
    
    test.skip("Should apply the keredemo grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "maeni");
        logProblem(modified);
        expect(modified.word).toMatch(/前に/);
        expect(modified.romaji).toMatch(/ maeni /);
    });
    
    test.skip("Should apply the mada grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "maeni");
        logProblem(modified);
        expect(modified.word).toMatch(/前に/);
        expect(modified.romaji).toMatch(/ maeni /);
    });

    test.skip("Should apply the made grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "maeni");
        logProblem(modified);
        expect(modified.word).toMatch(/前に/);
        expect(modified.romaji).toMatch(/ maeni /);
    });

    test("Should apply the maeni grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "maeni");
        logProblem(modified);
        expect(modified.word).toMatch(/前に/);
        expect(modified.romaji).toMatch(/ maeni /);
    });

    test("Should apply the mashou grammar to an n5 sentence", () => {
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "mashou");
        logProblem(modified);
        expect(modified.word).toMatch(/ましょう$/);
        expect(modified.romaji).toMatch(/mashou$/);
    });


});
