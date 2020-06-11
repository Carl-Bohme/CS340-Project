
-- Database Creation

-- Drops tables if they already exist (must be run separately)
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS subject_address, subject, coordinates, station, bird_ownership, bird, handler_address, handler;
SET FOREIGN_KEY_CHECKS=1; 

-- Create the subject table
CREATE TABLE subject (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create the subject_address table
CREATE TABLE subject_address (
	subject_id INT(11) NOT NULL,
	nbr INT(11) NOT NULL,
	street VARCHAR(255) NOT NULL,
    	city VARCHAR(255) NOT NULL,
	FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

-- Create the bird table
CREATE TABLE bird (
	id INT(11) NOT NULL AUTO_INCREMENT,
	production_date date NOT NULL,
	race VARCHAR(255) NOT NULL,
	subject_id INT(11),
	FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE SET NULL,
	PRIMARY KEY (id)
);

-- Create the station table
CREATE TABLE station (
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (name)
);

-- Create the coordinates table (used for station)
CREATE TABLE coordinates (
	station_name VARCHAR(32) NOT NULL,
	FOREIGN KEY (station_name) REFERENCES station(name) ON DELETE CASCADE,
	latitude DOUBLE(9, 6) NOT NULL,
	longitude DOUBLE(9, 6) NOT NULL,
	PRIMARY KEY (station_name)
);

-- Create the Handler table
CREATE TABLE handler (
	codename VARCHAR(16) NOT NULL,
	username VARCHAR(16) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL,
	station VARCHAR(32) NOT NULL,
	FOREIGN KEY (station) REFERENCES station(name) ON DELETE CASCADE,
	PRIMARY KEY (codename)
);

-- Create the subject_address table
CREATE TABLE handler_address (
	codename VARCHAR(16) NOT NULL,
	FOREIGN KEY (codename) REFERENCES handler(codename) ON DELETE CASCADE,
	nbr INT(11) NOT NULL,
	street VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL
);

-- Create the bird_ownership table (many to many between bird and handler)
CREATE TABLE bird_ownership (
	bird_id INT(11) NOT NULL,
	FOREIGN KEY (bird_id) REFERENCES bird(id) ON DELETE CASCADE,
	handler_codename VARCHAR(16) NOT NULL,
	FOREIGN KEY (handler_codename) REFERENCES handler(codename) ON DELETE CASCADE,
	PRIMARY KEY (bird_id, handler_codename)
);

-- Creates Trigger that removes all bird ownership when a bird is deleted
CREATE TRIGGER bird_delete
AFTER DELETE ON bird
FOR EACH ROW
    DELETE FROM bird_ownership
    WHERE bird_id=old.id;

-- Creates Trigger that deletes all handlers assigned to deleted station
CREATE TRIGGER station_delete_handlers
AFTER DELETE ON station
FOR EACH ROW
    DELETE FROM handler
    WHERE station=old.name;

-- Creates Trigger that deletes coordinates of deleted station
CREATE TRIGGER station_delete_coordinates
AFTER DELETE ON station
FOR EACH ROW
    DELETE FROM coordinates
    WHERE station_name=old.name;

-- Creates Trigger that deletes handler address when handler deleted
CREATE TRIGGER handler_delete
AFTER DELETE ON handler
FOR EACH ROW
    DELETE FROM handler_address
    WHERE codename=old.codename;

-- Creates Trigger that updates bird when subject is deleted
CREATE TRIGGER subject_delete
AFTER DELETE ON subject
FOR EACH ROW
    UPDATE bird
    SET subject_id=NULL
    WHERE subject_id=old.id;