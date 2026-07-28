import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import RoomManagementModal from "../modals/Event-Modals/RoomManagementModal";
import ItemManagementModal from "../modals/Event-Modals/ItemManagementModal";
import NewEventModal from "../modals/Event-Modals/NewEventModal";

class Events extends React.Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));
        this.dateInput = React.createRef();

        this.state = {
            userID: user?.id || 0,
            admin: user?.admin || false,

            //event info
            events: [],
            rooms: [],
            overlaps: [],
            largeI: [],
            smallI: [],
            largeE: [],
            smallE: [],

            curDate: null,
            viewDate: null,
            curEvents: [],
            times:["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
                "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM","2:30 PM",  "3:00 PM", "3:30 PM",
                "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
            ],
            selectedRoom: null,

            openModal: "none"
        }

    }

    componentDidMount() {
        this.fetchData();
        this.fetchDayEvents();
    }

    fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/events");
            const data = await response.json();

            const today = new Date().toISOString().split("T")[0];

            this.setState({
                events: data.events || [],
                rooms: data.rooms || [],
                overlaps: data.overlaps || [],
                largeI: data.large || [],
                smallI: data.small || [],
                largeE: data.large_assign || [],
                smallE: data.small_assign || [],
                curDate: today,
                viewDate: today,
                openModal: "none",
                selectedRoom: null,
                
            });
            
            return data.events;

        } catch (error) {
            console.log(error);
            return[];
        }
    };

    fetchDayEvents = async (date) => {
        try {
            const response = await fetch(`http://localhost:5000/events?date=${encodeURIComponent(date)}`);

            const data = await response.json();

            this.setState({
                curEvents: data.events || [],
            });

        } catch (error) {
            console.log(error);
        }
    };

    checkTimeAvailable = (time, room, date) =>
    {
        const minTime = this.timeToMinutes(time)
        for(const event of this.state.curEvents)
        {
            if(event[6] == room && date == event[5])
            {
                if(minTime >= this.timeToMinutes(event[3]) && minTime < this.timeToMinutes(event[4]))
                {
                    return event;
                }
            }
        }
        return null;
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

    render() {
        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }

        const displayedRooms =
        this.state.selectedRoom === null
            ? this.state.rooms
            : [this.state.rooms[this.state.selectedRoom]];
            
        return (
            
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px"}}>
                <div style={{flexDirection: "row", display: "flex"}}>
                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#5563ff",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "rooms"})}
                        >
                            Manage Rooms
                    </button>

                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#3fff1d",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "items"})}
                        >
                            Manage Items
                    </button>

                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#ecff1d",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "newEvent"})}
                        >
                            New Event
                    </button>
                </div>
                <div style={{position: "relative", width: "100%", marginBottom: "20px",
                        fontSize: "20px", fontWeight: "bold"}}>

                    <div style={{ textAlign: "center" }}>
                        {this.state.viewDate}
                    </div>

                    <div style={{position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                            width: "30px", height: "30px"}}>
                        <div
                            onClick={() => this.dateInput.current?.showPicker()}
                            style={{position: "absolute", right: 0, top: "50%",
                                transform: "translateY(-50%)", width: 30, height: 30, display: "flex",
                                alignItems: "center", justifyContent: "center", cursor: "pointer"}}
                        >
                            📅
                        </div>

                        <input
                            ref={this.dateInput}
                            type="date"
                            value={this.state.viewDate || ""}
                            onChange={(e) => {const date = e.target.value;
                                this.setState({ viewDate: date });
                                this.fetchDayEvents(date);
                            }}
                            style={{position: "absolute", opacity: 0, width: 0,
                                height: 0, pointerEvents: "none"}}
                        />
                    </div>
                </div>

                <div
                    style={{border: "1px solid black", padding: "15px", backgroundColor: "#f5f5f5", overflowX: "auto", fontSize: 13}}
                >
                    {/* Header Row */}
                    <div
                        style={{display: "grid", gridTemplateColumns: `50px repeat(${this.state.times.length}, 40px)`,
                            fontWeight: "bold", marginBottom: "10px"}}
                    >
                        <div>Room</div>
                        {this.state.times.map((time, i) => (
                            <div key={i} style={{textAlign: "center"}}>
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Room Rows */}
                    {displayedRooms.map((room) => {
                        const roomIndex = this.state.rooms.indexOf(room);

                        return (
                            <div
                                key={roomIndex}
                                style={{display: "grid", gridTemplateColumns: `50px repeat(${this.state.times.length}, 40px)`, marginBottom: "4px"}}
                            >
                                {/* Room Name */}
                                <div
                                onClick={() =>
                                    this.setState({
                                        selectedRoom:
                                            this.state.selectedRoom === roomIndex
                                                ? null
                                                : roomIndex
                                    })
                                }
                                style={{display: "flex", alignItems: "center", paddingLeft: "5px",
                                    fontWeight: "bold", cursor: "pointer",
                                    backgroundColor:
                                        this.state.selectedRoom === roomIndex ? "#dbeafe" : "transparent"
                                }}
                            >
                                {room[1]}
                            </div>

                                {/* Time Cells */}
                                {this.state.times.map((time, timeIndex) => {
                                    const event = this.checkTimeAvailable(time, room[0], this.state.viewDate);

                                    return (
                                        <div
                                            key={timeIndex}
                                            style={{height: "40px", border: "1px solid #ccc", backgroundColor: event == null ? "white" : "red"}}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                    <RoomManagementModal
                        isOpen={this.state.openModal === "rooms"}
                        onClose={() => {
                            this.setState({ OpenModal: "none" });
                            this.fetchData();
                        }}
                    />
                    <ItemManagementModal
                        isOpen={this.state.openModal === "items"}
                        onClose={() => {
                            this.setState({ OpenModal: "none" });
                            this.fetchData();
                        }}
                    />
                    <NewEventModal
                        isOpen={this.state.openModal === "newEvent"}
                        times = {this.state.times}
                        rooms = {this.state.rooms}
                        events = {this.state.events}
                        onClose={() => {
                            this.setState({ OpenModal: "none" });
                            this.fetchData();
                        }}
                    />
            </div>
        );
    }
}


export default Events;