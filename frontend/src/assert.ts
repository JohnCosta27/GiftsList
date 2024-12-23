export function assert(condition: boolean): asserts condition {
    if (condition === false) {
        throw new Error("Assertion failed.");
    }
}
