import React from "react";
//Entry order in log get in management.py
class ViewUsersModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: []
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
                userList: []
            });
            this.fetchData()
        }
    }


    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div
                style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999}}
            >
                <div
                    style={{width: "800px", maxWidth: "90vw", height: "700px", backgroundColor: "white", borderRadius: "12px",
                        padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column"}}
                >
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Current Active Users
                    </h2>

                    <div
                        style={{flex: 1, overflowY: "auto", marginBottom: "20px"}}
                    >
                        {/*Headers */}
                        <div
                            style={{display: "flex", justifyContent: "space-between", fontWeight: "bold",
                                padding: "10px 0", borderBottom: "2px solid #ccc", marginBottom: "5px"}}
                        >
                            <div>Username</div>
                            <div>Last Login</div>
                        </div>
                        {/*List */}
                        {this.state.userList.map((user) => (
                            <div
                                key={user[0]}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center",
                                    borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div>
                                    {user[1]}
                                    {user[2] && (
                                        <span
                                            style={{marginLeft: "10px", color: "#dc3545", fontWeight: "bold"}}
                                        >
                                            ADMIN
                                        </span>
                                    )}
                                </div>

                                <div>
                                    {user[3]
                                        ? new Date(user[3]).toLocaleString()
                                        : "Never"}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{display: "flex", justifyContent: "flex-end", gap: "10px"}}
                    >

                        <button
                            onClick={this.props.onClose}
                            style={{backgroundColor: "#dc3545", color: "white", border: "none",
                                padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                        >
                            Close
                        </button>
                    </div>
                </div>

                

                 
            </div>
           
                 
            

        )
    }
}


export default ViewUsersModal;