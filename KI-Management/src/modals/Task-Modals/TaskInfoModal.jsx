import React from "react";

class TaskInfoModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTask: null,
            button_pushed: "",
            interval_type: "",
            status_type: "",
            create_date: "",
            complete_date: "",
            repeat_date: ""
            
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen && this.props.task) {
            
            const status = this.props.task[12]
            const interval = this.props.task[4]
            let stat_message = ""
            let interval_message = ""
            if(status == 0)
            {
                stat_message = "Unassigned"
            }
            else if(status == 1)
            {
                stat_message = "Assigned"
            }
            else if(status == 2)
            {
                stat_message = "In Progress"
            }
            else if(status == 3)
            {
                stat_message = "Complete"
            }

            if(interval == 1)
            {
                interval_message = "Days"
            }
            else if(interval == 2)
            {
                interval_message = "Weeks"
            }
            else if(interval == 3)
            {
                interval_message = "Months"
            }
            else if(interval == 4)
            {
                interval_message = "Years"
            }
            else if(interval == 0)
            {
                interval_message = "none"
            }

            const creDate = new Date(this.props.task[6])
            const reDate = new Date(this.props.task[8])
            const comDate = this.props.task[7]
                ? new Date(this.props.task[7])
                : "none"

            let complete = "none"
            if (comDate != "none"){
                complete = comDate.toLocaleDateString("en-US")
            }


            this.setState({
                selectedTask: this.props.task,
                button_pushed: "",
                interval_type: interval_message,
                status_type: stat_message,
                create_date: creDate.toLocaleDateString("en-US"),
                complete_date: complete,
                repeat_date: reDate.toLocaleDateString("en-US"),
            });
            
        }
    }

  

    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "300px"
                }}>

                    <div style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        height: "fit-content"
                    }}>
                        {this.state.selectedTask ? (
                            <div>
                                <h3>{this.state.selectedTask[1]}</h3>

                                <p><b>Category:</b> {this.state.selectedTask[2]}</p>
                                <p><b>Priority:</b> {this.state.selectedTask[3]}</p>
                                {this.state.interval_type != "none" && <div><p><b>Repeats every:</b> {this.state.selectedTask[5]} <b> </b> {this.state.interval_type}</p>
                                <p><b>Resets on : </b> {this.state.repeat_date} </p> </div>}
                                {this.state.interval_type === "none" && <p><b>Single Time Task</b></p>}
                                <p><b>Created On:</b> {this.state.create_date}</p>
                                <p><b>Location:</b> {this.state.selectedTask[10]}</p>
                                <p><b>Status:</b> {this.state.status_type}</p>
                                <p><b>Description:</b> {this.state.selectedTask[9]}</p>
                                {this.state.selectedTask[7] != null && <p><b>Completed On:</b> {this.state.complete_date}</p>}
                            </div>
                        ) : (
                            <p>Task not found</p>
                        )}
                    </div>
                </div>
            
        );
    }
}

const styles = {
    backdrop: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px"
    },
    modal: {
        width: "100%",
        background: "transparent",
        border: "transparent",
        borderRadius: "8px",
        boxShadow: "transparent",
        padding: "12px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "10px"
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        gap: "8px"
    },
    submit: {
        flex: 1,
        background: "#4caf50",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    },
    cancel: {
        flex: 1,
        background: "#f44336",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "2px"
    },
    label: {
        color: "white",
        fontSize: "14px",
        textAlign: "left",
        marginBottom: "2px"
    }


};

const inputStyle = {
    backgroundColor: "#f0f4ff",
    border: "1px solid #4a90e2",
    borderRadius: "4px",
    padding: "6px",
    color: "#333"
};

export default TaskInfoModal;