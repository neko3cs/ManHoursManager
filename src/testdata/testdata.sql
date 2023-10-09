DELETE FROM `Work` WHERE id = 'ABCDE';
INSERT INTO `Work` (
	id,
	date,
	orderId,
	processId,
	manHours,
	remarks
) VALUES (
	'ABCDE',
	'2023-09-10',
	(SELECT id FROM `Order` WHERE orderNumber = 10000 LIMIT 1),
	(SELECT id FROM `Process` WHERE processNumber = 100 LIMIT 1),
	7.5,
	'ほげほげ'
);