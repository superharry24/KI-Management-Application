//Button on main event page. Select time and attendees, shows rooms with available slots (Can toggle to show unavailable rooms).
//Select needed items 

import React from "react";
import "../CalendarFixer.css";

class NewEventModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventName: "",
            attendees: 0,
            start: null,
            end: null,
            date: null,
            rooms: [],
            selected_room: null,
            show_unavailable_rooms: false,
            times: [],
            events: [],
            error: ""
        };
    }


    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                eventName: "",
                attendees: 0,
                start: null,
                end: null,
                date: null,
                rooms: this.props.rooms,
                selected_room: null,
                show_unavailable_rooms: false,
                times: this.props.times,
                events: this.props.events,
                error: ""
            });
        }
    }

    timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
            hours += 12;
        }
        if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        this.setState({
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "attendees"
                    ? Number(value)
                    : value
        });
    };

    checkTimeAvailable = (start, end, room, date) => {
        if (!start || !end) {
            return null;
        }

        const newStart = this.timeToMinutes(start);
        const newEnd = this.timeToMinutes(end);

        for (const event of this.state.events) {
            if (event[6] !== room || event[5] !== date) continue;

            const eventStart = this.timeToMinutes(event[3]);
            const eventEnd = this.timeToMinutes(event[4]);

            if (newStart < eventEnd && newEnd > eventStart) {
                return event;
            }
        }

        return null;
    };

    addEvent = async (taskData) => {

        try {
            const response = await fetch("http://localhost:5000/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error("Failed to create event");
            }

            const result = await response.json();
            console.log("event created:", result);

        } catch (error) {
            console.log("Add event error:", error);
            throw error;
        }
    };

    

  
    handleSubmit = async() => {
            const {eventName, attendees, start, end, date, selected_room} = this.state;
            let overlapEvent = this.checkTimeAvailable(start, end, selected_room[0], date);
            if(eventName == '' || start == null || end == null || date == null || selected_room == null)
            {
                this.setState({error: "Empty Field Detected"});
            }
            else if(attendees <= 0)
            {
                this.setState({error: "Event requires at least one person attending"});
            }
            else if(this.timeToMinutes(end) < this.timeToMinutes(start)) 
            {
                this.setState({error: "Event must start before it ends"});
            }
            else if(attendees > this.state.selected_room[3])
            {
                this.setState({error: "Room does not fit enough people."});
            }
            else if(overlapEvent != null)
            {
                this.setState({error: "Event overlaps with "+ overlapEvent[1]})
            }
            else
            {
                const data = {name: eventName, attendees, start_time: start, end_time: end, date, room: selected_room[0]};
                try {await this.addEvent(data);this.props.onClose();
                } catch (e) {this.setState({ error: "Failed to create event" });}
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        //used for the room dropdown menu
        const availableRooms = this.state.rooms.filter(room => {
            if (!this.state.start || !this.state.end || this.state.show_unavailable_rooms) {
                return true;
            }

            return (
                this.checkTimeAvailable(this.state.start, this.state.end, room[0], this.state.date) == null && 
                this.state.attendees <= room[3]
            );
        });

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Add New Event</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Event Name:</label>
                            <input name="eventName" placeholder="Event Name" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Number of People Attending:</label>
                            <input type="number" name="attendees" placeholder="0" onChange={this.handleChange} style={inputStyle} />
                        </div>

                        
                        <div style={styles.field}>
                                <label style={styles.label}>Date:</label>
                                <input type="date" name="date" value={this.state.first_repeat_date}
                                    onChange={this.handleChange} min={new Date().toISOString().split("T")[0]}
                                    style={inputStyle} className="date-input"
                                    onKeyDown={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()}/>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Start Time:</label>
                            <select name="start" value={this.state.start || ""}
                                onChange={this.handleChange} style={inputStyle}>
                                <option value="">Select Start Time</option>
                                {this.state.times.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>End Time:</label>
                            <select name="end" value={this.state.end || ""}
                                onChange={this.handleChange} style={inputStyle}>
                                <option value="">Select End Time</option>
                                {this.state.times.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="show_unavailable_rooms"
                                checked={this.state.show_unavailable_rooms}
                                onChange={this.handleChange}
                            />
                            Show unavailable rooms
                        </label>
                        
                        <div style={styles.field}>
                            <label style={styles.label}>Room:</label>
                            <select
                                name="selected_room"
                                value={this.state.selected_room || ""}
                                onChange={this.handleChange}
                                style={inputStyle}
                            >
                                <option value="">Select Room</option>

                                {availableRooms.map((room) => (
                                    <option key={room[0]} value={room}>
                                        {room[1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        

                        
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
    backdrop: {position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center",
        alignItems: "center", zIndex: 1000},
    modal: {width: "450px", maxWidth: "90%", backgroundColor: "#2f2f2f", borderRadius: "8px",
        padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"},
    form: {display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px"},
    actions: {display: "flex", justifyContent: "space-between", gap: "8px"},
    submit: {flex: 1, background: "#4caf50", color: "white", border: "none", padding: "6px", borderRadius: "4px",
        cursor: "pointer"},
    cancel: {flex: 1, background: "#f44336", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    field: {display: "flex", flexDirection: "column", gap: "2px"},
    label: {color: "white", fontSize: "14px", textAlign: "left", marginBottom: "2px"}
    


};

const inputStyle = {backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
    borderRadius: "4px", padding: "6px", color: "#333"};



export default NewEventModal;