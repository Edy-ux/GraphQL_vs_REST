import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

(async () => {
  //schema basics
  const typeDefs = `
   
        type Book {
            id: Int
            title: String
            author: Author
            price: Int
    
        }

        type Author {
            id: Int
            name: String
        }

        type Query {
          books(criteria: String): [Book]
        }


 `;
  //db
  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: {
        name: 'Richard C. Martin',
      },
      price: 64,
    },
    {
      id: 2,
      title: 'Learn React',
      author: {
        name: 'Alex Banks and Eve Porcello',
      },
      price: 50,
    },
    {
      id: 3,
      title: 'Beyound good and evil',
      author: {
        name: 'Nietzche',
      },
      price: 64,
    },
  ];

  const authors = [
    { id: 1, name: 'Richard C. Martin' },
    { id: 2, name: 'Alex Banks and Eve Porcello' },
    { id: 3, name: 'Nietzsche' },

  ];

  const resolvers = {
    Query: {
      books(_obj: any, args: any){
        console.log(args);
        if(!args.criteria) return books
        return books.filter(books => books.title.toLocaleLowerCase().includes(args.criteria.toLocaleLowerCase()));
      },

     /*  author: () =>
        authors.filter((author, i) => {
          return author.id === books[i].id; 
        }), */
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
