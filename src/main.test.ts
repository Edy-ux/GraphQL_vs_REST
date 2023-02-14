import axios from 'axios';
import { response } from 'express';
import { stringify } from 'ts-jest';

describe('books API graphQL', () => {
  test('should return a array with 3 elements', async () => {
    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
         query GetBook {
          books {
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
    expect(books).toHaveLength(3);
  });

  test('get book by params', async () => {
    const response = await axios('http://localhost:4000/', {
      method: 'post',
      data: {
        query: `
       query GetBook($criteria: String) {
            books(criteria: $criteria) {
                id
                title
                authors {
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
    const [author] = book.authors;

    console.log(book);
    expect(books).toHaveLength(1);
    expect(book.title).toBe('Clean Code');
    expect(author.name).toBe('Robert C. Martin');
  });

  test('must save a new book', async () => {
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
  });
});
