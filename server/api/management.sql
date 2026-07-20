/*remove before sending out*/
/*DROP table if EXISTS users CASCADE;
DROP table if EXISTS items CASCADE;
DROP table if EXISTS item_update_log CASCADE;
DROP table if EXISTS tasks CASCADE;
DROP table if EXISTS task_assigned_staff CASCADE;
DROP table if EXISTS task_required_items CASCADE;*/
DROP table if EXISTS rooms CASCADE;
DROP table if EXISTS room_overlaps CASCADE;
DROP table if EXISTS large_items CASCADE;
DROP table if EXISTS small_items CASCADE;
DROP table if EXISTS events CASCADE;
DROP table if EXISTS event_small_items CASCADE;
DROP table if EXISTS event_large_items CASCADE;



/* commented out tables used for documentation purposes
CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    password_hash TEXT NOT NULL,
    admin BOOLEAN NOT NULL,
    last_login TIMESTAMP
);



CREATE TABLE items (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(30) NOT NULL,
    current_amount INT NOT NULL,
    order_level INT NOT NULL, --How low the ammount has to be for an allert
    unit_size VARCHAR(30) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    item_description VARCHAR(300) NOT NULL,
    location VARCHAR(30) NOT NULL,
    supplier VARCHAR(30) NOT NULL,
    SKU VARCHAR(30) NOT NULL --Unique ID number
);

CREATE TABLE item_update_log (
    id SERIAL PRIMARY KEY NOT NULL,
    item_id INT NOT NULL REFERENCES items(id),
    user_id INT NOT NULL REFERENCES users(id),
    change_amount INT DEFAULT 0,
    delete BOOLEAN DEFAULT FALSE,
    edit BOOLEAN DEFAULT FALSE,
    date TIMESTAMP NOT NULL,
    created BOOLEAN DEFAULT FALSE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL,
    priority INT NOT NULL, --1 is highest
    repeat_interval INT NOT NULL, --0 for never, 1 for days, 2 for weeks, 3 for months, 4 for years
    interval_amount INT NOT NULL, --How much of the interval passes before completion gets reset
    created_date TIMESTAMP NOT NULL,
    complete_date TIMESTAMP,
    repeat_threshold TIMESTAMP DEFAULT NULL, --Status gets set to assigned or unassigned after date passes this point
    description VARCHAR(300),
    location VARCHAR(30) NOT NULL,
    image_path VARCHAR(300) DEFAULT NULL,
    status int NOT NULL, --0 is Unassigned, 1 is assigned, 2 is in progress, 3 is complete
    active boolean NOT NULL DEFAULT TRUE  
);
/*interval meassured in days*/
CREATE TABLE task_assigned_staff (
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(task_id, user_id)
);

CREATE TABLE task_required_items (
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    --add automatic decrease on completion?
    PRIMARY KEY(task_id, item_id)
);
*/


CREATE TABLE rooms(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    large_limit INT NOT NULL,
    people_limit INT NOT NULL
);

CREATE TABLE room_overlaps (
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    overlapping_room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    PRIMARY KEY(room_id, overlapping_room_id)
);
/*connected rooms are for rooms that will make this room unavailable if the other is in use.*/

CREATE TABLE large_items(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    amount INT NOT NULL    
);

CREATE TABLE small_items(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    amount INT NOT NULL    
);

CREATE TABLE events(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    attendees INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE event_small_items (
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    small_item_id INT REFERENCES small_items(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    PRIMARY KEY(event_id, small_item_id)
);

CREATE TABLE event_large_items (
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    large_item_id INT REFERENCES large_items(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    PRIMARY KEY(event_id, large_item_id)
);

/* for testing, remove when launched */



        


