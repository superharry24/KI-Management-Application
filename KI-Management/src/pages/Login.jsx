import React from "react";
import { useNavigate } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        name: "",
        password: "",
        error: ""
        };
    }

    handleChange = (e) => {
        this.setState({
        [e.target.name]: e.target.value
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch(
            `http://localhost:5000/user?name=${this.state.name}&password=${this.state.password}`
        );

        const data = await response.json();

        if (data && data.id) {
            // success → go to home
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.id,
                    username: this.state.name,
                    admin: data.admin
                })
            );
            this.props.navigate("/");
        } else {
            // failure
            this.setState({
            error: "Log in failed, please try again"
            });
        }
        } catch (err) {
        this.setState({
            error: "Log in failed, please try again"
        });
        }
    };

  render() {
    return (
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            <h2>Login</h2>

            <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
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

            {/* Button */}
            <button type="submit">Log In</button>
            </form>

            {this.state.error && (
            <p style={{ color: "red" }}>{this.state.error}</p>
            )}
        </div>
        );
  }
}

// wrapper to use navigate in class component
function LoginWithNav(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

export default LoginWithNav;