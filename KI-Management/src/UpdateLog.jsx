import React from "react";

class UpdateLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            updateList: [],
            sortCategory: "",
            sortDirection: "",
            sortText: "",
            sortID: ""
        };
    }

    fetchData = () => {
        fetch("http://localhost:5000/updateLog")
            .then((response) => response.json())
            .then((jsonOutput) => {
                this.setState({
                    updateList: jsonOutput
                });
            })
            .catch((error) => {
                console.log("Fetch exception:", error);
            });
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.fetchData()
        }
    }





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
                        Update Log
                    </h2>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            marginBottom: "20px"
                        }}
                    >
                        {this.state.updateList.map((log) => (
                            <div
                                key={log[0]}
                                style={{
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px 0"
                                }}
                            >
                                <div style={{ color: "#000" }}>
                                    <strong>{log[4]}</strong>
                                    {" "}
                                    {log[6]
                                        ? "deleted"
                                        : log[7]
                                        ? "edited"
                                        : (log[5] > 0)
                                        ? "added stock to"
                                        : (log[5] < 0)
                                        ? "removed stock from"
                                        : "error"}
                                    {" "}
                                    <strong>{log[2]}</strong>
                                </div>

                                {!(log[6] || log[7])  && (
                                    <div style={{ color: "#000" }}>
                                        Change Amount: {log[5]}
                                    </div>
                                )}

                                <div
                                    style={{
                                        color: "#666",
                                        fontSize: "12px",
                                        marginTop: "4px"
                                    }}
                                >
                                    {new Date(log[8]).toLocaleString()}
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
                        <button onClick={() => {}}>
                            Sort
                        </button>

                        <button onClick={() => {}}>
                            Export
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



export default UpdateLog;