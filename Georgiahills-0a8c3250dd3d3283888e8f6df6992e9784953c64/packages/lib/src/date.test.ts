import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatIsoDate, isPastDate } from "./date.ts";

describe("date utils", () => {
  describe("isPastDate", () => {
    it("returns true for a past date string", () => {
      assert.equal(isPastDate("2000-01-01T00:00:00.000Z"), true);
    });

    it("returns true for a past Date object", () => {
      assert.equal(isPastDate(new Date("2000-01-01T00:00:00.000Z")), true);
    });

    it("returns false for a future date string", () => {
      assert.equal(isPastDate("2100-01-01T00:00:00.000Z"), false);
    });

    it("returns false for a future Date object", () => {
      assert.equal(isPastDate(new Date("2100-01-01T00:00:00.000Z")), false);
    });

    it("throws an error for an invalid date string", () => {
      assert.throws(() => isPastDate("not-a-date"), {
        name: "Error",
        message: "Invalid date value",
      });
    });

    it("throws an error for an invalid Date object", () => {
      assert.throws(() => isPastDate(new Date("invalid")), {
        name: "Error",
        message: "Invalid date value",
      });
    });
  });

  describe("formatIsoDate", () => {
    it("formats a valid date string", () => {
      assert.equal(
        formatIsoDate("2000-01-01T00:00:00.000Z"),
        "2000-01-01T00:00:00.000Z"
      );
    });

    it("formats a valid Date object", () => {
      assert.equal(
        formatIsoDate(new Date("2000-01-01T00:00:00.000Z")),
        "2000-01-01T00:00:00.000Z"
      );
    });

    it("throws an error for an invalid date string", () => {
      assert.throws(() => formatIsoDate("not-a-date"), {
        name: "Error",
        message: "Invalid date value",
      });
    });

    it("throws an error for an invalid Date object", () => {
      assert.throws(() => formatIsoDate(new Date("invalid")), {
        name: "Error",
        message: "Invalid date value",
      });
    });
  });
});
