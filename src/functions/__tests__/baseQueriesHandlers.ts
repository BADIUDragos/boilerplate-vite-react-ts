import { HttpResponse, http } from "msw";
import { API_URL } from "../../constants/urls";
import { reAuthedTokens } from "../../store/slices/__tests__/authSetups";

const invalidAccessTokenError = {
  code: "token_not_valid",
  messages: [
    {
      token_type: "access",
    },
  ],
};

export const baseQueriesHandlers = [
  http.post(`${API_URL}/auth/login`, async () => {
    return new HttpResponse(
      JSON.stringify(invalidAccessTokenError), 
      { status: 401 }
    );
  }),
  http.post(`${API_URL}/auth/login/refresh`, async () => {
    return HttpResponse.json(reAuthedTokens);
  }),
];

export const failedRefreshTokenHandler = http.post(`${API_URL}/auth/login/refresh`, async () => {
  return new HttpResponse( null, {
    status: 401
  })
})



