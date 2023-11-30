import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      { path: "/", element: <HomePage/> },
      { path: "/login", element: <ProtectedRoute redirectUrl={"/"}><LoginPage/></ProtectedRoute> },
      { path: "*", element: <NotFoundPage/> }
    ],
    errorElement: <ErrorPage />,
  }
]);

export default router;
