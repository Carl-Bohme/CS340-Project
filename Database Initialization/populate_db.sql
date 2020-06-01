/*-------------------------------------------------------
Populates Databes With Example Data
*/-------------------------------------------------------

-- Example data for subject
INSERT INTO subject (name)
VALUES  ('John Doe'),
        ('Donald J. Trump'),
        ('Benny Beaver'),
	('Jimmy Neutron'),
	('Emmanuel Macron'),
	('Michael Jackson'),
	('Markus Perrson'),
	('Barack Obama'),
	('John McAfee'),
	('Jeff Bezos');

-- Example addresses for subjects	
INSERT INTO subject_address
VALUES	((SELECT id FROM subject WHERE name="Donald J. Trump"), 1100, "S. Ocean Blvd", "Palm Beach"),
	((SELECT id FROM subject WHERE name="Donald J. Trump"), 1600, "Pennsylvania Ave", "Washinton DC"),
	((SELECT id FROM subject WHERE name="Barack Obama"), 1600, "Pennsylvania Ave", "Washinton DC"),
	((SELECT id FROM subject WHERE name="Benny Beaver"), 1500, "SW Jefferson Way", "Corvallis"),
	((SELECT id FROM subject WHERE name="John Doe"), 184, "Foster Street", "Portland"),
	((SELECT id FROM subject WHERE name="Jimmy Neutron"), 73, "River Street", "Egg Harbor Township"),
	((SELECT id FROM subject WHERE name="Emmanuel Macron"), 9563, "Cherry Ave.", "Roseville"),
	((SELECT id FROM subject WHERE name="Michael Jackson"), 9283, "Mountainview Ave.", "Butte"),
	((SELECT id FROM subject WHERE name="Markus Perrson"), 17, "Homestead Dr.", "Groton"),
	((SELECT id FROM subject WHERE name="John McAfee"), 7910, "Sage Street", "East Orange"),
	((SELECT id FROM subject WHERE name="Jeff Bezos"), 701, "Park Street", "Midland"),
	((SELECT id FROM subject WHERE name="Jeff Bezos"), 85, "Hollywood Hills", "Los Angeles");
		
-- Example data for bird
INSERT INTO bird (production_date, race, subject_id)
VALUES	("2016-10-01", "Canary", (SELECT id FROM subject WHERE name="Donald J. Trump")),
	("2020-02-14", "Blue Jay", (SELECT id FROM subject WHERE name="Benny Beaver")),
	("2018-01-01", "Sparrow", (SELECT id FROM subject WHERE name="John Doe")),
	("2016-10-01", "Albatross", (SELECT id FROM subject WHERE name="Emmanuel Macron")),
	("2020-12-14", "Pelikan", (SELECT id FROM subject WHERE name="John McAfee")),
	("2019-09-01", "Canary", (SELECT id FROM subject WHERE name="Jimmy Neutron")),
	("2017-04-05", "Paraqueet", (SELECT id FROM subject WHERE name="Markus Perrson")),
	("2016-06-01", "Canary", (SELECT id FROM subject WHERE name="Jeff Bezos")),
	("2011-05-24", "Swallow", (SELECT id FROM subject WHERE name="Jeff Bezos")),
	("2018-07-05", "Parrot", (SELECT id FROM subject WHERE name="Michael Jackson")),
	("2019-08-01", "Canary", (SELECT id FROM subject WHERE name="Barack Obama"));
		
-- Example data for station
INSERT INTO station
VALUES ("Arctic"),("Area51"),("Mexico"),("Paris"),("Jakarta");

-- Example coordinates for stations
INSERT INTO coordinates
VALUES	("Arctic", 81.626254, 61.968089), 
	("Area51", 37.234332, -115.806663),
	("Mexico", 19.300327, -99.113250),
	("Paris", 48.830734, 2.371417),
	("Jakarta", -6.106477, 106.925347);

-- Example data for handler
INSERT INTO handler
VALUES	("oss117", "hubertb", "blanquette", "Paris"),
	("oss076", "michelm", "saucedallas", "Paris"),
	("cia255", "bournej", "indentity", "Area51"),
	("fbi001", "hooverj", "aliensexist", "Area51"),
	("mex007", "sanchezj", "nahuatl", "Mexico"),
	("mex114", "robertob", "cincodemayo", "Mexico"),
	("007", "bondj", "savethequeen", "Arctic"),
	("666", "satanl", "burninhell", "Arctic"),
	("idn160", "jokowi", "obamaisgone", "Jakarta"),
	("idn162", "ikowais", "nasigoreng", "Jakarta");

-- Example addresses for handler	
INSERT INTO handler_address (codename, nbr, street, city)
VALUES	("oss117", 14, "Rue Mouftard", "Paris"),
	("oss076", 40, "Rue du Cornet", "Brussels"),
	("cia255", 1700, "Willshire Blvd", "Los Angeles"),
	("fbi001", 840, "Powell St", "San Francisco"),
	("mex114", 308, "Negra Arroyo Lane", "Albuquerque"),
	("mex007", 1339, "Calle Playa de Hornos", "Guadalajara"),
	("007", 56, "Wellington Square", "London"),
	("666", 666, "Styx River Road", "Hell"),
	("idn160", 1, "Jalan Ir. H. Juanda", "Bogor");

-- Randomly assigns a bird to each handler
INSERT INTO bird_ownership
VALUES	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "idn160"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "666"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "007"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "mex007"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "mex114"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "fbi001"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "cia255"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "oss076"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "oss117"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "idn162"),
	((SELECT id FROM subject ORDER BY RAND() LIMIT 1), "666");