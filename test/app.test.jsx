import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";

describe("Basic Tests", () => {
    test("Should return true", () => {
        expect(Math.sqrt(4)).toBe(2)
        expect(Math.sqrt(144)).toBe(12)
        expect(Math.sqrt(2)).toBe(Math.SQRT2)
    });
})
