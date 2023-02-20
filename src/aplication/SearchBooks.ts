import Author from '../domain/entity/Author';
import Book from '../domain/entity/Book';

import BookRepository from '../domain/repository/BookRepository';

export default class SearchBooks {
    constructor(readonly bookRepository: BookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute(criteria: string): Promise<Book[]> {
        const books: Book[] = await this.bookRepository.search(criteria);
        return books;
    }
}

type Output = {
    id: string;
    title: string;
    price: number;
    authors: {
        id: string;
        name: string;
    }[];
};
