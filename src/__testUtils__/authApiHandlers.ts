import { http, RequestHandler, HttpResponse } from "msw";

export const authHandlers: RequestHandler[] = [
  http.post("/auth/token", () => {
    return HttpResponse.json({
      access: "mock_access_token",
      refresh: "mock_refresh_token",
    });
  }),
  http.post("/auth/token/blacklist", () => {
    return new HttpResponse(null, {status: 200});
  }),
];
