import { HomePage, LoginPage, Layout, ErrorPage, NotFoundPage } from "../pages"
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      { path: "/", element: <HomePage/> },
      { path: "/login", element: <LoginPage/> },
      { path: "*", element: <NotFoundPage/> }
    ],
    errorElement: <ErrorPage />,
  }
]);

export default router;
