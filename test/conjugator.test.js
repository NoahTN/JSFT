import {describe, expect, test} from "vitest";
import { getMasuForm, getNegativeForm, getPastForm, getPastNegaitveForm, getTeForm } from "../src/components/conjugator";
const n5Verbs = require("../src/data/n5/verb.json");
const n5Grammar = require("../src/data/n5/grammar.json");


describe("Conjugator Tests", () => {
    const da = n5Grammar["だ"];
    const desu = n5Grammar["です"];
    const benkyousuru = n5Verbs["benkyousuru"];
    const kuru = n5Verbs["kuru"];
    const taberu = n5Verbs["taberu"];
    const tsukau = n5Verbs["tsukau"];
    const tatsu = n5Verbs["tatsu"];
    const aruku = n5Verbs["aruku"];
    const dasu = n5Verbs["dasu"];
    const asobu = n5Verbs["asobu"];
    const tanomu = n5Verbs["tanomu"];
    const shinu = n5Verbs["shinu"];
    const oyogu = n5Verbs["oyogu"];
    const utau = n5Verbs["utau"];
    const kiru = n5Verbs["kiru"];
    const toru = n5Verbs["toru"];
    const iku = n5Verbs["iku"];

    test("Should get the masu form of verbs", () => {
        expect(getMasuForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強します", romaji: "benkyoushimasu"}));
        expect(getMasuForm(kuru)).toEqual(expect.objectContaining({word: "来ます", romaji: "kimasu"}));
        expect(getMasuForm(taberu)).toEqual(expect.objectContaining({word: "食べます", romaji: "tabemasu"}));
        expect(getMasuForm(tsukau)).toEqual(expect.objectContaining({word: "使います", romaji: "tsukaimasu"}));
        expect(getMasuForm(tatsu)).toEqual(expect.objectContaining({word: "立ちます", romaji: "tachimasu"}));
    });

    test("Should get the negative form of verbs", () => {
        expect(getNegativeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しない", romaji: "benkyoushinai"}));
        expect(getNegativeForm(kuru)).toEqual(expect.objectContaining({word: "こない", romaji: "konai"}));
        expect(getNegativeForm(taberu)).toEqual(expect.objectContaining({word: "食べない", romaji: "tabenai"}));
        expect(getNegativeForm(tsukau)).toEqual(expect.objectContaining({word: "使わない", romaji: "tsukawanai"}));
        expect(getNegativeForm(tatsu)).toEqual(expect.objectContaining({word: "立たない", romaji: "tatanai"}));
    });

    test("Should get the past form of verbs", () => {
        expect(getPastForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強した", romaji: "benkyoushita"}));
        expect(getPastForm(kuru)).toEqual(expect.objectContaining({word: "来た", romaji: "kita"}));
        expect(getPastForm(taberu)).toEqual(expect.objectContaining({word: "食べた", romaji: "tabeta"}));
        expect(getPastForm(tsukau)).toEqual(expect.objectContaining({word: "使った", romaji: "tsukatta"}));
        expect(getPastForm(tatsu)).toEqual(expect.objectContaining({word: "立った", romaji: "tatta"}));
        expect(getPastForm(iku)).toEqual(expect.objectContaining({word: "行った", romaji: "itta"}));
    });

    test("Should get the past negatve form of verbs", () => {
        expect(getPastNegaitveForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しなかった", romaji: "benkyoushinakatta"}));
        expect(getPastNegaitveForm(kuru)).toEqual(expect.objectContaining({word: "こなかった", romaji: "konakatta"}));
        expect(getPastNegaitveForm(taberu)).toEqual(expect.objectContaining({word: "食べなかった", romaji: "tabenakatta"}));
        expect(getPastNegaitveForm(tsukau)).toEqual(expect.objectContaining({word: "使わなかった", romaji: "tsukawanakatta"}));
        expect(getPastNegaitveForm(tatsu)).toEqual(expect.objectContaining({word: "立たなかった", romaji: "tatanakatta"}));
        expect(getPastNegaitveForm(iku)).toEqual(expect.objectContaining({word: "行かなかった", romaji: "ikanakatta"}));
    });

    test("Should get the te form of verbs", () => {
        expect(getTeForm(aruku)).toEqual(expect.objectContaining({word: "歩いて", romaji: "aruite"}));
        expect(getTeForm(dasu)).toEqual(expect.objectContaining({word: "出して", romaji: "dashite"}));
        expect(getTeForm(asobu)).toEqual(expect.objectContaining({word: "遊んで", romaji: "asonde"}));
        expect(getTeForm(tanomu)).toEqual(expect.objectContaining({word: "頼んで", romaji: "tanonde"}));
        expect(getTeForm(shinu)).toEqual(expect.objectContaining({word: "死んで", romaji: "shinde"}));
        expect(getTeForm(oyogu)).toEqual(expect.objectContaining({word: "泳いで", romaji: "oyoide"}));
        expect(getTeForm(utau)).toEqual(expect.objectContaining({word: "歌って", romaji: "utatte"}));
        expect(getTeForm(tatsu)).toEqual(expect.objectContaining({word: "立って", romaji: "tatte"}));
        expect(getTeForm(kiru)).toEqual(expect.objectContaining({word: "切って", romaji: "kitte"}));
        expect(getTeForm(kuru)).toEqual(expect.objectContaining({word: "来て", romaji: "kite"}));
        expect(getTeForm(toru)).toEqual(expect.objectContaining({word: "撮って", romaji: "totte"}));
        expect(getTeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強して", romaji: "benkyoushite"}));
    });

    test("Should get the past, negative, and past-negative form of da and desu", () => {
        expect(getPastForm(da)).toEqual(expect.objectContaining({word: "だった", romaji: "datta"}));
        expect(getPastForm(desu)).toEqual(expect.objectContaining({word: "でした", romaji: "deshita"}));
        
        expect(getNegativeForm(da)).toEqual(expect.objectContaining({word: "じゃない", romaji: "janai"}));
        expect(getNegativeForm(desu)).toEqual(expect.objectContaining({word: "じゃありません", romaji: "jaarimasen"}));

        expect(getPastNegaitveForm(da)).toEqual(expect.objectContaining({word: "じゃなかった", romaji: "janakatta"}));
        expect(getPastNegaitveForm(desu)).toEqual(expect.objectContaining({word: "じゃありませんでした", romaji: "jaarimasendeshita"}));
    });
})