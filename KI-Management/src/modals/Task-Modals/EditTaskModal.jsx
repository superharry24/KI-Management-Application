import React from "react";
import "./CalendarFixer.css";
import ConfirmPopup from "../ConfirmPopup";

class EditTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            taskName: "",
            category: "",
            priority: 0,
            repeat_interval: 0,
            interval_amount: 0,
            first_repeat_date: null,
            description: "",
            location: "",
            image: null,
            deleting: false,
            error: ""
        };
    }

    handleFileChange = (e) => {
        this.setState({ image: e.target.files[0] });
    };
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen && this.props.task) {
            this.setState({
                id: this.props.task[0],
                taskName: this.props.task[1],
                category: this.props.task[2],
                priority: this.props.task[3],
                repeat_interval: this.props.task[4],
                interval_amount: this.props.task[5],
                first_repeat_date: this.props.task[8],
                description: this.props.task[9],
                location: this.props.task[10],
                image: this.props.task[11],
                deleting: false,
                error: ""
            });
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]:
                name === "priority" ||
                name === "repeat_interval" ||
                name === "interval_amount"
                    ? Number(value)
                    : value
        });
    };

    deleteTask = async() => {
        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task_id: this.state.id,
                    type: 3
                })
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            const result = await response.json();
            console.log("task deleted:", result);

        } catch (error) {
            console.log("Delele task error:", error);
            throw error;
        }
        
    }

    editTask = async (taskData) => {
        

        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error("Failed to edit task");
            }

            const result = await response.json();
            console.log("task edit:", result);

        } catch (error) {
            console.log("Edit task error:", error);
            throw error;
        }

        this.props.onClose();
    };



    

  
    handleSubmit = async() => {
            const {id, taskName, category, priority, repeat_interval, interval_amount, first_repeat_date, description, location} = this.state;
            if(taskName == '' || category == '' ||(repeat_interval > 0 && interval_amount == 0) || description == '' || location == '')
            {
                this.setState({
                    error: "Empty Field Detected"
                });
            }
            else if(priority <= 0)
            {
                this.setState({
                    error: "Priority Should Be Greater Than 0"
                });
            }
            else if(interval_amount <= 0 && repeat_interval > 0)
            {
                this.setState({
                    error: "Length of Interval Should Be Greater Than 0"
                });
            }
            else
            {
                const data = {task_id: id, name: taskName, category, priority, repeat_interval, interval_amount, first_repeat_date, description, location, type: 2};
                try {
                    await this.editTask(data);
                    this.props.onClose();
                } catch (e) {
                    this.setState({ error: "Failed to edit task" });
                }
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Edit Task</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Task Name:</label>
                            <input name="taskName" placeholder="Task Name" value={this.state.taskName} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Category:</label>
                            <input name="category" placeholder="Category" value={this.state.category} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Priority (1 is highest):</label>
                            <input type="number" name="priority" placeholder="0" value={this.state.priority} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Repeat Interval:</label>
                            <select
                                name="repeat_interval"
                                value={this.state.repeat_interval}
                                onChange={this.handleChange}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginTop: "4px",
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}
                                >
                                <option value={Number(0)}>Never</option>
                                <option value={Number(1)}>Daily</option>
                                <option value={Number(2)}>Weekly</option>
                                <option value={Number(3)}>Monthly</option>
                                <option value={Number(4)}>Yearly</option>
                            </select>
                        </div>
                        {this.state.repeat_interval != 0 &&(
                        <div>
                            <div style={styles.field}>
                                <label style = {styles.label}>Length of Interval:</label>
                                <input type="number" name="interval_amount" placeholder="0" value={this.state.interval_amount} onChange={this.handleChange} style={inputStyle} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Next Repeat Date:</label>
                                <input
                                    type="date"
                                    name="first_repeat_date"
                                    value={this.state.first_repeat_date}
                                    onChange={this.handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    style={inputStyle}
                                    className="date-input"
                                    onKeyDown={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>)}
                        <div style={styles.field}>
                            <label style = {styles.label}>Description:</label>
                            <input name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Location:</label>
                            <input name="location" placeholder="Location" value={this.state.location} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        {/* <div style={styles.field}>
                            <label style={styles.label}>Task Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={this.handleFileChange}
                                style={inputStyle}
                            />
                        </div> */}
                        
                        

                        
                    </div>

                    {this.state.error && (
                        <div style={{ color: "red", marginBottom: "8px" }}>
                            {this.state.error}
                        </div>
                    )}
                    <div style={styles.actions}>
                        <button onClick={() => this.setState({ deleting: true })} style={styles.delete}>
                            Delete
                        </button>    

                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={this.handleSubmit} style={styles.submit}>
                            Submit
                        </button>                        
                    </div>
                </div>
                <ConfirmPopup
                    isOpen={this.state.deleting}
                    onClose={async () => {
                                await this.deleteTask;
                                this.props.onSubmit();
                            }}
                    header= "Delete Task?"
                    message= "Are you sure you want to delete this task? (This action cannot be undone)"
                    onSubmit={this.deleteTask}
                />
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
        background: "#000000",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    },
    delete: {
        flex: 1,
        background: "#ff0000",
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

export default EditTaskModal;