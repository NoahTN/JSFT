import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, test} from "vitest";
import Interactor from "/src/interactor";

describe("Interactor Tests", () => {
    test("Test basic answer functionality", () => {
        const interactor = render(<Interactor debug={{expected: "aka"}}/>);
        const form = interactor.container.querySelector("form");
        const input = interactor.container.querySelector("input")
        fireEvent.input(input, {target: { value: "aka"}});
        fireEvent.submit(form);
        expect(interactor.getByText("Correct Answer")).toBeDefined();
    });
})