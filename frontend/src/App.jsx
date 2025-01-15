// frontend/src/App.jsx
import LandingPage from "./components/LandingPage/LandingPage";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import LikesPage from "./components/LikesPage/LikesPage";
import CommentsPage from "./components/CommentsPage/CommentsPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import PurchasePage from "./components/PurchasePage/PurchasePage";
import GiftPage from "./components/GiftPage/GiftPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/likes",
        element: <LikesPage />,
      },
      {
        path: "/comments",
        element: <CommentsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/purchases",
        element: <PurchasePage />,
      },
      {
        path: "/gifts/:giftId",
        element: <GiftPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
