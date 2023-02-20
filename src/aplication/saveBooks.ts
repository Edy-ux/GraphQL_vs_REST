import Author from '../domain/entity/Author';
import Book from '../domain/entity/Book';
import BookRepository from '../domain/repository/BookRepository';
import Connection from '../infra/database/Connection';
const crypto = require('crypto');

export default class SaveBook {
    constructor(public bookRepository: BookRepository) {}
    async execute(input: Input): Promise<void> {
        const book = new Book(undefined, input.title, input.price);
        const author = new Author(undefined, input.authorName);
        book.addAuthor(author);
        const bookSaved = await this.bookRepository.get(book.id)
    }
}

type Input = {
    title: string;
    price: number;
    authorName: string;
};

type Output = {
    id?: string;
    title: string;
    price: number;
    authors: {
        id: string;
        name: string;
    }[];
};
