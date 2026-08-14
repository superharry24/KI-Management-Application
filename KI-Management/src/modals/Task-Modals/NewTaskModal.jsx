import React from "react";
import "../CalendarFixer.css";

class NewTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            taskName: "",
            category: "",
            priority: 0,
            repeat_interval: 0,
            interval_amount: 0,
            first_repeat_date: null,
            description: "",
            location: "",
            image: null,
            error: ""
        };
    }

    handleFileChange = (e) => {
        this.setState({ image: e.target.files[0] });
    };
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                taskName: "",
                category: "",
                priority: 0,
                repeat_interval: 0,
                interval_amount: 0,
                first_repeat_date: null,
                description: "",
                location: "",
                image: null,
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

    addTask = async (taskData) => {

        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const result = await response.json();
            console.log("task created:", result);

        } catch (error) {
            console.log("Add task error:", error);
            throw error;
        }
    };

    

  
    handleSubmit = async() => {
            const {taskName, category, priority, repeat_interval, interval_amount, first_repeat_date, description, location} = this.state;
            if(taskName == '' || category == '' ||(repeat_interval > 0 && (interval_amount == 0 || first_repeat_date == '')) || description == '' || location == '')
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
                const data = {taskName, category, priority, repeat_interval, interval_amount, first_repeat_date, description, location};
                try {
                    await this.addTask(data);
                    this.props.onClose();
                } catch (e) {
                    this.setState({ error: "Failed to create task" });
                }
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Add New Task</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Task Name:</label>
                            <input name="taskName" placeholder="Task Name" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Category:</label>
                            <input name="category" placeholder="Category" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Priority (1 is highest):</label>
                            <input type="number" name="priority" placeholder="0" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Repeat Interval:</label>
                            <select
                                name="repeat_interval"
                                value={this.state.repeat_interval}
                                onChange={this.handleChange}
                                style={{width: "100%", padding: "8px", marginTop: "4px",
                                    backgroundColor: "white", color: "black", border: "1px solid #ccc",
                                    borderRadius: "4px"}}
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
                                <input type="number" name="interval_amount" placeholder="0" onChange={this.handleChange} style={inputStyle} />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>First Repeat Date:</label>
                                <input type="date" name="first_repeat_date"
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
                            <input name="description" placeholder="Description" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Location:</label>
                            <input name="location" placeholder="Location" onChange={this.handleChange} style={inputStyle} />
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
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={this.handleSubmit} style={styles.submit}>
                            Submit
                        </button>                        
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    backdrop: {width: "100%", display: "flex", justifyContent: "center", marginTop: "10px"},
    modal: {width: "100%", background: "transparent", border: "transparent",
        borderRadius: "8px", boxShadow: "transparent", padding: "12px"},
    form: {display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px"},
    actions: {display: "flex", justifyContent: "space-between", gap: "8px"},
    submit: {flex: 1, background: "#4caf50", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    cancel: {flex: 1, background: "#f44336", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    field: {display: "flex", flexDirection: "column", gap: "2px"},
    label: {color: "white", fontSize: "14px", textAlign: "left", marginBottom: "2px"}
};

const inputStyle = {backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
    borderRadius: "4px", padding: "6px", color: "#333"};


export default NewTaskModal;