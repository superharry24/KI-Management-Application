import React from "react";
import SortLogModal from "./SortLogModal";
//Entry order in log get in management.py
class UpdateLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            updateList: [],
            originalList: [],
            sortType: "",
            startDate: "",
            endDate: "",
            sortID: -1,
            openModal: "none",
        };
    }

    fetchData = () => {
        fetch("http://localhost:5000/updateLog")
            .then((response) => response.json())
            .then((jsonOutput) => {
                this.setState({
                    updateList: jsonOutput,
                    originalList: jsonOutput
                },
                () => {
                    this.sortAndFilterLogs();
                });
            })
            .catch((error) => {
                console.log("Fetch exception:", error);
            });
    };

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({
                sortType: "",
                startDate: "",
                endDate: "",
                sortID: -1,
                updateList: [],     
                originalList: []
            });
            this.fetchData()
        }
    }

    getLogType = (log) => {
        if (log[6]) return "deleting";
        if (log[7]) return "editing";
        if (log[9]) return "creating";
        if (log[5] > 0) return "adding";
        if (log[5] < 0) return "removing";
        return "unknown";
    };

    sortAndFilterLogs = () => {
    const { originalList, sortType, startDate, endDate, sortID } = this.state;

    let result = [...originalList];

    // ---------- FILTER BY ID ----------
    if (sortID !== -1 && sortID !== "") {
        result = result.filter(log => Number(log[1]) === Number(sortID));
    }

    // ---------- FILTER BY DATE ----------
    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        result = result.filter(log => new Date(log[8]) >= start);
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // 👈 FIX
        result = result.filter(log => new Date(log[8]) <= end);
    }

    // ---------- FILTER BY TYPE ----------
    if (sortType && sortType !== "any") {
        result = result.filter(log => this.getLogType(log) === sortType.toLowerCase());
    }

    // ---------- DEFAULT SORT (newest first) ----------
    result.sort((a, b) => new Date(b[8]) - new Date(a[8]));

    this.setState({ updateList: result });
};


    render() {
        if (!this.props.isOpen) return null;

        return (
            <div
                style={{position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999}}
            >
                <div
                    style={{width: "800px", maxWidth: "90vw", height: "700px", maxHeight: "90vh",
                        backgroundColor: "white", borderRadius: "12px", padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column"}}
                >
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Update Log
                    </h2>

                    <div
                        style={{flex: 1, overflowY: "auto", marginBottom: "20px"}}
                    >
                        {this.state.updateList.map((log) => (
                            <div
                                key={log[0]}
                                style={{borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div style={{ color: "#000" }}>
                                    <strong>{log[4]}</strong>
                                    {" "}
                                    {log[6]                                        
                                        ? "deleted"
                                        : log[7]
                                        ? "edited"
                                        : log[9]
                                        ? "created"
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
                                    style={{color: "#666", fontSize: "12px", marginTop: "4px"}}
                                >
                                    {new Date(log[8]).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{display: "flex", justifyContent: "flex-end", gap: "10px"}}
                    >
                        <button onClick={() =>
                            this.setState({
                                openModal: "sort"
                            })
                        }>
                            Sort
                        </button>


                        <button
                            onClick={this.props.onClose}
                            style={{backgroundColor: "#dc3545", color: "white", border: "none",
                                padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                        >
                            Close
                        </button>
                    </div>
                </div>

                 <SortLogModal
                            isOpen={this.state.openModal == "sort"}
                            onClose={() =>
                                this.setState({
                                    openModal: "none",
                                    sortType: "",
                                    sortID: -1,
                                    startDate: "",
                                    endDate: ""
                                })
                            }
                            onSubmit={(data) => {
                                this.setState(
                                    {
                                        sortType: data.type,
                                        sortID: data.ID,
                                        endDate: data.endDate,
                                        startDate: data.startDate,
                                        openModal: "none"
                                    },
                                    () => {
                                        this.sortAndFilterLogs()
                                    }
                                );
                            }}
                        />
            </div>
           
                 
            

        )
    }
}


export default UpdateLog;