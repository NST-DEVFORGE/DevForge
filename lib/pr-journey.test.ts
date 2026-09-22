import { describe, expect, it } from "vitest";

import { validateReflection } from "./pr-journey";

const validReflection = {
    tried: "I traced the request through the route and service layers.",
    broke: "The validation error did not identify its source field.",
    reviewerSaid: "Please make the error actionable.",
    differently: "I would start with focused validation tests.",
    hours: 1,
    rounds: 0,
    status: "open",
};

describe("validateReflection", () => {
    it.each([
        ["tried", "What I tried", 101],
        ["broke", "What broke", 101],
        ["differently", "What I would do differently", 61],
    ])("names the %s field when it exceeds its word cap", (key, label, count) => {
        expect(() => validateReflection({
            ...validReflection,
            [key]: Array.from({ length: count }, () => "word").join(" "),
        })).toThrow(`"${label}" is capped`);
    });
});
