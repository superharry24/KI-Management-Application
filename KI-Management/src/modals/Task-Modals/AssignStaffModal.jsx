import React from "react";
class AssignStaffModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: [],
            selected_users: [],
            task_id: 0,
            error: ""
        };
    }

    fetchData = () => {
        fetch("http://localhost:5000/user?all=true")
            .then((response) => response.json())
            .then((jsonOutput) => {
                this.setState({
                    userList: jsonOutput
                })
            })
            .catch((error) => {
                console.log("Fetch exception:", error);
            });
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({    
                userList: [],
                selected_users: [],
                task_id: this.props.task,
                error: ""
            });
            this.fetchData()
        }
    }

    toggleUser = (userId) => {
        this.setState((prevState) => {
            const alreadySelected = prevState.selected_users.includes(userId);

            return {
                selected_users: alreadySelected
                    ? prevState.selected_users.filter((id) => id !== userId)
                    : [...prevState.selected_users, userId]
            };
        });
    };

    assign = async () => {
        if(this.state.selected_users.length == 0)
        {
            this.setState({
                error: "Please select at least one user"
            });
        }
        else
        {

            await fetch("http://localhost:5000/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    users: this.state.selected_users,
                    task_id: this.state.task_id
                })
            });
            this.props.onClose();
        }
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
                            <div>Assign</div>
                        </div>
                        {/*List */}
                        {this.state.userList.map((user) => (
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
                                    <input
                                        type="checkbox"
                                        checked={this.state.selected_users.includes(user[0])}
                                        onChange={() => this.toggleUser(user[0])}
                                    />
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
                            onClick={this.assign}
                            style={{
                                backgroundColor: "#38dc35",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Assign
                        </button>

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

                

                 
            </div>
           
                 
            

        )
    }
}

const styles = {



};



export default AssignStaffModal;