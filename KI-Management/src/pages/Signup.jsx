import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      name: "",
      password: "",
      admin: false,
      error: "",
      curAdmin: user?.admin || true
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    this.setState({
      [name]: type === "checkbox" ? checked : value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.name.includes("\n") || this.state.name.includes("\t")){
        this.setState({
            error: "Username cannot include tabs or newlines"
        });
        return;
    }

    if (this.state.name.endsWith(" ") || this.state.name.startsWith(" ")){
        this.setState({
            error: "Username cannot start or end with a space"
        });
        return;
    }
    

    const userData = {
      name: this.state.name,
      password: this.state.password,
      admin: this.state.admin
    };

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        this.setState({
          error: "Username already exists"
        });
        return;
      }

      const result = await response.json();
      console.log("User added:", result);

      this.props.navigate("/");

    } catch (error) {
      console.log("Add user error:", error);
      this.setState({
        error: "Username already exists"
      });
    }
  };

  render() {
    //Boot user back to log in if not loged in after testing. Remove to create first admin after launch, then add back in
    if (this.state.userID === 0) {
                return <Navigate to="/login" replace />;
            }
    if (!this.state.curAdmin) {
        return (
        <div style={{ color: "red", padding: "20px" }}>
            Error: You must be an administrator to access this page.
        </div>
        );
    }


    return (        
      <div style={{ maxWidth: "300px", margin: "0 auto" }}>
        <h2>New User Sign Up</h2>

        <form
          onSubmit={this.handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Username</label>
            <input name="name" type="text" onChange={this.handleChange}/>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Password</label>
            <input name="password" type="password" onChange={this.handleChange}/>
          </div>

          {/* Admin checkbox */}
          <div>
            <label>
              <input type="checkbox" name="admin" checked={this.state.admin} onChange={this.handleChange}/>
              Is Admin?
            </label>
          </div>

          <button type="submit">Make Account</button>
        </form>

        {this.state.error && (
          <p style={{ color: "red" }}>{this.state.error}</p>
        )}
      </div>
    );
  }
}

// wrapper for navigate in class component
function SignupWithNav(props) {
  const navigate = useNavigate();
  return <Signup {...props} navigate={navigate} />;
}

export default SignupWithNav;