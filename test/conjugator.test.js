import {describe, expect, test} from "vitest";
import { getPoliteForm, getNegativeForm, getPastForm, getTeForm, getProvisionalForm, getConditionalForm, 
         getImperativeForm, getVolitionalForm, getPotentialForm, getPassiveForm, getCausativeForm, getAdjectiveForm, getMashouForm,
         getTaiForm, getTeiruForm } from "../src/components/conjugator";
const n5Verbs = require("../src/data/n5/verb.json");
const n5IAdjectives = require("../src/data/n5/i-adjective.json");
const n5NaAdjectives = require("../src/data/n5/na-adjective.json");
const n5Grammar = require("../src/data/n5/grammar.json");

// When negative and some other option is ticked then should have chance to do combined version, might go for polite as well

describe("Conjugator Tests", () => {
    const da = n5Grammar["だ"];
    const desu = n5Grammar["です"];
    const benkyousuru = n5Verbs["benkyousuru"];
    const kuru = n5Verbs["kuru"];
    const taberu = n5Verbs["taberu"];
    const tsukau = n5Verbs["tsukau"];
    const aruku = n5Verbs["aruku"];
    const aru = n5Verbs["aru"];
    const tsukareru = n5Verbs["tsukareru"];
    const yasui = n5IAdjectives["yasui"];
    const benri = n5NaAdjectives["benri"];
    const ii = n5IAdjectives["ii"];

    

    test("Should get the polite and polite-negative form of verbs", () => {
        expect(getPoliteForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強します", romaji: "benkyoushimasu"}));
        expect(getPoliteForm(kuru)).toEqual(expect.objectContaining({word: "来ます", romaji: "kimasu"}));
        expect(getPoliteForm(taberu)).toEqual(expect.objectContaining({word: "食べます", romaji: "tabemasu"}));
        expect(getPoliteForm(tsukau)).toEqual(expect.objectContaining({word: "使います", romaji: "tsukaimasu"}));

        expect(getPoliteForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しません", romaji: "benkyoushimasen"}));
        expect(getPoliteForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来ません", romaji: "kimasen"}));
        expect(getPoliteForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べません", romaji: "tabemasen"}));
        expect(getPoliteForm(tsukau, "negative")).toEqual(expect.objectContaining({word: "使いません", romaji: "tsukaimasen"}));
    });

    test("Should get the negative form of verbs", () => {
        expect(getNegativeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しない", romaji: "benkyoushinai"}));
        expect(getNegativeForm(kuru)).toEqual(expect.objectContaining({word: "来ない", romaji: "konai"}));
        expect(getNegativeForm(taberu)).toEqual(expect.objectContaining({word: "食べない", romaji: "tabenai"}));
        expect(getNegativeForm(tsukau)).toEqual(expect.objectContaining({word: "使わない", romaji: "tsukawanai"}));
        expect(getNegativeForm(aru)).toEqual(expect.objectContaining({word: "ない", romaji: "nai"}));
    });

    test("Should get the past, past-polite, past-negative, and past-polite-negative form of verbs", () => {
        expect(getPastForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強した", romaji: "benkyoushita"}));
        expect(getPastForm(kuru)).toEqual(expect.objectContaining({word: "来た", romaji: "kita"}));
        expect(getPastForm(taberu)).toEqual(expect.objectContaining({word: "食べた", romaji: "tabeta"}));
        expect(getPastForm(tsukau)).toEqual(expect.objectContaining({word: "使った", romaji: "tsukatta"}));

        expect(getPastForm(benkyousuru, "polite")).toEqual(expect.objectContaining({word: "勉強しました", romaji: "benkyoushimashita"}));
        expect(getPastForm(kuru, "polite")).toEqual(expect.objectContaining({word: "来ました", romaji: "kimashita"}));
        expect(getPastForm(taberu, "polite")).toEqual(expect.objectContaining({word: "食べました", romaji: "tabemashita"}));
        expect(getPastForm(tsukau, "polite")).toEqual(expect.objectContaining({word: "使いました", romaji: "tsukaimashita"}));

        expect(getPastForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しなかった", romaji: "benkyoushinakatta"}));
        expect(getPastForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来なかった", romaji: "konakatta"}));
        expect(getPastForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べなかった", romaji: "tabenakatta"}));
        expect(getPastForm(tsukau, "negative")).toEqual(expect.objectContaining({word: "使わなかった", romaji: "tsukawanakatta"}));

        expect(getPastForm(benkyousuru, "polite-negative")).toEqual(expect.objectContaining({word: "勉強しませんでした", romaji: "benkyoushimasendeshita"}));
        expect(getPastForm(kuru, "polite-negative")).toEqual(expect.objectContaining({word: "来ませんでした", romaji: "kimasendeshita"}));
        expect(getPastForm(taberu, "polite-negative")).toEqual(expect.objectContaining({word: "食べませんでした", romaji: "tabemasendeshita"}));
        expect(getPastForm(tsukau, "polite-negative")).toEqual(expect.objectContaining({word: "使いませんでした", romaji: "tsukaimasendeshita"}));
    });

    test("Should get the te and negative-te form of verbs", () => {
        expect(getTeForm(aruku)).toEqual(expect.objectContaining({word: "歩いて", romaji: "aruite"}));
        expect(getTeForm(kuru)).toEqual(expect.objectContaining({word: "来て", romaji: "kite"}));
        expect(getTeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強して", romaji: "benkyoushite"}));
        expect(getTeForm(taberu)).toEqual(expect.objectContaining({word: "食べて", romaji: "tabete"}));
        expect(getTeForm(tsukareru)).toEqual(expect.objectContaining({word: "疲れて", romaji: "tsukarete"}));

        expect(getTeForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩かないで", romaji: "arukanaide"}));
        expect(getTeForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来ないで", romaji: "konaide"}));
        expect(getTeForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しないで", romaji: "benkyoushinaide"}));
        expect(getTeForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べないで", romaji: "tabenaide"}));
        expect(getTeForm(tsukareru, "negative")).toEqual(expect.objectContaining({word: "疲れないで", romaji: "tsukarenaide"}));
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
        expect(getProvisionalForm(kuru)).toEqual(expect.objectContaining({word: "来れば", romaji: "koreba"}));
        expect(getProvisionalForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強すれば", romaji: "benkyousureba"}));
        expect(getProvisionalForm(taberu)).toEqual(expect.objectContaining({word: "食べれば", romaji: "tabereba"}));

        expect(getProvisionalForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩かなければ", romaji: "arukanakereba"}));
        expect(getProvisionalForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来なければ", romaji: "konakereba"}));
        expect(getProvisionalForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しなければ", romaji: "benkyoushinakereba"}));
        expect(getProvisionalForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べなければ", romaji: "tabenakereba"}));
    });

    test("Should get the conditional and conditional-negative form of verbs", () => {
        expect(getConditionalForm(aruku)).toEqual(expect.objectContaining({word: "歩いたら", romaji: "aruitara"}));
        expect(getConditionalForm(kuru)).toEqual(expect.objectContaining({word: "来たら", romaji: "kitara"}));
        expect(getConditionalForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強したら", romaji: "benkyoushitara"}));
        expect(getConditionalForm(taberu)).toEqual(expect.objectContaining({word: "食べたら", romaji: "tabetara"}));

        expect(getConditionalForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩かなかったら", romaji: "arukanakattara"}));
        expect(getConditionalForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来なかったら", romaji: "konakattara"}));
        expect(getConditionalForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強しなかったら", romaji: "benkyoushinakattara"}));
        expect(getConditionalForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べなかったら", romaji: "tabenakattara"}));
    });

    test("Should get the imperative form of verbs", () => {
        expect(getImperativeForm(aruku)).toEqual(expect.objectContaining({word: "歩け", romaji: "aruke"}));
        expect(getImperativeForm(kuru)).toEqual(expect.objectContaining({word: "来い", romaji: "koi"}));
        expect(getImperativeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しろ", romaji: "benkyoushiro"}));
        expect(getImperativeForm(taberu)).toEqual(expect.objectContaining({word: "食べろ", romaji: "tabero"}));
     });

    test("Should get the volitional and volitional-polite form of verbs", () => {
        expect(getVolitionalForm(aruku)).toEqual(expect.objectContaining({word: "歩こう", romaji: "arukou"}));
        expect(getVolitionalForm(kuru)).toEqual(expect.objectContaining({word: "来よう", romaji: "koyou"}));
        expect(getVolitionalForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しよう", romaji: "benkyoushiyou"}));
        expect(getVolitionalForm(taberu)).toEqual(expect.objectContaining({word: "食べよう", romaji: "tabeyou"}));

        expect(getVolitionalForm(aruku, "polite")).toEqual(expect.objectContaining({word: "歩きましょう", romaji: "arukimashou"}));
        expect(getVolitionalForm(kuru, "polite")).toEqual(expect.objectContaining({word: "来ましょう", romaji: "kimashou"}));
        expect(getVolitionalForm(benkyousuru, "polite")).toEqual(expect.objectContaining({word: "勉強しましょう", romaji: "benkyoushimashou"}));
        expect(getVolitionalForm(taberu, "polite")).toEqual(expect.objectContaining({word: "食べましょう", romaji: "tabemashou"}));
     });

    test("Should get the potential, potential-negative, and potential-past-negative form of verbs", () => {
        expect(getPotentialForm(aruku)).toEqual(expect.objectContaining({word: "歩ける", romaji: "arukeru"}));
        expect(getPotentialForm(kuru)).toEqual(expect.objectContaining({word: "来られる", romaji: "korareru"}));
        expect(getPotentialForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強できる", romaji: "benkyoudekiru"}));
        expect(getPotentialForm(taberu)).toEqual(expect.objectContaining({word: "食べられる", romaji: "taberareru"}));

        expect(getPotentialForm(aruku, "negative")).toEqual(expect.objectContaining({word: "歩けない", romaji: "arukenai"}));
        expect(getPotentialForm(kuru, "negative")).toEqual(expect.objectContaining({word: "来られない", romaji: "korarenai"}));
        expect(getPotentialForm(benkyousuru, "negative")).toEqual(expect.objectContaining({word: "勉強できない", romaji: "benkyoudekinai"}));
        expect(getPotentialForm(taberu, "negative")).toEqual(expect.objectContaining({word: "食べられない", romaji: "taberarenai"}));

        expect(getPotentialForm(aruku, "past-negative")).toEqual(expect.objectContaining({word: "歩けなかった", romaji: "arukenakatta"}));
        expect(getPotentialForm(kuru, "past-negative")).toEqual(expect.objectContaining({word: "来られなかった", romaji: "korarenakatta"}));
        expect(getPotentialForm(benkyousuru, "past-negative")).toEqual(expect.objectContaining({word: "勉強できなかった", romaji: "benkyoudekinakatta"}));
        expect(getPotentialForm(taberu, "past-negative")).toEqual(expect.objectContaining({word: "食べられなかった", romaji: "taberarenakatta"}));
    });

    test("Should get the passive and passive-past form of verbs", () => {
        expect(getPassiveForm(aruku)).toEqual(expect.objectContaining({word: "歩かれる", romaji: "arukareru"}));
        expect(getPassiveForm(kuru)).toEqual(expect.objectContaining({word: "来られる", romaji: "korareru"}));
        expect(getPassiveForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強される", romaji: "benkyousareru"}));
        expect(getPassiveForm(taberu)).toEqual(expect.objectContaining({word: "食べられる", romaji: "taberareru"}));

        expect(getPassiveForm(aruku, "past")).toEqual(expect.objectContaining({word: "歩かれた", romaji: "arukareta"}));
        expect(getPassiveForm(kuru, "past")).toEqual(expect.objectContaining({word: "来られた", romaji: "korareta"}));
        expect(getPassiveForm(benkyousuru, "past")).toEqual(expect.objectContaining({word: "勉強された", romaji: "benkyousareta"}));
        expect(getPassiveForm(taberu, "past")).toEqual(expect.objectContaining({word: "食べられた", romaji: "taberareta"}));
     });

    test("Should get the causative, causative-passive, causative-passive-past form of verbs", () => {
        expect(getCausativeForm(aruku)).toEqual(expect.objectContaining({word: "歩かせる", romaji: "arukaseru"}));
        expect(getCausativeForm(kuru)).toEqual(expect.objectContaining({word: "来させる", romaji: "kosaseru"}));
        expect(getCausativeForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強させる", romaji: "benkyousaseru"}));
        expect(getCausativeForm(taberu)).toEqual(expect.objectContaining({word: "食べさせる", romaji: "tabesaseru"}));

        expect(getCausativeForm(aruku, "passive")).toEqual(expect.objectContaining({word: "歩かせられる", romaji: "arukaserareru"}));
        expect(getCausativeForm(kuru, "passive")).toEqual(expect.objectContaining({word: "来させられる", romaji: "kosaserareru"}));
        expect(getCausativeForm(benkyousuru, "passive")).toEqual(expect.objectContaining({word: "勉強させられる", romaji: "benkyousaserareru"}));
        expect(getCausativeForm(taberu, "passive")).toEqual(expect.objectContaining({word: "食べさせられる", romaji: "tabesaserareru"}));

        expect(getCausativeForm(aruku, "passive-past")).toEqual(expect.objectContaining({word: "歩かせられた", romaji: "arukaserareta"}));
        expect(getCausativeForm(kuru, "passive-past")).toEqual(expect.objectContaining({word: "来させられた", romaji: "kosaserareta"}));
        expect(getCausativeForm(benkyousuru, "passive-past")).toEqual(expect.objectContaining({word: "勉強させられた", romaji: "benkyousaserareta"}));
        expect(getCausativeForm(taberu, "passive-past")).toEqual(expect.objectContaining({word: "食べさせられた", romaji: "tabesaserareta"}));
    });

    test("Should get the polite, past, negative, past-polite, past-negative, polite-negative, and past-polite-negative form of adjectives", () => {
        expect(getAdjectiveForm(yasui, "polite")).toEqual(expect.objectContaining({word: "安いです", romaji: "yasuidesu"}));
        expect(getAdjectiveForm(benri, "polite")).toEqual(expect.objectContaining({word: "便利です", romaji: "benridesu"}));
        expect(getAdjectiveForm(ii, "polite")).toEqual(expect.objectContaining({word: "いいです", romaji: "iidesu"}));

        expect(getAdjectiveForm(yasui, "past")).toEqual(expect.objectContaining({word: "安かった", romaji: "yasukatta"}));
        expect(getAdjectiveForm(benri, "past")).toEqual(expect.objectContaining({word: "便利だった", romaji: "benridatta"}));
        expect(getAdjectiveForm(ii, "past")).toEqual(expect.objectContaining({word: "よかった", romaji: "yokatta"}));

        expect(getAdjectiveForm(yasui, "negative")).toEqual(expect.objectContaining({word: "安くない", romaji: "yasukunai"}));
        expect(getAdjectiveForm(benri, "negative")).toEqual(expect.objectContaining({word: "便利じゃない", romaji: "benrijanai"}));
        expect(getAdjectiveForm(ii, "negative")).toEqual(expect.objectContaining({word: "よくない", romaji: "yokunai"}));

        expect(getAdjectiveForm(yasui, "past-polite")).toEqual(expect.objectContaining({word: "安かったです", romaji: "yasukattadesu"}));
        expect(getAdjectiveForm(benri, "past-polite")).toEqual(expect.objectContaining({word: "便利でした", romaji: "benrideshita"}));
        expect(getAdjectiveForm(ii, "past-polite")).toEqual(expect.objectContaining({word: "よかったです", romaji: "yokattadesu"}));

        expect(getAdjectiveForm(yasui, "past-negative")).toEqual(expect.objectContaining({word: "安くなかった", romaji: "yasukunakatta"}));
        expect(getAdjectiveForm(benri, "past-negative")).toEqual(expect.objectContaining({word: "便利じゃなかった", romaji: "benrijanakatta"}));
        expect(getAdjectiveForm(ii, "past-negative")).toEqual(expect.objectContaining({word: "よくなかった", romaji: "yokunakatta"}));

        expect(getAdjectiveForm(yasui, "polite-negative")).toEqual(expect.objectContaining({word: "安くありません", romaji: "yasukuarimasen"}));
        expect(getAdjectiveForm(benri, "polite-negative")).toEqual(expect.objectContaining({word: "便利じゃありません", romaji: "benrijaarimasen"}));
        expect(getAdjectiveForm(ii, "polite-negative")).toEqual(expect.objectContaining({word: "よくないです", romaji: "yokunaidesu"}));

        expect(getAdjectiveForm(yasui, "past-polite-negative")).toEqual(expect.objectContaining({word: "安くありませんでした", romaji: "yasukuarimasendeshita"}));
        expect(getAdjectiveForm(benri, "past-polite-negative")).toEqual(expect.objectContaining({word: "便利じゃありませんでした", romaji: "benrijaarimasendeshita"}));
        expect(getAdjectiveForm(ii, "past-polite-negative")).toEqual(expect.objectContaining({word: "よくなかったです", romaji: "yokunakattadesu"}));
    });

    test("Should get the mashou form of verbs", () => {
        expect(getMashouForm(aruku)).toEqual(expect.objectContaining({word: "歩きましょう", romaji: "arukimashou"}));
        expect(getMashouForm(kuru)).toEqual(expect.objectContaining({word: "来ましょう", romaji: "kimashou"}));
        expect(getMashouForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強しましょう", romaji: "benkyoushimashou"}));
        expect(getMashouForm(taberu)).toEqual(expect.objectContaining({word: "食べましょう", romaji: "tabemashou"}));
    });

    test("Should get the tai form of verbs", () => {
        expect(getTaiForm(aruku)).toEqual(expect.objectContaining({word: "歩きたい", romaji: "arukitai"}));
        expect(getTaiForm(kuru)).toEqual(expect.objectContaining({word: "来たい", romaji: "kitai"}));
        expect(getTaiForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強したい", romaji: "benkyoushitai"}));
        expect(getTaiForm(taberu)).toEqual(expect.objectContaining({word: "食べたい", romaji: "tabetai"}));
    });

     test("Should get the teiru form of verbs", () => {
        expect(getTeiruForm(aruku)).toEqual(expect.objectContaining({word: "歩いている", romaji: "aruiteiru"}));
        expect(getTeiruForm(kuru)).toEqual(expect.objectContaining({word: "来ている", romaji: "kiteiru"}));
        expect(getTeiruForm(benkyousuru)).toEqual(expect.objectContaining({word: "勉強している", romaji: "benkyoushiteiru"}));
        expect(getTeiruForm(taberu)).toEqual(expect.objectContaining({word: "食べている", romaji: "tabeteiru"}));
    });
  
})