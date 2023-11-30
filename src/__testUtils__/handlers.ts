import { HttpResponse, http } from "msw"
import { API_URL } from "../constants/urls"

export const authApiHandlers = [
  http.get(`${API_URL}/auth/token`, async ({request}) => {
    const url = new URL(request.url)
    const username = url.searchParams.get('username')
    if (username === 'success') {
      return HttpResponse.json({
        access:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXIiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2NvbnRlbnQiXSwiaXNTdGFmZiI6ZmFsc2V9.obYAd0EK9QcZLdX3cDRNSRf2bvo7sw_O0J3qsiJ1w_A",
        refresh: "refresh",
      })
    } else {
      return new HttpResponse('Bad credentials', {
        status: 400
      })
    }
  })
]