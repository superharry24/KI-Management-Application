import React from "react";
import ConfirmPopup from "../ConfirmPopup";
import { json } from "react-router-dom";
class ViewAssignedStaff extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assignedUserList: [],
            task_id: 0,
            error: "",
            confirm: false,
            selectedUser: null
        };
    }

    fetchData = async (task_id) => {
        try {
            // Get assignments
            const assignmentResponse = await fetch("http://localhost:5000/task");
            const assignList = await assignmentResponse.json();
            // Get users
            const userResponse = await fetch("http://localhost:5000/user?all=true");
            const fullUserList = await userResponse.json();

            const assignedUserList = fullUserList.filter(user =>
                assignList.some(
                    assignment =>
                        assignment[0] === task_id &&
                        assignment[1] === user[0]
                )
            );

            this.setState({
                assignedUserList
            });
        } catch (error) {
            console.log("Fetch exception:", error);
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({    
                assignedUserList: [],
                task_id: this.props.task,
                error: "",
                confirm: false,
                selectedUser: null
            });
            this.fetchData(this.props.task)
            

        }
    }


    unassign = async () => {
        

        await fetch("http://localhost:5000/task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: this.state.selectedUser[0],
                task_id: this.state.task_id
            })
        });
        await this.fetchData(this.state.task_id);
        
    };


    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999
                }}
            >
                <div
                    style={{
                        
                        width: "800px",
                        maxWidth: "90vw",
                        height: "700px",
                        maxHeight: "90vh",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Users
                    </h2>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            marginBottom: "20px"
                        }}
                    >
                        {/*Headers */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: "bold",
                                padding: "10px 0",
                                borderBottom: "2px solid #ccc",
                                marginBottom: "5px"
                            }}
                        >
                            <div>Username</div>
                        </div>
                        {/*List */}
                        {this.state.assignedUserList.map((user) => (
                            <div
                                key={user[0]}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px 0"
                                }}
                            >
                                <div>
                                    {user[1]}                                    
                                </div>

                                <div>
                                    <button
                                        onClick={() => this.setState({confirm: true, selectedUser: user})}
                                        style={{
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Unassign
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}
                    >
                        {this.state.error && (
                            <div style={{ color: "red", marginBottom: "8px" }}>
                                {this.state.error}
                            </div>
                        )}


                        <button
                            onClick={this.props.onClose}
                            style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>

                <ConfirmPopup
                    isOpen={this.state.confirm}
                    onSubmit={async () => {await this.unassign()}}
                    header= "Unassign User?"
                    message={`Are you sure you want to unassign "${this.state.selectedUser?.[1] || "ERROR"}" from this task?`}
                    onClose={() => this.setState({ confirm: false })}
                />

                 
            </div>
           
                 
            

        )
    }
}

const styles = {



};



export default ViewAssignedStaff;