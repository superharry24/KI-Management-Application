/*remove before sending out*/
DROP table if EXISTS categories CASCADE;
DROP table if EXISTS users CASCADE;
DROP table if EXISTS items CASCADE;
DROP table if EXISTS item_update_log CASCADE;
DROP table if EXISTS tasks CASCADE;
DROP table if EXISTS task_assigned_staff CASCADE;
DROP table if EXISTS task_required_items CASCADE;
DROP table if EXISTS rooms CASCADE;
DROP table if EXISTS room_overlaps CASCADE;
DROP table if EXISTS large_items CASCADE;
DROP table if EXISTS small_items CASCADE;
DROP table if EXISTS events CASCADE;
DROP table if EXISTS event_small_items CASCADE;
DROP table if EXISTS event_large_items CASCADE;

CREATE TABLE categories(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);


CREATE TABLE users(
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    password_hash TEXT NOT NULL,
    admin BOOLEAN NOT NULL
);



CREATE TABLE items (
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category_id INT NOT NULL REFERENCES categories(id),
    current_amount INT NOT NULL,
    order_level INT NOT NULL,
    unit_size INT NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    item_cost NUMERIC(10,2) NOT NULL,
    location VARCHAR(30) NOT NULL,
    supplier VARCHAR(30) NOT NULL,
    SKU VARCHAR(30) NOT NULL
);

CREATE TABLE item_update_log (
    id   SERIAL PRIMARY KEY NOT NULL,
    item_id INT NOT NULL REFERENCES items(id) ,
    user_id INT NOT NULL REFERENCES users(id),
    last_update_date TIMESTAMP NOT NULL
);

CREATE TABLE tasks (
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id),
    priority INT NOT NULL,
    repeat_interval INT,
    created_date TIMESTAMP NOT NULL,
    repeat_threshold TIMESTAMP NOT NULL,
    description VARCHAR(300),
    location VARCHAR(30) NOT NULL,
    image BYTEA,
    status VARCHAR(30) NOT NULL
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
    PRIMARY KEY(task_id, item_id)
);

/* If interval is null, assumed to be not repeatable, interval meassured in days 
indexes will match up for items and amounts, priority ranked where 1 is highest*/

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
    date DATE NOT NULL
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
INSERT INTO categories(name)	
        VALUES ('cleaning'),
        ('cooking');

INSERT INTO items(name, category_id, current_amount, order_level, unit_size, unit_cost, item_cost, location, supplier)	
        VALUES ('Soap',1, 5, 2, 1, 1.15, 1.15, 'bathroom', 'jerry'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve'),
        ('Soup',2, 10, 2, 2, 5, 2.25, 'kitchen', 'steve');

