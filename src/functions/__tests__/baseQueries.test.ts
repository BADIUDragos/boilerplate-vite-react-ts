import { describe, it, expect } from "vitest";

import { getWrapper } from "../../__testUtils__/functions";
import { useLoginMutation } from "../../store/apis/authApi";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";

const exampleTokenError = {
  code: "token_not_valid",
  messages: [
    {
      token_type: "access",
    },
  ],
};

describe("baseQueryWithReauth", () => {
  it("updates tokens on success", () => {});
});
