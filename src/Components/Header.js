import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../features/authState";

function Header() {
  const auth = useRecoilValue(authState);

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link to="/" className="navbar-brand">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {auth ? (
              <>
                <li className="nav-item">
                  <Link to="/Editor" className="nav-link">
                    <i className="ion-compose"></i>&nbsp;New Article
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Setting" className="nav-link">
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={`/Profiles/${auth.user.username}`}
                    className="nav-link"
                  >
                    {auth.user.username}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/Login" className="nav-link">
                    Sign in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Register" className="nav-link">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;
