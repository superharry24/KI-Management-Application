import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import NewTaskModal from "../modals/Task-Modals/NewTaskModal";
import TaskInfoModal from "../modals/Task-Modals/TaskInfoModal";
import EditTaskModal from "../modals/Task-Modals/EditTaskModal";
import AssignStaffModal from "../modals/Task-Modals/AssignStaffModal";
import ViewAssignedStaff from "../modals/Task-Modals/ViewAssignedStaff";
import ChangeStatusModal from "../modals/Task-Modals/ChangeStatusModal";


class Tasks extends React.Component {

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));
        
        this.state = {

            userID: user?.id || 0,
            admin: user?.admin || false,
            tasks: [],
            staff_assign: [],
            item_assign: [],
            selected_task: null,
            OpenModal: "none"
        }

    
    }

    refreshSelectedTask = async () => {
    await this.fetchData();

    this.setState(prev => ({
        selected_task:
            prev.tasks.find(
                t => t[0] === prev.selected_task?.[0]
            ) || null,
        OpenModal: "info"
    }));
};
    

    componentDidMount() {
        this.fetchData();
    }


    fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/tasks");
            const data = await response.json();

            this.setState({
                tasks: data.tasks || [],
                staff_assign: data.staff_assign || [],
                item_assign: data.item_assign || []
            });
            

        } catch (error) {
            console.log(error);
        }
    };


    

    render() {
        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }

        return (
            <div
                style={{
                    display: "flex",
                    height: "100vh"
                }}
            >
                {/* Left Task List */}
                <div
                    style={{
                        width: "33%",
                        borderRight: "1px solid #ddd",
                        overflowY: "auto",
                        padding: "15px",
                        boxSizing: "border-box"
                    }}
                    
                >
                    <button
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                            cursor: "pointer",
                            backgroundColor: "#8c8c8c",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            boxSizing: "border-box"
                        }}
                        onClick={() => this.setState({ OpenModal: "sort" })}
                    >
                        Sort Tasks
                    </button>
                    {this.state.tasks.map((task) => (
                        <div
                            key={task[0]}
                                onClick={() => {
                                    const isSameTask = this.state.selected_task?.[0] === task?.[0];

                                    if (isSameTask) {
                                        this.setState({
                                            selected_task: null,
                                            OpenModal: "none"
                                        });
                                    } else {
                                        this.setState({
                                            selected_task: task,
                                            OpenModal: "none"
                                        }, () => {//Updates data for new info panel
                                            this.setState({ OpenModal: "info" });
                                        });
                                    }
                                }}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 18px",
                                marginBottom: "12px",
                                borderRadius: "15px",
                                backgroundColor: this.state.selected_task?.[0] === task[0] ? "#e8ddff" : "#f5f5f5",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                cursor: "pointer"
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "600"
                                }}
                            >
                                {task[1]}
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <span
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    {["Unassigned", "Assigned", "In Progress", "Complete"][task[12]]}
                                </span>

                                <div
                                    style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        backgroundColor: this.state.staff_assign.some(
                                            assignment =>
                                                assignment[0] === task[0] &&
                                                assignment[1] === this.state.userID
                                        )
                                            ? "#22c55e" // green when assigned
                                            : "#ffffff", // white otherwise
                                        border: "1px solid #bbb"
                                    }}
                                />
                            </div>
                                
                            
                        </div>
                    ))}
                </div>

                {/* Right Side Content */}
                <div
                    style={{
                        flex: 1,
                        padding: "20px"
                    }}
                    >{this.state.selected_task === null && this.state.OpenModal === "none" &&(
                    <div>
                        <h2>Task Details</h2>
                    
                        <p>Select a task from the list.</p>
                        {this.state.admin &&(
                            <button
                                disabled={!this.state.admin}
                                style={{flex: 1, padding: "6px", backgroundColor: this.state.admin ? "#673ab7" : "#ccc",
                                    color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}
                                onClick={() => this.setState({ OpenModal: "add" })}
                            >
                                Add new Task
                            </button>
                        )}</div>
                    )}

                    <NewTaskModal
                        isOpen={this.state.OpenModal === "add"}
                        onClose={() => {
                            this.setState({ OpenModal: "none" });
                            this.fetchData();
                        }}
                    />
                    <TaskInfoModal
                        isOpen={this.state.OpenModal === "info"}
                        task={this.state.selected_task}
                        onClose={() => {
                            this.setState({ OpenModal: "none" });
                        }}
                    />
                    <EditTaskModal
                        isOpen={this.state.OpenModal === "edit"}
                        task={this.state.selected_task}
                        onClose={() => {this.refreshSelectedTask()}}
                        onSubmit={() => {
                            this.fetchData().then(() => {
                                // fix current task
                                this.setState((prevState) => {
                                    const updatedTask = prevState.tasks.find(
                                        t => t[0] === prevState.selected_task?.[0]
                                    );

                                    return {
                                        selected_task: null,
                                        OpenModal: "none"
                                    };
                                });
                            });
                        }}
                    />
                    <AssignStaffModal
                        isOpen={this.state.OpenModal === "assign"}
                        task={this.state.selected_task?.[0]}
                        onClose={() => {this.refreshSelectedTask()}}
                    />
                    <ViewAssignedStaff
                        isOpen={this.state.OpenModal === "view"}
                        task={this.state.selected_task?.[0]}
                        onClose={() => {this.refreshSelectedTask()}}
                    />
                    <ChangeStatusModal
                        isOpen={this.state.OpenModal === "status"}
                        task={this.state.selected_task}
                        onClose={() => {this.refreshSelectedTask()}}
                    />



                    {this.state.selected_task != null && this.state.OpenModal === "info" &&(
                        <div>
                            {this.state.admin &&(
                                <div>
                                    <button
                                        style={{flex: 1, padding: "6px", cursor:"pointer", backgroundColor:"#00ff1a",
                                            color: "white", border: "none", borderRadius: "4px"}}
                                        onClick={() => this.setState({ OpenModal: "edit" })}
                                    >
                                        Edit Task Info
                                    </button>
                                    <button
                                        style={{flex: 1, padding: "6px", cursor:"pointer", backgroundColor:"#ffc400",
                                            color: "white", border: "none", borderRadius: "4px"}}
                                        onClick={() => this.setState({ OpenModal: "assign" })}
                                    >
                                        Assign Staff
                                    </button>
                                    <button
                                        style={{flex: 1, padding: "6px", cursor:"pointer", backgroundColor:"#eeff00",
                                            color: "white", border: "none", borderRadius: "4px"}}
                                        onClick={() => this.setState({ OpenModal: "view" })}
                                    >
                                        View Staff
                                    </button>
                                </div>  
                                                    
                            )}
                            {this.state.staff_assign.some(
                                assignment =>
                                    assignment[0] === this.state.selected_task[0] &&
                                    assignment[1] === this.state.userID
                            )  &&(
                                <button
                                        style={{flex: 1, padding: "6px", cursor: "pointer", backgroundColor:"#1100ff",
                                            color: "white", border: "none", borderRadius: "4px"}}
                                        onClick={() => this.setState({ OpenModal: "status" })}
                                    >
                                        Change Status
                                </button>
                            )}





                        </div>
                    )}
                    
                </div>
            </div>
        );
    }
}


    export default Tasks;