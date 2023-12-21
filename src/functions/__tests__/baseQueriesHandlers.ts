import { HttpResponse, http } from "msw";
import { API_URL } from "../../constants/urls";
import { reAuthedTokens } from "../../store/slices/__tests__/authSetups";


export const baseQueriesHandlers = [
  http.post(`${API_URL}/auth/login`, async () => {
    return new HttpResponse(null, { status : 401});
  }),
  http.post(`${API_URL}/auth/login/refresh`, async () => {
    return HttpResponse.json(reAuthedTokens);
  }),
];
