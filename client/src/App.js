import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Navbar_Userprofile from "./components/Navbar_Userprofile";
import Home from "./components/Home";
import Applications from "./components/Applications";
import ApplicationsUser from "./components/ApplicationsUser";
import UserProfile from "./components/UserProfile";
import AdminProfile from "./components/AdminProfile";
import Board from "./components/Board";
import CreateGroup from "./components/CreateGroup";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
            path="/dashboard/:user"
          />
          <Route
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
            path="/Home/:user"
          />
          <Route
            element={
              <>
                <Navbar_Userprofile />
                <Home />
              </>
            }
            path="/Home_UserProfile/:user"
          />
          <Route
            element={
              <>
                <Navbar />
              </>
            }
            path="/navbar/:user"
          />

          <Route
            element={
              <>
                <Navbar_Userprofile />
              </>
            }
            path="/navbar_userprofile/:user"
          />
          <Route
            element={
              <>
                <Navbar_Userprofile /> <UserProfile />
              </>
            }
            path="/UserProfile/:user"
          />
          <Route
            element={
              <>
                <Navbar /> <ApplicationsUser />
              </>
            }
            path="/Apps/:user"
          />
          <Route
            element={
              <>
                <Navbar_Userprofile /> <ApplicationsUser />
              </>
            }
            path="/Apps_User/:user"
          />
          <Route
            element={
              <>
                <Navbar /> <AdminProfile />
              </>
            }
            path="/AdminProfile/:user"
          />
          <Route
            element={
              <>
                <Navbar /> <Board />
              </>
            }
            path="/Board/:user/:app_name"
          />
          <Route
            element={
              <>
                <Navbar_Userprofile /> <Board />
              </>
            }
            path="/UserBoard/:user/:app_name"
          />
        </Route>
        <Route element={<Login />} path="/" />

        {/* <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/:user"
          element={
            <>
              <Navbar /> <Dashboard />
            </>
          }
        />
        <Route
          path="/home/:user"
          element={
            <>
              <Navbar /> <Home />
            </>
          }
        />
        <Route
          path="/Home_UserProfile/:user"
          element={
            <>
              <Navbar_Userprofile /> <Home />
            </>
          }
        />
        <Route
          path="/navbar/:user"
          element={
            <>
              <Navbar />
            </>
          }
        />
        <Route
          path="/navbar_userprofile/:user"
          element={
            <>
              <Navbar_Userprofile />
            </>
          }
        />
        <Route
          path="/UserProfile/:user"
          element={
            <>
              <Navbar_Userprofile /> <UserProfile />
            </>
          }
        />

        <Route
          path="/AdminProfile/:user"
          element={
            <>
              <Navbar /> <AdminProfile />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar /> <Register />
            </>
          }
        />
        <Route
          path="/creategroup"
          element={
            <>
              <Navbar /> <CreateGroup />
            </>
          }
        />
        <Route
          path="/AdminUpdateUser/:user"
          element={
            <>
              <Navbar /> <AdminUpdateUser />
            </>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
