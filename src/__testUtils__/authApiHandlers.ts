import { HttpResponse, http } from "msw";
import { API_URL } from "../constants/urls";

export const authApiHandler = [
  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      access:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.w5IlmWh_ED29v5dKTyVxlsMTCl8r0DymmJsjUsYahx4",
      refresh: "mock_refresh_token",
    });
  }),
  http.post(`${API_URL}/auth/logout`, async () => {
    return new HttpResponse(null, {
      status: 200,
    });
  }),
];
