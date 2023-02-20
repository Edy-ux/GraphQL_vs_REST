import Book from '../../domain/entity/Book';
import BookRepository from '../../domain/repository/BookRepository';
import Connection from '../database/Connection';
import Author from '../../domain/entity/Author';

export default class BookRepositoryDatabase implements BookRepository {
    async search(criteria: string): Promise<Book[]> {
        const connection = new Connection();
        const bookData = await connection.query(
            'SELECT * FROM cultura_book where ($1::text is null or title = $1)',
            [criteria]
        );

        if (!criteria) {
            return bookData.map(async (book: any) => {
                const dataAuthor = await connection.query(
                    'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                    [book.id_book]
                );
                /* TODO Disable button user for that have no duplicate connection on database */
                if (bookData.indexOf(book) == bookData.length - 1)
                    await connection.close();
                const books = new Book(book.id_book, book.title, book.price);
                books.authors = dataAuthor.map((author: any) => ({
                    id: author.id_author,
                    name: author.name,
                }));
                return books;
            });
        } else {
            const bookData = await connection.query(
                'SELECT * FROM cultura_book',
                []
            );
            const bookDataFiltered = bookData.filter((book: Book) => {
                return book.title
                    .toLocaleLowerCase()
                    .includes(criteria.trim().toLocaleLowerCase());
            });
            const output: Book[] = [];

            for (const book of bookDataFiltered) {
                const dataAuthor = await connection.query(
                    'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                    [book.id_book]
                );
                const books = new Book(book.id, book.title, parseFloat(book.price));
                books.authors = dataAuthor.map((author: any) => ({
                    id: author.id_author,
                    name: author.name,
                }));
                output.push(books);
            }

            await connection.close();
            return output;
        }
    }

    async get(id: string): Promise<Book | undefined> {
        const connection = new Connection();
        const [bookData] = await connection.query(
            'SELECT * FROM cultura_book where id_book = $1',
            [id]
        );

        if (!bookData) return;
        const dataAuthor = await connection.query(
            'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
            [bookData.id_book]
        );

        const authors: Author[] = [];

        for (const author of dataAuthor) {
            authors.push(new Author(author.id_author, author.name));
        }
        const book = new Book(
            bookData.id,
            bookData.title,
            parseFloat(bookData.price)
        );
        book.authors = authors;
        await connection.close();
        return book;
    }

    async save(book: Book): Promise<void> {
        const connection = new Connection();

        await connection.query(
            'INSERT INTO cultura_book (id_book, id_author, title, price) VALUES ($1, $2, $3, $4)',
            [book.id, book.id, book.title, book.price]
        );

        for (const author of book.authors) {
            await connection.query(
                'INSERT INTO cultura_author (id_author, id_book, name) VALUES ($1, $2, $3)',
                [author.id, book.id, author.name]
            );
        }
        await connection.close();
    }
}

type Input = {
    title: string;
    price: number;
    authorName: string;
};
