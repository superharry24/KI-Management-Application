import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import ViewUsersModal from "../modals/Home-Modals/ViewUsersModal";


class Home extends React.Component {


    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            userID: user?.id || 0,
            admin: user?.admin || false,
            username: user?.username || "",
            userModalOpen: false
        }

    }

    handleSignOut = () => {
        localStorage.removeItem("user");
        this.props.navigate("/login");
    };

    componentDidMount() {
    if (this.state.userID === 0) {
        this.props.navigate("/login");
    }
}


    render() {

        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }
        return (
        <div>
            <p>You are logged in as: {this.state.username}</p>

            <button onClick={this.handleSignOut}>
            Sign Out
            </button>

            {this.state.admin &&(
            <button
                    style={{flex: 1, padding: "6px", backgroundColor: "#252525", color: "white",
                        border: "none", borderRadius: "4px"}}
                    onClick={() => this.props.navigate("/signup")}
                >
                                
                Add New User
            
            </button>
            )}
            {this.state.admin &&(
            <button
                    style={{flex: 1, padding: "6px", backgroundColor: "#656464", color: "white",
                        border: "none", borderRadius: "4px"}}
                    onClick={() => this.setState({userModalOpen: true})}
                >
                                
                View Users
            </button>
            )}

            <ViewUsersModal
                    isOpen={this.state.userModalOpen}
                    onClose={() =>
                        this.setState({
                            userModalOpen: false
                        })
                    }
                />
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