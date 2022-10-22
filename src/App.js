import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context/useContext";
import Auth from "./pages/Auth";
import Monitoring from "./pages/Monitoring";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate("/login");
    } else {
      if (state.user.status === "admin") {
        navigate("/");
      } else if (state.user.status === "customer") {
        navigate("/");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Monitoring />} />
      <Route path="/login" element={<Auth />} />
    </Routes>
  );
}

export default App;
