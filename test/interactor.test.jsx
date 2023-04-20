import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeAll, describe, expect, test} from "vitest";
import Interactor from "/src/components/interactor";

describe("Interactor Tests", () => {
    test.skip("Should display correct answer message", () => {
        const interactor = render(<Interactor debug={{ expected: "aka" }}/>);
        const form = interactor.getByRole("form", {name: "submit-answer"});
        const input = interactor.getByRole("textbox", {name: "input-answer"});
        fireEvent.input(input, {target: { value: "aka"}});
        fireEvent.submit(form);
        expect(interactor.getByText("Correct Answer")).toBeDefined();
    });

    // TO IMPLEMENT
    test.skip("Should display correct answer message given random word", () => {
        const interactor = render(<Interactor />);
        const wordButton = interactor.getByRole("button", {name: "option-single-word"});
        fireEvent.input(wordButton);
        const answer = interactor.getByRole("text", {name: "expected-answer"});
        const form = interactor.getByRole("form", {name: "submit-answer"});
        const input = interactor.getByRole("textbox", {name: "input-answer"});
        fireEvent.input(input, {target: { value: answer.textContent}});
        fireEvent.submit(form);
        expect(interactor.getByText("Correct Answer")).toBeDefined();
    });
})