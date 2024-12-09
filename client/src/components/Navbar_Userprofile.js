import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import jwt_decode from "jwt-decode";

const Navbar_Userprofile = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState("");
  // const [expire, setExpire] = useState("");
  // const [username, setUsername] = useState("");
  let { user } = useParams();

  useEffect(() => {
    refreshToken();
    // Verify();
  }, []);

  // const refreshToken = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/token");
  //     setToken(response.data.accessToken);
  //     const decoded = jwt_decode(response.data.accessToken);
  //     setUsername(decoded.name);
  //     setExpire(decoded.exp);
  //   } catch (error) {
  //     if (error.response) {
  //       navigate("/");
  //     }
  //   }
  // };

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:3001/token", {
        username: user
      });
      //console.log(response);
      if (response.data == true) {
        console.log("refreshtoken complete");
      } else {
        await axios.post("http://localhost:3001/logout");
        navigate("/");
        sessionStorage.clear();
      }
    } catch (error) {
      // setToken(response.data.accessToken);
      // const decoded = jwt_decode(response.data.accessToken);
      // setUsername(decoded.name);
      // setExpire(decoded.exp);
      if (error.response) {
        navigate("/");
      }
    }
  };

  const Logout = async () => {
    try {
      await axios.post("http://localhost:3001/logout");
      navigate("/");
      sessionStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  const GoHome = async () => {
    navigate(`/Home_UserProfile/${user}`);
  };

  const Profile = async () => {
    navigate(`/UserProfile/${user}`);
  };

  const GoApps = async () => {
    navigate(`/Apps_User/${user}`);
  };

  // function Verify() {
  //   var UserSession = sessionStorage.getItem("Username");
  //   console.log(UserSession);
  //   console.log(user);
  //   console.log(user == UserSession);

  //   if (user == UserSession) {
  //     console.log("i am in");
  //     return (
  //       <>
  //         {" "}
  //         <h1>hello</h1>
  //         <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
  //           <div className="container">
  //             <div className="navbar-brand">
  //               <div id="navbarBasicExample" className="navbar-menu">
  //                 <div className="navbar-start">
  //                   <div className="buttons">
  //                     <button onClick={GoHome} className="button is-dark">
  //                       Home
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div id="navbarBasicExample" className="navbar-menu">
  //                 <div className="navbar-start">
  //                   <div className="buttons">
  //                     <button onClick={GoApps} className="button is-dark">
  //                       Applications
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div id="navbarBasicExample" className="navbar-menu">
  //                 <div className="navbar-start">
  //                   <div className="buttons">
  //                     <button onClick={Profile} className="button is-dark">
  //                       Profile
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>

  //               <a href="/" role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
  //                 <span aria-hidden="true"></span>
  //                 <span aria-hidden="true"></span>
  //                 <span aria-hidden="true"></span>
  //               </a>
  //             </div>

  //             <div id="navbarBasicExample" className="navbar-menu">
  //               <div className="navbar-start"></div>

  //               <div className="navbar-end">
  //                 <div className="navbar-item">
  //                   <div className="buttons">
  //                     <button onClick={Logout} className="button is-light">
  //                       Log Out
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </nav>
  //       </>
  //     );
  //   } else {
  //     navigate(`Home/${username}`);
  //   }
  // }
  // Verify();
  return (
    <>
      {" "}
      <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start">
                <div className="buttons">
                  <button onClick={GoHome} className="button is-dark">
                    Home
                  </button>
                </div>
              </div>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start">
                <div className="buttons">
                  <button onClick={GoApps} className="button is-dark">
                    Applications
                  </button>
                </div>
              </div>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start">
                <div className="buttons">
                  <button onClick={Profile} className="button is-dark">
                    Profile
                  </button>
                </div>
              </div>
            </div>

            <a href="/" role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start"></div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button onClick={Logout} className="button is-light">
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar_Userprofile;
