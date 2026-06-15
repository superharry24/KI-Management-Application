import React from "react";
import { useNavigate } from "react-router-dom";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      password: "",
      admin: false,
      error: ""
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

      this.props.navigate("/login");

    } catch (error) {
      console.log("Add user error:", error);
      this.setState({
        error: "Username already exists"
      });
    }
  };

  render() {
    return (
      <div style={{ maxWidth: "300px", margin: "0 auto" }}>
        <h2>User Sign Up</h2>

        <form
          onSubmit={this.handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Username</label>
            <input
              name="name"
              type="text"
              onChange={this.handleChange}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              onChange={this.handleChange}
            />
          </div>

          {/* Admin checkbox */}
          <div>
            <label>
              <input
                type="checkbox"
                name="admin"
                checked={this.state.admin}
                onChange={this.handleChange}
              />
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