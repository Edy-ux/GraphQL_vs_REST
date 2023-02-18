DROP TABLE cultura_author;
DROP TABLE cultura_book;


create table cultura_book_author (
	id_book uuid,
    id_author uuid 
);

create table cultura_author (
    id_author uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	name varchar(25)
);

create table cultura_book (
    id_book uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title varchar(35),
    price numeric
);

INSERT INTO  cultura_book (title, price) VALUES ( 'Clean Code', 65 );
INSERT INTO cultura_book (title, price)  VALUES ('Refactorion', 59);

INSERT INTO cultura_author (name) VALUES ('Robert C. Martin');
INSERT INTO cultura_author (name)  VALUES  ('Martin Fowler');

INSERT INTO cultura_book_author (id_book, id_author)  VALUES  ('c76e4c6c-9d30-41bf-a03e-b9646c727557', 'ac95eb56-bd80-4f98-b16b-bd95c729a8d2' );
INSERT INTO cultura_book_author (id_book, id_author)  VALUES  ('11ccd366-e309-416f-8c96-5e6936fe6298', '4ef0d71a-ff65-4a51-8554-82c95ffdde83' );

