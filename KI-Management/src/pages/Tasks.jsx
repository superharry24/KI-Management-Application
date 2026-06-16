import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

class Tasks extends React.Component {

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));

        this.state = {

            userID: user?.id || 0,
            admin: user?.admin || false
        }

    
    }
    render() {
        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }
        return (
        <div>
            <p>placeholder</p>

        </div>
        );
    }
    }


    export default Tasks;