/*
  ManHours Manager Database
  version 1.0
*/
DROP TABLE IF EXISTS User;
CREATE TABLE User (
	userId		TEXT PRIMARY KEY,
	password	TEXT
);

DROP TABLE IF EXISTS Work;
CREATE TABLE Work (
	id				TEXT PRIMARY KEY,
	date			TEXT,
	orderId		INT,
	processId	INT,
	manHours	REAL,
	remarks		TEXT
);

DROP TABLE IF EXISTS Process;
CREATE TABLE Process (
	id						TEXT PRIMARY KEY,
	processNumber	INT,
	name					TEXT	
);

DROP TABLE IF EXISTS 'Order';
CREATE TABLE 'Order' (
	id					TEXT PRIMARY KEY,
	orderNumber	INT,
	name				TEXT
);