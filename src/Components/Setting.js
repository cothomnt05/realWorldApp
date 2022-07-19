import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../features/authState";

function Setting() {
  const [auth, setAuth] = useRecoilState(authState);
  const [username, setUsername] = useState(auth.user.username);
  const [email, setEmail] = useState(auth.user.email);
  const [password, setPassword] = useState(auth.user.password);
  const [image, setImage] = useState(auth.user.image);
  const [bio, setBio] = useState(auth.user.bio);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    setAuth(null);
    navigate("/Login");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(auth.user.token);
      const res = await axios.put(
        "https://api.realworld.io/api/user",
        {
          user: {
            email: email,
            username: username,
            image: image,
            bio: bio,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem("JWT", JSON.stringify(res.data));
      setAuth(res.data);

      navigate(`/profiles/${res.data.user.username}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <form onSubmit={handleUpdate}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={image || ""}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    value={bio || ""}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button className="btn btn-outline-danger" onClick={handleLogOut}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
