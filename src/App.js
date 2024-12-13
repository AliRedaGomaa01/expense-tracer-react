import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import { useGlobalContext } from "./context/GlobalContext";
import { useEffect, useState } from "react";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmailFirst from "./pages/VerifyEmailFirst";
import VerifyEmailForm from "./pages/VerifyEmailForm";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import ExpenseIndex from "./pages/Expenses";
import ShowMessage from "./pages/ShowMessage";

function App() {
  const { state } = useGlobalContext();

  const [middlewareRedirects, setMiddlewareRedirects] = useState({});

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!state?.auth?.token?.text &&
      new Date(state?.auth?.token?.expires_at) > new Date()
  );

  const [isVerified, setIsVerified] = useState(
    !!state?.auth?.user?.email_verified_at
  );

  useEffect(() => {
    const tokenIsValid =
      !!state?.auth?.token?.text &&
      new Date(state?.auth?.token?.expires_at) > new Date();
    const userIsVerified = !!state?.auth?.user?.email_verified_at;

    setIsAuthenticated(!!tokenIsValid);
    setIsVerified(!!userIsVerified);

    setMiddlewareRedirects({
      guest: !!tokenIsValid && (
        <ShowMessage message="Logout To Reach This Page" />
      ),
      auth: !tokenIsValid && <ShowMessage message="Login To Reach This Page" />,
      verified: !userIsVerified && <VerifyEmailFirst />,
      unverified: !!userIsVerified && (
        <ShowMessage message="Your email is already verified" />
      ),
    });
  }, [
    state?.auth?.token?.text,
    state?.auth?.token?.expires_at,
    state?.auth?.user?.email_verified_at,
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isAuthenticated={isAuthenticated} isVerified={isVerified} />
          }
        >
          {/* both guest and auth routes */}
          <Route index element={<Home />} />
          {/* guest routes */}
          <Route
            path="register"
            element={middlewareRedirects.guest || <Register />}
          />
          <Route
            path="login"
            element={middlewareRedirects.guest || <Login />}
          />
          <Route
            path="forgot-password"
            element={middlewareRedirects.guest || <ForgotPassword />}
          />
          <Route
            path="reset-password/:token?"
            element={middlewareRedirects.guest || <ResetPassword />}
          />
          {/* auth routes */}
          {/* both verified and unverified authenticated routes  */}
          <Route
            path="profile"
            element={middlewareRedirects.auth || <Profile />}
          />
          {/* unverified only authenticated routes  */}
          <Route path="verify-email" element={<VerifyEmailFirst />} />
          <Route
            path="verify-email/:token"
            element={
              middlewareRedirects.auth ||
              middlewareRedirects.unverified || <VerifyEmailForm />
            }
          />
          {/* verified authenticated routes  */}
          <Route path="expenses">
            <Route
              index
              element={
                middlewareRedirects.auth ||
                middlewareRedirects.verified || <ExpenseIndex />
              }
            />
          </Route>
        </Route>
        {/* fallback  page */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
