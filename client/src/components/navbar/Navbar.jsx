import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Logo from '../../assets/logo.png'

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
         <div style={{display:'flex',alignItems:'center',paddingTop:10,gap:5}}>
         <img src={Logo} width={100}/>
          <span className="logo" >Flytourister</span>
         </div>
        </Link>
        {user ? (
          <div className="navItems">
            {/* <Link
              to={"/book"}
              style={{
                margin: "5px",
                color: "white",
                padding: "5px 5px",
                textDecoration: "none",
                border: "1px solid white",
                borderRadius: "15px",
              }}
            >
              <span>Check your booking list</span>
            </Link> */}
            <span className="username">{user.username}</span>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to={"register"}>
              <button className="navButton">Register</button>{" "}
            </Link>
            <Link to={"login"}>
              <button className="navButton">Login</button>{" "}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
