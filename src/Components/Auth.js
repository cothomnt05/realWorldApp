import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../features/authState";
import { userState } from "../features/userState";

function Auth({ isLoginScreen }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(userState);
  const [error, setError] = useState(false);
  const nagivate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api.realworld.io/api/users/login", {
        user: {
          email: email,
          password: password,
        },
      });
      setUser({
        email: res.data.user.email,
        token: res.data.user.token,
        username: res.data.user.username,
      });
      localStorage.setItem("JWT", JSON.stringify(res.data));
      setAuth(res.data);
      nagivate("/");
    } catch (error) {
      setError(true);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api.realworld.io/api/users", {
        user: {
          username: username,
          email: email,
          password: password,
        },
      });
      setUser({
        email: res.data.user.email,
        token: res.data.user.token,
        username: res.data.user.username,
      });
      setAuth(res.data);
      localStorage.setItem("JWT", res.data.user.token);
      nagivate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              {isLoginScreen ? (
                <>
                  <h1 className="text-xs-center">Sign in</h1>
                  <p className="text-xs-center">
                    <Link to="/Register">Need an account?</Link>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xs-center">Sign up</h1>
                  <p className="text-xs-center">
                    <Link to="/Login">Have an account?</Link>
                  </p>
                </>
              )}

              {/* <ul className="error-messages">
                <li>That email is already taken</li>
              </ul> */}
              {error ? (
                <ul className="error-messages">
                  <li>Email or password is invalid.</li>
                </ul>
              ) : (
                <></>
              )}
              <form onSubmit={isLoginScreen ? handleSignIn : handleSignUp}>
                {isLoginScreen ? (
                  <>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </fieldset>
                  </>
                ) : (
                  <>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Your Name"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </fieldset>
                  </>
                )}

                {isLoginScreen ? (
                  <>
                    <button className="btn btn-lg btn-primary pull-xs-right">
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-lg btn-primary pull-xs-right">
                      Sign up
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
