import Book from '../entity/Book';

export default interface BookRepository {
    get(id: string | undefined): Promise<Book | undefined>;
    search(criteria: string): Promise<Book[]>;
    save(book: Book): Promise<void>;
}

type Input = {
    title: string;
    price: number;
    authorName: string;
};
