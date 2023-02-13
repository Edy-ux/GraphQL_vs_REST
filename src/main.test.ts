import axios from 'axios';
// const axios = require("axios")

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

  const output = reponse.data;
  //  console.log();
  expect(output.data.books).toHaveLength(3);
});
