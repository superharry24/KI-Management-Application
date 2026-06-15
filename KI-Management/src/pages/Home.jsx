import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {


    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            userID: user?.id || 0,
            admin: user?.admin || false,
            username: user?.username || ""
        }

    }

    handleSignOut = () => {
        localStorage.removeItem("user");
        this.props.navigate("/login");
    };


    render() {
        return (
        <div>
            <p>You are logged in as: {this.state.username}</p>

            <button onClick={this.handleSignOut}>
            Sign Out
            </button>
        </div>
        );
    }
    }

    // wrapper to inject navigate into class component
    function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
    }

    export default HomeWithNavigate;