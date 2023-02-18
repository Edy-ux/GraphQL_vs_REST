DROP TABLE cultura_author;
DROP TABLE  cultura_book CASCADE;


create table cultura_author (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	name varchar(35)
);

create table cultura_book (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title varchar(35),
    price numeric
);



ALTER TABLE cultura_book ADD COLUMN  id_author uuid REFERENCES  cultura_author (cultura_author.id) ON DELETE CASCADE;

INSERT INTO  cultura_book (title, price) VALUES ('Clean Code', 65 );
INSERT INTO cultura_book (title, price)  VALUES ('Refactorion', 59);

INSERT INTO cultura_author (name) VALUES ('Ednei' )
INSERT INTO cultura_author (name)  VALUES ('Martin Fowler' )
INSERT INTO cultura_author ( name)  VALUES ('Robert C. Martin')

