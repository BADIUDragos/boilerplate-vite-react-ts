import { http, RequestHandler, HttpResponse } from "msw";
import { API_URL } from "../constants/urls";

export const authHandlers: RequestHandler[] = [
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHJvbGxzLXJveWNlLmNvbSIsInBlcm1pc3Npb25zIjpbInZpZXdfY29udGVudCJdLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.Xw1uPDh6gBTu34bgsjwAi5F8ahBpbEbMDev33hCoOzE",
      refresh: "mock_refresh_token",
    });
  }),
  http.post(`${API_URL}/auth/logout`, () => {
    return new HttpResponse(null, {status: 200});
  }),
];
