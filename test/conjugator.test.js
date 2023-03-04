import {describe, expect, test} from "vitest";
import { getTeForm } from "../src/components/conjugator";
const n5Verbs = require("../src/data/n5/verbs.json");


describe("Conjugator Tests", () => {
    test("Should get the te form of a verb", () => {
        const aruku = n5Verbs[6];
        const dasu = n5Verbs[11];
        const asobu = n5Verbs[7];
        const tanomu = n5Verbs[95];
        const shinu = n5Verbs[87];
        const oyogu = n5Verbs[75];
        const utau = n5Verbs[110];
        const tatsu = n5Verbs[96];
        const kiru = n5Verbs[45];
        const toru = n5Verbs[100];
    
        expect(getTeForm(aruku)).toEqual({form: "te", word: "歩いて", romaji: "aruite"});
        expect(getTeForm(dasu)).toEqual({form: "te", word: "出して", romaji: "dashite"});
        expect(getTeForm(asobu)).toEqual({form: "te", word: "遊んで", romaji: "asonde"});
        expect(getTeForm(tanomu)).toEqual({form: "te", word: "頼んで", romaji: "tanonde"});
        expect(getTeForm(shinu)).toEqual({form: "te", word: "死んで", romaji: "shinde"});
        expect(getTeForm(oyogu)).toEqual({form: "te", word: "泳いで", romaji: "oyoide"});
        expect(getTeForm(utau)).toEqual({form: "te", word: "歌って", romaji: "utatte"});
        expect(getTeForm(tatsu)).toEqual({form: "te", word: "立って", romaji: "tatte"});
        expect(getTeForm(kiru)).toEqual({form: "te", word: "切て", romaji: "kite"});
        expect(getTeForm(toru)).toEqual({form: "te", word: "撮って", romaji: "totte"});
    });
})