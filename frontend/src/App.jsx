import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

// Import components
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CityConfiguration from "./pages/CityConfiguration";
import RouteManagement from "./pages/RouteManagement";
import UserManagement from "./pages/UserManagement";
import AnnouncementManagement from "./pages/AnnouncementManagement";
import ProtectedRoute from "./components/common/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Green color for environmental theme
    },
    secondary: {
      main: "#00796B",
    },
  },
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/city-configuration"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CityConfiguration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/routes"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RouteManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AnnouncementManagement />
                </ProtectedRoute>
              }
            />

            {/* Dispatcher Routes */}
            <Route
              path="/dispatcher/dashboard"
              element={
                <ProtectedRoute allowedRoles={['dispatcher']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Collector Routes */}
            <Route
              path="/collector/dashboard"
              element={
                <ProtectedRoute allowedRoles={['collector']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Householder Routes */}
            <Route
              path="/householder/dashboard"
              element={
                <ProtectedRoute allowedRoles={['householder']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect /dashboard to role-specific dashboard */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
          </Routes>
          <ToastContainer />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
