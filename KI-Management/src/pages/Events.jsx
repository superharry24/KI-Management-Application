import React from "react";
import { useNavigate } from "react-router-dom";

class Events extends React.Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            userID: user?.id || 0,
            admin: user?.admin || false,
        }

    }

    render() {
        return (
        <div>
            <p>placeholder</p>

        </div>
        );
    }
}


export default Events;