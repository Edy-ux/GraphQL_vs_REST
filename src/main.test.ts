import axios from 'axios';

describe('books API graphQL', () => {
  test('should return a array with 2 elements', async () => {
    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
         query GetBook {
          books: search {
              id
              title
              price
              authors {
                id
                name
              }
          
          }
       }`,
      },
    });

   const { data: { books } } = await response.data;
    
  //  console.log(JSON.stringify(books,  null, 4));
   expect(books).toHaveLength(1);
  });

/*  test('get book by params', async () => { 

    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
       query GetBook($criteria: String) {
        books: search(criteria: $criteria) {
                id
                title
                price
                authors {
                  id
                  name
                }
            } 
        }`,

        variables: {
          criteria: 'Clean',
        },
      },
    });

    const {
      data: { books },
    } = await response.data;


    const [book] = books;
    const [author, authorB] = book.authors;

    expect(books).toHaveLength(2);
    expect(book.title).toBe('Clean Code');
    expect(author.name).toBe('Robert C. Martin');
    expect(authorB.name).toBe('Ednei');

  }); */

  test('must save a new book', async () => {
    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
           mutation ($book: BookInput) {
                book: saveBook(book: $book) { 
                    id
                    title
                    price
                    authors{
                      id 
                      name
                    }
                } 
           }
           `,
        variables: {
          book: {
            title: 'Clean Architecture',
            price: 85,
            authorName: 'Robert C. Martin',
          },
        },
      },
    });

    const { data: book } = response.data;
    console.log(JSON.stringify(book, null, 2));

    
  }); 
});
