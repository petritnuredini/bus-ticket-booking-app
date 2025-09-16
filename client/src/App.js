import React, { lazy, Suspense } from "react";
import "./index.css";
import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { ChatProvider } from "./contexts/ChatContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import GlobalLanguageSwitcher from "./components/GlobalLanguageSwitcher";
import "./i18n";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminBookings = lazy(() => import("./pages/Admin/AdminBookings"));
const AdminBuses = lazy(() => import("./pages/Admin/AdminBuses"));
const AdminDailyBuses = lazy(() => import("./pages/Admin/AdminDailyBuses"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const DailyBusesView = lazy(() => import("./pages/DailyBusesView"));
const InternationalBooking = lazy(() => import("./pages/InternationalBooking"));
const Home = lazy(() => import("./pages/Home"));
const BookNow = lazy(() => import("./pages/BookNow"));
const Bookings = lazy(() => import("./pages/Bookings"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const EmailSent = lazy(() => import("./pages/EmailSent"));
const PasswordResetSuccess = lazy(() => import("./pages/PasswordResetSuccess"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AgentLoginPage = lazy(() => import("./pages/AgentLoginPage"));
const AgentDashboardPage = lazy(() => import("./pages/AgentDashboardPage"));
const AdminTicketValidator = lazy(() => import("./pages/Admin/AdminTicketValidator"));

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div className="App">
      {loading && <Loader />}
      <LanguageProvider>
        <ChatProvider>
          <BrowserRouter>
            <GlobalLanguageSwitcher position="top-right" />
            <Suspense fallback={loading}>
              <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                }
              />

              <Route
                path="/password-reset-success"
                element={
                  <PublicRoute>
                    <PasswordResetSuccess />
                  </PublicRoute>
                }
              />

              <Route
                path="/email-sent"
                element={
                  <PublicRoute>
                    <EmailSent />
                  </PublicRoute>
                }
              />

              <Route
                path="/reset-password/:userId/:resetString"
                element={
                  <PublicRoute>
                    <UpdatePassword />
                  </PublicRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              <Route
                path="/easy-booking"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/book-now/:id"
                element={
                  <ProtectedRoute>
                    <BookNow />
                  </ProtectedRoute>
                }
              />

              <Route path="/daily-buses" element={<DailyBusesView />} />

              <Route
                path="/international-booking"
                element={
                  <PublicRoute>
                    <InternationalBooking />
                  </PublicRoute>
                }
              />

              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/buses"
                element={
                  <ProtectedRoute>
                    <AdminBuses />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/daily-buses"
                element={
                  <ProtectedRoute>
                    <AdminDailyBuses />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/ticket-validator"
                element={
                  <ProtectedRoute>
                    <AdminTicketValidator />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Chat Routes */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              {/* Agent Routes */}
              <Route
                path="/agent/login"
                element={
                  <PublicRoute>
                    <AgentLoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/agent/dashboard/:agentId"
                element={
                  <PublicRoute>
                    <AgentDashboardPage />
                  </PublicRoute>
                }
              />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ChatProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
