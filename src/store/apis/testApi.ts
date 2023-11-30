import { baseApi } from "./baseApi";

interface ListOfStrings {
  testModels: string[] | null;
}

const testApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTestStrings: build.query<ListOfStrings, null>({
      query: () => ({
        url: "/test",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTestStringsQuery } = testApi
export { testApi };