export interface BasicResponse {
  message: string | null;
  status: number;
}

export type FetchBaseQueryError =
  | {
      status: number;
      data: unknown;
    }
  | {
      status: "FETCH_ERROR";
      data?: undefined;
      error: string;
    }
  | {
      status: "PARSING_ERROR";
      originalStatus: number;
      data: string;
      error: string;
    }
  | {
      status: "CUSTOM_ERROR";
      data?: unknown;
      error: string;
    };

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}
