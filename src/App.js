import "./App.css";

import { BrowserRouter, Routes, Route /* , Navigate */ } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
import { useGlobalContext } from "./context/GlobalContext";
import { useEffect, useState } from "react";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmailFirst from "./pages/VerifyEmailFirst";
import VerifyEmailForm from "./pages/VerifyEmailForm";

function App() {
  const { state } = useGlobalContext();

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
          {!isAuthenticated && (
            <>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route
                path="reset-password/:token?"
                element={<ResetPassword />}
              />
              {/* <Route path="verify-email/:token" element={<Register />} /> */}
            </>
          )}
          {/* auth routes */}
          {isAuthenticated && (
            <>
              {/* both verified and unverified authenticated routes  */}
              <Route path="profile" element={<Profile />} />
              {/* unverified only authenticated routes  */}
              {!isVerified && (
                <>
                  <Route
                    path="verify-email-first"
                    element={<VerifyEmailFirst />}
                  />
                  <Route
                    path="verify-email/:token"
                    element={<VerifyEmailForm />}
                  />
                </>
              )}
              {/* 
              <Route path="" element={< />} /> 
            */}
              {/* verified authenticated routes  */}
              {/* 
              <Route path="" element={< isVerified />} />
            */}
            </>
          )}

          {/* fallback */}
          <Route path="*" element={<Home />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
