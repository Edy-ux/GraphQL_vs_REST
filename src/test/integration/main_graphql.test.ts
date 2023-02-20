
import axios from 'axios';

describe('book API graphQL', () => {
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
        expect(books).toHaveLength(books.length);
    });

  

 
});
