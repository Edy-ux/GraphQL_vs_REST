import axios from 'axios';

test('should return a array with 3 elements', async () => {
  const query = `
  query GetBook {
       books {
           id
           title
           author {
             name
           } 
       }
 }`;

  const reponse = await axios('http://localhost:4000/', {
    method: 'post',
    data: {
      query: `
        query GetBook {
            books {
                id
                title
                author {
                  name
                } 
            }
       }`,
    },
  });

  const  {data: { books }} = reponse.data; 
  /* const {books}  = reponse.data
   console.log(books); */
   console.log(books[1]);
  expect(books).toHaveLength(3)
});
