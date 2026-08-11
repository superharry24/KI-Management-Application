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
            overlaps: [],

            selected_items: [], //[name, id, small(1) or large(2), amount]
            unselected_items: [], //[name, id, small(1) or large(2)]
            small_items: [],
            large_items: [],
            event_small_items: [],
            event_large_items: [],

            error: ""
        };
    }


    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            const smallItems = this.props.small;
            const largeItems = this.props.large;
            const unselectedItems = [ 
                ...smallItems.map(item => [item[1], item[0], 1]), 
                ...largeItems.map(item => [item[1], item[0], 2])
            ];


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
                overlaps: this.props.overlaps,
                selected_items: [], 
                unselected_items: unselectedItems,
                small_items: smallItems,
                large_items: largeItems,
                event_small_items: this.props.event_small,
                event_large_items: this.props.event_large,
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

    handleItemSelect = (e) => {
        const selectedValue = e.target.value; 
        if (!selectedValue) { return; } 
        this.setState(prevState => {
            const itemIndex = prevState.unselected_items.findIndex(item => `${item[1]}-${item[2]}` === selectedValue );
            if (itemIndex === -1){
                return null;
            }
            const item = prevState.unselected_items[itemIndex]; 
            const selectedItem = [...item, 0]; 
            const newUnselectedItems = [...prevState.unselected_items]; 
            newUnselectedItems.splice(itemIndex, 1); 
            return {
                unselected_items: newUnselectedItems, 
                selected_items: [ ...prevState.selected_items, selectedItem]
            };
        });
    };

    handleItemRemove = (index) => {
        this.setState(prevState => {
            const item = prevState.selected_items[index];

            return {
                selected_items: prevState.selected_items.filter(
                    (_, itemIndex) => itemIndex !== index
                ),
                unselected_items: [...prevState.unselected_items, [item[0], item[1], item[2]]]
            };
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

        for (const [room1, room2] of this.state.overlaps) {
            if (room1 === room) {
                const event = this.checkLinkedTimeAvailable(start, end, room2, date);
                if (event != null) {
                    return event;
                }
            }
            if (room2 === room) {
                const event = this.checkLinkedTimeAvailable(start, end, room1, date);
                if (event != null) {
                    return event;
                }
            }
        }

        return null;
    };

    checkLinkedTimeAvailable = (start, end, room, date) => {
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

            const result  = await response.json();
            console.log("event created:", result);
            const event_id = result.id;
            if(this.state.selected_items.length > 0)
            {
                const response2 = await fetch("http://localhost:5000/events", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        event_id: event_id,
                        items: this.state.selected_items
                    })
                });
                const result2  = await response2.json();
                console.log("event created:", result2);
            }
            
            

        } catch (error) {
            console.log("Add event error:", error);
            throw error;
        }
    };

    
    
  
    handleSubmit = async() => {
        let selectedRoom = [-1];
        if(this.state.selected_room != null)
        {
            selectedRoom = this.state.rooms.find(
                room => room[0] === Number(this.state.selected_room)
            );
        }        
        const {eventName, attendees, start, end, date} = this.state;
        let overlapEvent = this.checkTimeAvailable(start, end, selectedRoom[0], date);
        const item = this.verifyItemAmounts();
        if(eventName == '' || start == null || end == null || date == null || selectedRoom == null)
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
        else if(attendees > selectedRoom[3])
        {
            this.setState({error: "Room does not fit enough people"});
        }
        else if(overlapEvent != null)
        {
            this.setState({error: "Event overlaps with " + overlapEvent[1]})
        }
        else if(item == 1)
        {
            this.setState({error: "Cannot have 0 or less of an item"})
        }
        else if(item == 2)
        {
            this.setState({error: "Room cannot fit that many large items"})
        }
        else if(item != null)
        {
            this.setState({error: "Event is using too many " + item[0] + "s"})
        }
        else
        {
            this.setState({error: null})
            const data = {name: eventName, attendees, start_time: start, end_time: end, date, room: selectedRoom[0]};
            try {await this.addEvent(data);this.props.onClose();
            } catch (e) {this.setState({ error: "Failed to create event" });}
        }
            
    };

    verifyItemAmounts() {
        const newStart = this.timeToMinutes(this.state.start);
        const newEnd = this.timeToMinutes(this.state.end);
        let total_large = 0;
        const selectedRoom = this.state.rooms.find(
            room => room[0] === Number(this.state.selected_room)
        );
        for(const item of this.state.selected_items)
        {
            if(item[3] <= 0)
            {
                return 1;
            }
            let total_amount = 0;
            if(item[2] == 1)
            {                
                for(const count of this.state.event_small_items)
                {
                    const event = this.state.events[this.state.events.findIndex(event => event[0] === count[0])];
                    const eventStart = this.timeToMinutes(event[3]);
                    const eventEnd = this.timeToMinutes(event[4]);
                    if(count[1] == item[1] && newStart < eventEnd && newEnd > eventStart && this.state.date == event[5])
                    {
                        total_amount += count[2];
                    }
                }
                for(const amount of this.state.small_items)
                {
                    if(amount[0] == item[1])
                    {
                        if(amount[2] < total_amount + item[3])
                        {
                            return item;
                        }
                        return null;
                    }
                }
            }
            else if(item[2] == 2)
            {
                total_large += item[3];
                
                if(total_large > selectedRoom[2])
                {
                    return 2;
                }
                for(const count of this.state.event_large_items)
                {
                    const event = this.state.events[this.state.events.findIndex(event => event[0] === count[0])];
                    const eventStart = this.timeToMinutes(event[3]);
                    const eventEnd = this.timeToMinutes(event[4]);
                    if(count[1] == item[1] && newStart < eventEnd && newEnd > eventStart && this.state.date == event[5])
                    {
                        total_amount += count[2]
                    }
                }
                for(const amount of this.state.large_items)
                {
                    if(amount[0] == item[1])
                    {
                        if(amount[2] < total_amount + item[3])
                        {
                            console.log(amount);
                            return item;
                        }
                        return null;
                    }
                }
            }
        }
    }

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

        const selectedRoom = this.state.rooms.find(
            room => room[0] === Number(this.state.selected_room)
        );

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
                                <input type="date" name="date" value={this.state.date}
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

                        <div style={styles.field}> <label style={styles.label}> Add Item: </label> 
                            <select value="" onChange={this.handleItemSelect} style={inputStyle}> 
                                <option value=""> Select Item </option> 
                                {this.state.unselected_items.map( (item) => ( <option key={`${item[1]}-${item[2]}`} 
                                value={`${item[1]}-${item[2]}`} > {item[0]} </option> ) )} 
                            </select>
                        </div>


                        {this.state.selected_items.length !=0 &&(<div style={{display: "flex"}}>
                            <label style={styles.label, {alignItems: "left", flex: 1}}>Item Name</label>
                            <label style={styles.label, {alignItems: "center", flex: 1}}>Amount Needed</label>
                            <label style={styles.label, {alignItems: "right", flex: 1}}>Remove</label>
                        </div>)}

                        <div style={{display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px"}}>
                            {this.state.selected_items.map((item, index) => (
                                <div
                                    key={`${item[1]}-${item[2]}`}
                                    style={{display: "flex", alignItems: "center", justifyContent: "space-between",
                                        backgroundColor: "#444", border: "1px solid #666",
                                        borderRadius: "4px", padding: "8px 10px"}}>
                                    <span style={{ color: "white" }}>
                                        {item[0]}
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        value={item[3]}
                                        onChange={(e) => {
                                            const amount = Number(e.target.value);

                                            this.setState(prevState => ({
                                                selected_items: prevState.selected_items.map(
                                                    (selectedItem, selectedIndex) =>
                                                        selectedIndex === index
                                                            ? [selectedItem[0], selectedItem[1], selectedItem[2], amount]
                                                            : selectedItem
                                                )
                                            }));
                                        }}
                                        style={{width: "60px", backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
                                            borderRadius: "4px", padding: "5px", color: "#333"}}/>
                                            <button
                                                type="button"
                                                onClick={() => this.handleItemRemove(index)}
                                                style={{backgroundColor: "#f44336", color: "white", border: "none",
                                                    borderRadius: "4px", width: "28px", height: "28px", fontSize: "18px",
                                                    fontWeight: "bold", cursor: "pointer", display: "flex",
                                                    alignItems: "center", justifyContent: "center", padding: 0}}>
                                                ×
                                            </button>
                                </div>
                            ))}
                        </div>

                        <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="checkbox" name="show_unavailable_rooms"
                                checked={this.state.show_unavailable_rooms} onChange={this.handleChange}/>
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

                                {availableRooms.map(room => (
                                    <option key={room[0]} value={room[0]}>
                                        {room[1]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {this.state.selected_room && this.state.date && (
                            <div style={{ display: "flex", width: "100%", marginTop: "10px" }}>
                                <div style={{ width: "120px", marginRight: "10px" }}>
                                    {selectedRoom[1]}
                                </div>

                                <div style={{ display: "flex", flex: 1, overflowX: "auto" }}>
                                    {this.state.times.slice(0, -1).map((time, index) => {
                                        const nextTime = this.state.times[index + 1];

                                        const event = this.checkTimeAvailable(time, nextTime, selectedRoom[0], this.state.date);

                                        return (
                                            <div
                                                key={index}
                                                title={`${time} - ${nextTime}`}
                                                style={{flex: 1, height: "30px", width: "40px", minWidth: "40px", border: "1px solid #ccc", backgroundColor: event ? "#f44336" : "#4caf50"
                                                }}/>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedRoom &&(
                            <p>Large Item limit: {selectedRoom[2]}</p>
                        )}
                        

                        
                        
                        

                        
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
    modal: {width: "450px", maxWidth: "90%", maxHeight: "90vh", backgroundColor: "#2f2f2f",
    borderRadius: "8px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    overflowY: "auto", boxSizing: "border-box"},
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