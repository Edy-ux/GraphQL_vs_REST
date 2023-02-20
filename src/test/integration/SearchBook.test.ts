import SearchBooks from '../../aplication/SearchBooks';
import BookRepositoryDatabase from '../../infra/repository/BookRepositoyDataBase';

test('get book by params', async () => {
    const bookRepository = new BookRepositoryDatabase();
    const searchBooks = new SearchBooks(bookRepository);

    const [book] = await searchBooks.execute('Refac');

    expect(book.title).toBe('Refactorion');
    expect(book.price).toBe(85);
});
