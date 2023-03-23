import {describe, expect, test} from "vitest";
import { getPoliteForm, getNegativeForm, getPastForm, getTeForm, getProvisionalForm } from "../src/components/conjugator";
const n5Verbs = require("../src/data/n5/verb.json");
const n5Grammar = require("../src/data/n5/grammar.json");

// When negative and some other option is ticked then should have chance to do combined version, might go for polite as well

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

    test("Should get the polite and polite-negative form of verbs", () => {
        expect(getPoliteForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強します", romaji: "benkyoushimasu"}));
        expect(getPoliteForm(kuru)).toEqual(expect.objectContaining({word: "来ます", romaji: "kimasu"}));
        expect(getPoliteForm(taberu)).toEqual(expect.objectContaining({word: "食べます", romaji: "tabemasu"}));
        expect(getPoliteForm(tsukau)).toEqual(expect.objectContaining({word: "使います", romaji: "tsukaimasu"}));
        expect(getPoliteForm(tatsu)).toEqual(expect.objectContaining({word: "立ちます", romaji: "tachimasu"}));

        expect(getPoliteForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しません", romaji: "benkyoushimasen"}));
        expect(getPoliteForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来ません", romaji: "kimasen"}));
        expect(getPoliteForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べません", romaji: "tabemasen"}));
        expect(getPoliteForm(tsukau, "negative")).toEqual(expect.objectContaining({word: "使いません", romaji: "tsukaimasen"}));
        expect(getPoliteForm(tatsu, "negative")).toEqual(expect.objectContaining({word: "立ちません", romaji: "tachimasen"}));
        expect(getPoliteForm(iku, "negative")).toEqual(expect.objectContaining({word: "行きません", romaji: "ikimasen"}));
    });

    test("Should get the negative form of verbs", () => {
        expect(getNegativeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しない", romaji: "benkyoushinai"}));
        expect(getNegativeForm(kuru)).toEqual(expect.objectContaining({word: "来ない", romaji: "konai"}));
        expect(getNegativeForm(taberu)).toEqual(expect.objectContaining({word: "食べない", romaji: "tabenai"}));
        expect(getNegativeForm(tsukau)).toEqual(expect.objectContaining({word: "使わない", romaji: "tsukawanai"}));
        expect(getNegativeForm(tatsu)).toEqual(expect.objectContaining({word: "立たない", romaji: "tatanai"}));
    });

    test("Should get the past, past-polite, past-negative, and past-polite-negative form of verbs", () => {
        expect(getPastForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強した", romaji: "benkyoushita"}));
        expect(getPastForm(kuru)).toEqual(expect.objectContaining({word: "来た", romaji: "kita"}));
        expect(getPastForm(taberu)).toEqual(expect.objectContaining({word: "食べた", romaji: "tabeta"}));
        expect(getPastForm(tsukau)).toEqual(expect.objectContaining({word: "使った", romaji: "tsukatta"}));
        expect(getPastForm(tatsu)).toEqual(expect.objectContaining({word: "立った", romaji: "tatta"}));
        expect(getPastForm(iku)).toEqual(expect.objectContaining({word: "行った", romaji: "itta"}));

        expect(getPastForm(benkyousuru, "polite")).toEqual(expect.objectContaining({word: "勉強しました", romaji: "benkyoushimashita"}));
        expect(getPastForm(kuru, "polite")).toEqual(expect.objectContaining({word: "来ました", romaji: "kimashita"}));
        expect(getPastForm(taberu, "polite")).toEqual(expect.objectContaining({word: "食べました", romaji: "tabemashita"}));
        expect(getPastForm(tsukau, "polite")).toEqual(expect.objectContaining({word: "使いました", romaji: "tsukaimashita"}));
        expect(getPastForm(tatsu, "polite")).toEqual(expect.objectContaining({word: "立ちました", romaji: "tachimashita"}));
        expect(getPastForm(iku, "polite")).toEqual(expect.objectContaining({word: "行きました", romaji: "ikimashita"}));

        expect(getPastForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しなかった", romaji: "benkyoushinakatta"}));
        expect(getPastForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来なかった", romaji: "konakatta"}));
        expect(getPastForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べなかった", romaji: "tabenakatta"}));
        expect(getPastForm(tsukau, "negative")).toEqual(expect.objectContaining({word: "使わなかった", romaji: "tsukawanakatta"}));
        expect(getPastForm(tatsu, "negative")).toEqual(expect.objectContaining({word: "立たなかった", romaji: "tatanakatta"}));
        expect(getPastForm(iku, "negative")).toEqual(expect.objectContaining({word: "行かなかった", romaji: "ikanakatta"}));

        expect(getPastForm(benkyousuru, "polite-negative")).toEqual(expect.objectContaining({word: "勉強しませんでした", romaji: "benkyoushimasendeshita"}));
        expect(getPastForm(kuru, "polite-negative")).toEqual(expect.objectContaining({word: "来ませんでした", romaji: "kimasendeshita"}));
        expect(getPastForm(taberu, "polite-negative")).toEqual(expect.objectContaining({word: "食べませんでした", romaji: "tabemasendeshita"}));
        expect(getPastForm(tsukau, "polite-negative")).toEqual(expect.objectContaining({word: "使いませんでした", romaji: "tsukaimasendeshita"}));
        expect(getPastForm(tatsu, "polite-negative")).toEqual(expect.objectContaining({word: "立ちませんでした", romaji: "tachimasendeshita"}));
        expect(getPastForm(iku, "polite-negative")).toEqual(expect.objectContaining({word: "行きませんでした", romaji: "ikimasendeshita"}));
    });

    test("Should get the te and negative-te form of verbs", () => {
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

        expect(getTeForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩かないで", romaji: "arukanaide"}));
        expect(getTeForm(dasu, "negative")).toEqual(expect.objectContaining({word: "出さないで", romaji: "dasanaide"}));
        expect(getTeForm(asobu, "negative")).toEqual(expect.objectContaining({word: "遊ばないで", romaji: "asobanaide"}));
        expect(getTeForm(tanomu, "negative")).toEqual(expect.objectContaining({word: "頼まないで", romaji: "tanomanaide"}));
        expect(getTeForm(shinu, "negative")).toEqual(expect.objectContaining({word: "死なないで", romaji: "shinanaide"}));
        expect(getTeForm(oyogu, "negative")).toEqual(expect.objectContaining({word: "泳がないで", romaji: "oyoganaide"}));
        expect(getTeForm(utau, "negative")).toEqual(expect.objectContaining({word: "歌わないで", romaji: "utawanaide"}));
        expect(getTeForm(tatsu, "negative")).toEqual(expect.objectContaining({word: "立たないで", romaji: "tatanaide"}));
        expect(getTeForm(kiru, "negative")).toEqual(expect.objectContaining({word: "切らないで", romaji: "kiranaide"}));
        expect(getTeForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来ないで", romaji: "konaide"}));
        expect(getTeForm(toru, "negative")).toEqual(expect.objectContaining({word: "撮らないで", romaji: "toranaide"}));
        expect(getTeForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しないで", romaji: "benkyoushinaide"}));
    });

    test("Should get the past, negative, past-negative, and past-negative-polite form of da and desu", () => {
        expect(getPastForm(da)).toEqual(expect.objectContaining({word: "だった", romaji: "datta"}));
        expect(getPastForm(desu)).toEqual(expect.objectContaining({word: "でした", romaji: "deshita"}));
        
        expect(getNegativeForm(da)).toEqual(expect.objectContaining({word: "じゃない", romaji: "janai"}));
        expect(getNegativeForm(desu)).toEqual(expect.objectContaining({word: "じゃありません", romaji: "jaarimasen"}));

        expect(getPastForm(da, "negative")).toEqual(expect.objectContaining({word: "じゃなかった", romaji: "janakatta"}));
        expect(getPastForm(desu, "negative")).toEqual(expect.objectContaining({word: "じゃありませんでした", romaji: "jaarimasendeshita"}));

        expect(getPastForm(da, "polite-negative")).toEqual(expect.objectContaining({word: "じゃありませんでした", romaji: "jaarimasendeshita"}));
        expect(getPastForm(desu, "polite-negative")).toEqual(expect.objectContaining({word: "じゃありませんでした", romaji: "jaarimasendeshita"}));
    });

  test("Should get the provisional and provisional-negative form of verbs", () => {
        expect(getProvisionalForm(aruku)).toEqual(expect.objectContaining({word: "歩けば", romaji: "arukeba"}));
        expect(getProvisionalForm(dasu)).toEqual(expect.objectContaining({word: "出せば", romaji: "daseba"}));
        expect(getProvisionalForm(asobu)).toEqual(expect.objectContaining({word: "遊べば", romaji: "asobeba"}));
        expect(getProvisionalForm(tanomu)).toEqual(expect.objectContaining({word: "頼めば", romaji: "tanomeba"}));
        expect(getProvisionalForm(shinu)).toEqual(expect.objectContaining({word: "死ねば", romaji: "shineba"}));
        expect(getProvisionalForm(oyogu)).toEqual(expect.objectContaining({word: "泳げば", romaji: "oyogeba"}));
        expect(getProvisionalForm(utau)).toEqual(expect.objectContaining({word: "歌えば", romaji: "utaeba"}));
        expect(getProvisionalForm(tatsu)).toEqual(expect.objectContaining({word: "立てば", romaji: "tateba"}));
        expect(getProvisionalForm(kiru)).toEqual(expect.objectContaining({word: "切れば", romaji: "kireba"}));
        expect(getProvisionalForm(kuru)).toEqual(expect.objectContaining({word: "来れば", romaji: "koreba"}));
        expect(getProvisionalForm(toru)).toEqual(expect.objectContaining({word: "撮れば", romaji: "toreba"}));
        expect(getProvisionalForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強すれば", romaji: "benkyousureba"}));

        expect(getProvisionalForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩かなければ", romaji: "arukanakereba"}));
        expect(getProvisionalForm(dasu, "negative")).toEqual(expect.objectContaining({word: "出さなければ", romaji: "dasanakereba"}));
        expect(getProvisionalForm(asobu, "negative")).toEqual(expect.objectContaining({word: "遊ばなければ", romaji: "asobanakereba"}));
        expect(getProvisionalForm(tanomu, "negative")).toEqual(expect.objectContaining({word: "頼まなければ", romaji: "tanomanakereba"}));
        expect(getProvisionalForm(shinu, "negative")).toEqual(expect.objectContaining({word: "死ななければ", romaji: "shinanakereba"}));
        expect(getProvisionalForm(oyogu, "negative")).toEqual(expect.objectContaining({word: "泳がなければ", romaji: "oyoganakereba"}));
        expect(getProvisionalForm(utau, "negative")).toEqual(expect.objectContaining({word: "歌わなければ", romaji: "utawanakereba"}));
        expect(getProvisionalForm(tatsu, "negative")).toEqual(expect.objectContaining({word: "立たなければ", romaji: "tatanakereba"}));
        expect(getProvisionalForm(kiru, "negative")).toEqual(expect.objectContaining({word: "切らなければ", romaji: "kiranakereba"}));
        expect(getProvisionalForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来なければ", romaji: "konakereba"}));
        expect(getProvisionalForm(toru, "negative")).toEqual(expect.objectContaining({word: "撮らなければ", romaji: "toranakereba"}));
        expect(getProvisionalForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しなければ", romaji: "benkyoushinakereba"}));
  });

  test("Should get the conditonal and conditional-negative form of verbs", () => {

  });

  test("Should get the imperative and imperative-negative form of verbs", () => {

  });

  test("Should get the volitional and volitional-negative form of verbs", () => {

  });

  test("Should get the potential and potential-negative form of verbs", () => {

  });

  test("Should get the passive and passive-negative form of verbs", () => {

  });

  test("Should get the causative and causative-negative form of verbs", () => {

  });
  
})