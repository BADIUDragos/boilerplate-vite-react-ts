import { HttpResponse, http } from "msw";
import { API_URL } from "../constants/urls";

export const authApiHandler = [
  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      access:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXIiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2NvbnRlbnQiXSwiaXNTdGFmZiI6ZmFsc2V9.obYAd0EK9QcZLdX3cDRNSRf2bvo7sw_O0J3qsiJ1w_A",
      refresh: "refresh",
    });
  }),
];
