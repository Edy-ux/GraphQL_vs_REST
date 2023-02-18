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

    const {
      data: { books },
    } = await response.data;
    
   // console.log(JSON.stringify(books,  null, 4));
   expect(books).toHaveLength(2);
  });

 test('get book by params', async () => { 

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

    console.log(books)

    const [book] = books;
    const [author, authorB] = book.authors;

    console.log(authorB);
    expect(books).toHaveLength(1);
    expect(book.title).toBe('Clean Code');
    expect(author.name).toBe('Robert C. Martin');
    expect(authorB.name).toBe('Ednei');

  });

/*   test('must save a new book', async () => {
    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
           mutation ($book: BookInput) {
                saveBook (book: $book) { 
                    id
                    title
                    price
                    authors {
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

    const book = response.data;
  });  */
});
