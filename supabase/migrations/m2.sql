ALTER TABLE public."Class_Coach"
ADD COLUMN volunteer_hours INT4 NOT NULL;

ALTER TABLE public."Class"
DROP COLUMN volunteer_hours;