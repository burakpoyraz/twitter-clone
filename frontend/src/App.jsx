import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const {
    data: authUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error("Unauthenticated");
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  console.log(authUser);

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
        <Route
          path="/login"
          element={authUser ? <HomePage /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <HomePage /> : <SignUpPage />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <LoginPage />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <LoginPage />}
        />
      </Routes>

      {authUser && <RightPanel/>}
      <Toaster />
    </div>
  );
}

export default App;
