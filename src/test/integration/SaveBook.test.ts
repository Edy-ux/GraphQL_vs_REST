import SaveBook from '../../aplication/saveBooks';
import BookRepositoryDatabase from '../../infra/repository/BookRepositoyDataBase';
test('must save a new book', async () => {
    const input = {
        title: 'A',
        price: 100,
        authorName: 'John',
    };
    const bookRepor = await new BookRepositoryDatabase();
    const book = new SaveBook(bookRepor);
    const output = await book.execute(input);
    
/*     expect(output.title).toBe('A');
    expect(output.price).toBe(100);
    expect(output.authors[0].name).toBe('John'); */
});
