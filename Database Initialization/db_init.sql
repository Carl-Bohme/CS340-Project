
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

-- Creates Trigger that removes bird when ownership is deleted
CREATE TRIGGER bird_without_ownership
AFTER DELETE ON bird_ownership
FOR EACH ROW
    DELETE FROM bird
    WHERE id=old.bird_id;