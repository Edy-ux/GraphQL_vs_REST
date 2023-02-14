DROP TABLE cultura_author;
DROP TABLE cultura_book;

create schema cultura;

create table cultura_book (
    id_book uuid,
    title text,
    price numeric

);

create table cultura_author (
    id_author uuid,
    name text
 
);

