import {beforeEach, describe, expect, test} from "vitest";
import { applyClauseChainingGrammar, applyN5Grammar } from "../src/components/grammar";
import { getRandomWord } from "../src/components/data";
import { generateProblem } from "/src/components/generator";
import { logProblem } from "./test-helper";
import { generateSentence } from "../src/components/generator";
import GRAMMAR_OBJECT from "../src/data/n5/grammar.json";

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

    function runBasicTest(kana) {
        let word = GRAMMAR_OBJECT[kana];
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", word.romaji);
        logProblem(modified);
        expect(modified.word).toMatch(new RegExp(word.word));
        expect(modified.romaji).toMatch(new RegExp(word.romaji));
    }

    function runComplexTest(kana) {
        let word = GRAMMAR_OBJECT[kana];
        let second = generateSentence(options);
        logProblem(second);
        const modified = applyClauseChainingGrammar(problem, second, word.romaji);
        logProblem(modified);
        expect(modified.word).toMatch(new RegExp(word.word));
        expect(modified.romaji).toMatch(new RegExp(word.romaji));
    }


    test("Should apply the chaikenai grammar", () => {
        const modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "chaikenai");
        logProblem(modified);
        expect(modified.word).toMatch(/(ちゃいけない|じゃいけない)$/);
        expect(modified.romaji).toMatch(/(chaikenai|jaikenai)$/);
    });

    test("Should apply the dake grammar", () => {
        runBasicTest("だけ");
    });

    test("Should apply the darou grammar", () => {
        runBasicTest("だろう");
    });


    test("Should apply the deshou grammar", () => {
        runBasicTest("でしょう");
    });

    test("Should apply the ka grammar", () => {
        runBasicTest("か");
    });

    test("Should apply the donna grammar", () => {
        runBasicTest("どんな");
    });

    test("Should apply the ndesu grammar", () => {
        const modified = applyN5Grammar(problem, options.Tenses,"Basic Sentence", "N5", "ndesu");
        logProblem(modified);
        expect(modified.word).toMatch(/(んだ|んです)$/);
        expect(modified.romaji).toMatch(/(nda|ndesu)$/);
    });

    test("Should apply the doushite grammar", () => {
        runBasicTest("どうして");
    });

    test("Should apply the douyatte grammar", () => {
        runBasicTest("どうやって");
    });

    test("Should apply the hoshii grammar", () => {
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

    test("Should apply the hou ga ii grammar", () => {
        runBasicTest("方がいい");
    });

    test("Should apply the ichiban grammar", () => {
        runBasicTest("一番");
    });

    test("Should apply the isshoni grammar", () => {
        runBasicTest("一緒に");
    });

    test("Should apply the itsumo grammar", () => {
        runBasicTest("いつも");
    });

    test("Should apply the kata grammar", () => {
        runBasicTest("方");
    });
    
    test("Should apply the mada grammar", () => {
        runBasicTest("まだ");
    });

    test("Should apply the made grammar", () => {
        runBasicTest("まで");
    });

    test("Should apply the mae ni grammar", () => {
        runBasicTest("前に");
    });

    test("Should apply the mashou grammar", () => {
        runBasicTest("ましょう");
    });

    test("Should apply the mou grammar", () => {
        runBasicTest("もう");
    });

    test("Should apply the naa grammar", () => {
        runBasicTest("なあ");
    });
    
    test("Should apply the nakutemo ii grammar", () => {
        runBasicTest("なくてもいい");
    });

    test("Should apply the nakucha grammar", () => {
        runBasicTest("なくちゃ");
    });

    test("Should apply the nakute wa ikenai grammar", () => {
        runBasicTest("なくてはいけない");
    });

    test("Should apply the nakute wa naranai grammar", () => {
        runBasicTest("なくてはならない");
    });

    test("Should apply the naru grammar", () => {
        problem = generateSentence(options, {"sentence-form": "SOV", "ga": true, "adj": true, "no da/desu": true});
        logProblem(problem);
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "naru");
        logProblem(modified);
        if(modified.indices["na-adjective"]) {
            expect(modified.word).toMatch(/にな/);
            expect(modified.romaji).toMatch(/ni na/);
        }
        else {
            expect(modified.word).toMatch(/くな/);
            expect(modified.romaji).toMatch(/ku na/);
        }
    });

    test("Should apply the ne grammar", () => {
        runBasicTest("ね")
    });

    test("Should apply the ni iku grammar", () => {
        runBasicTest("に行く")
    });

    test("Should apply the ni suru grammar", () => {
        problem = generateSentence(options, {"sentence-form": "SOV", "noun": true});
        logProblem(problem);
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "ni suru");
        logProblem(modified);
        expect(modified.word).toMatch(/にする/);
        expect(modified.romaji).toMatch(/ni suru/);
    });

    test("Should apply the no ga heta grammar", () => {
        runBasicTest("のが下手");
    });

    test("Should apply the no ga jouzu grammar", () => {
        runBasicTest("のが上手");
    });

    test("Should apply the no ga suki grammar", () => {
        runBasicTest("のが好き");
    });

    test("Should apply the sugiru grammar", () => {
        runBasicTest("すぎる");
        problem = generateSentence(options, {"sentence-form": "SOV", "ga": true, "adj": true});
        logProblem(problem);
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "sugiru");
        logProblem(modified);
    });

    test("Should apply the koto ga aru grammar", () => {
        runBasicTest("ことがある");
    });

    test("Should apply the tai grammar", () => {
        runBasicTest("たい");
    });

    test("Should apply the te aru grammar", () => {
        runBasicTest("てある");
    });

    test("Should apply the te iru grammar", () => {
        runBasicTest("ている");
    });

    test("Should apply the te kudasai grammar", () => {
        runBasicTest("てください");
    });

    test("Should apply the te wa ikenai grammar", () => {
        runBasicTest("てはいけない");
    });

    test("Should apply the te mo ii desu grammar", () => {
        runBasicTest("てもいいです");
    });

    test("Should apply the totemo grammar", () => {
        runBasicTest("とても");
        problem = generateSentence(options, {"sentence-form": "SOV", "ga": true, "adj": true});
        logProblem(problem);
        let modified = applyN5Grammar(problem, options.Tenses, "Basic Sentence", "N5", "totemo");
        logProblem(modified);
    });

    test("Should apply the tsumori grammar", () => {
        runBasicTest("つもり");
    });

    test("Should apply the wa dou desu ka grammar", () => {
        runBasicTest("はどうですか");
    });

    test("Should apply the yo grammar", () => {
        runBasicTest("よ");
    });

    test("Should apply the ya grammar", () => {
        runBasicTest("や");
    });

    test("Should apply the demo grammar", () => {
        runComplexTest("でも");
    });

    test("Should apply the kedo grammar", () => {
        runComplexTest("けど");
    });
    
    test("Should apply the keredomo grammar", () => {
        runComplexTest("けれども");
    });

    test("Should apply the no de grammar", () => {
        runComplexTest("ので");
    });

    test("Should apply the shikashi grammar", () => {
        runComplexTest("しかし");
    });

    test.skip("Should apply the tari~tari grammar", () => {
    
    });

    test("Should apply the te kara grammar", () => {
        runComplexTest("てから");
    });

    test.skip("Should apply the toki grammar", () => {
       
    });
});
