import { HttpResponse, http } from "msw";
import { API_URL } from "../../../constants/urls";
import { tokenBody } from "../../slices/__tests__/authSetups";

export const authApiHandler = [
  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json(tokenBody);
  }),
  http.post(`${API_URL}/auth/logout`, async () => {
    return new HttpResponse(null, {
      status: 200,
    });
  }),
];

export const failedLoginHandler = http.post(
  `${API_URL}/auth/login`,
  async () => {
    return new HttpResponse(null, {
      status: 401,
    });
  }
);

export const failedLogOutHandler = http.post(
  `${API_URL}/auth/logout`,
  async () => {
    return new HttpResponse(null, {
      status: 401,
    });
  }
);

export const useLoginMutationFailedLoginHandler = http.post('/auth/login', () => {
  setTimeout(() => {}, 1000)
  return HttpResponse.error()
})
