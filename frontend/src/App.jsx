import "./styles/app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { Protected, Public, Admin } from "./middleware/route";
import React, { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import './index.css';
import HealthDashboard from "./pages/HealthDashboard";
import AppointmentAnalyse from "./components/HealthManager/appoinmentAnalyse";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ApplyDoctor = lazy(() => import("./pages/ApplyDoctor"));
const Error = lazy(() => import("./pages/Error"));
const Payment = lazy(() => import("./pages/Payment"));
const HealthHome = lazy(() => import("./pages/HealthHome"));
//hi
function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={
              <Public>
                <Register />
              </Public>
            }
          />
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/doctors"
            element={<Doctors />}
          />
          <Route
            path="/appointments"
            element={
              <Protected>
                <Appointments />
              </Protected>
            }
          />
          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path="/applyfordoctor"
            element={
              <Protected>
                <ApplyDoctor />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <Admin>
                <Dashboard type={"users"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/doctors"
            element={
              <Admin>
                <Dashboard type={"doctors"} />
              </Admin>
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              <Protected>
                <Dashboard type={"appointments"} />
              </Protected>
            }
          />
          <Route
            path="/dashboard/applications"
            element={
              <Protected>
                <Dashboard type={"applications"} />
              </Protected>
            }
          />
          <Route
          path="/dashboard/config"
          element={
            <Protected>
              <Dashboard type={"config"} />
            </Protected>
          }
        />
        <Route
          path="/dashboard/add-hospital-staff"
          element={
            <Protected>
              <Dashboard type={"AddHospitalStaff"} />
            </Protected>
          }
        />
          <Route
            path="/dashboard/add-health-manager"
            element={
              <Protected>
              <Dashboard type={"AddHealthManager"} />
              </Protected>
            }
          />
          <Route
            path="/dashboard/add-staff-member"
            element={
              <Protected>
              <Dashboard type={"AddStaffMember"} />
              </Protected>
            }
          />
          <Route
            path="/dashboard/all-staff-members"
            element={
              <Protected>
              <Dashboard type={"AllStaffMembers"} />
              </Protected>
            }
          />
          <Route
            path="/pay"
            element={
              <Protected>
                <Payment />
              </Protected>
            }
          />
          <Route
            path="*"
            element={<Error />}
          />
          <Route path="/HealthHome" element={<HealthHome />} />
          <Route path="/healthDashboard" element={<HealthDashboard />} />
          <Route path="/healthDashboard/appoinmentAnalyse" element={<AppointmentAnalyse />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
