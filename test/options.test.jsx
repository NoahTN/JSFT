import { beforeEach, describe, expect, test } from "vitest";
import { getRandomWord, generateProblem } from "/src/components/generator";
import OptionBox, { OPTION_OBJECT } from "../src/components/options";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Options Tests", () => {
    beforeEach(() => {
        const temp = {};
         Object.entries(OPTION_OBJECT).map(([k, v]) => {
            temp[k] = Array(v.length).fill(false);
            temp[k][0] = true;
        })
        render(<OptionBox initialSettings={ temp } debugOptions={ true } updateOptions={ () => {} }/>);
    });

    test("Should filter by nouns and adjectives", () => {
        const nounCheckbox = screen.getByRole("checkbox", {name: "Noun"});
        const adjectiveCheckbox = screen.getByRole("checkbox", {name: "Adjective"});
        fireEvent.click(adjectiveCheckbox);
        expect(nounCheckbox.checked).toEqual(true);
        expect(adjectiveCheckbox.checked).toEqual(true);
    });

    test.skip("Should filter by words and tenses", () => {

    });

    test.skip("Should filter by words and tenses, then only words after uncheck", () => {
    
    });

    test.skip("Should prevent words from being completely unchecked", () => {

    });

    test.skip("Should filter words by level", () => {

    });
})