import { describe, it, expect } from "vitest";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import getErrorString from "../getErrorString";

describe("getErrorString function", () => {
  it("should return the message from a SerializedError", () => {
    const serializedError: SerializedError = {
      name: "ErrorName",
      message: "SerializedError Message",
    };

    const result = getErrorString(serializedError);

    expect(result).toBe("SerializedError Message");
  });

  it("should return the detail from a FetchBaseQueryError if it's a string", () => {
    const fetchBaseQueryError: FetchBaseQueryError = {
      status: 400,
      data: {
        detail: "FetchBaseQueryError Detail",
      },
    };

    const result = getErrorString(fetchBaseQueryError);

    expect(result).toBe("FetchBaseQueryError Detail");
  });

  it("should return 'Unknown error' if the error isn't even an object", () => {
    const unknownError = "This is an unknown error";

    const result = getErrorString(unknownError as SerializedError);

    expect(result).toBe("Error received isn't an object");
  });

  it("should return 'Unknown error' if the error isn't either Serialized or FetchBaseQuery errors", () => {
    const unknownError = {something : "not what we're looking for", that: "will return Unknown error"};

    // @ts-expect-error
    const result = getErrorString(unknownError);

    expect(result).toBe("Unknown error");
  });
});