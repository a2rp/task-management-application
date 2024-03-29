CREATE DATABASE perntasks;

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    title varchar(50),
    description VARCHAR(255),
    status varchar(20),
    due_date varchar(255),
    created_at varchar(50),
    updated_at varchar(50)
);

