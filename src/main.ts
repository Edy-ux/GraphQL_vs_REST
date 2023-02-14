import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import pgp from 'pg-promise'
(async () => {
  //schema basics

  const connection =  pgp()("postgresql://postgres:root@localhost:5432/app")
  const data  =  await connection.query('SELECT * FROM cultura_book')

  
  const typeDefs = `
   
        type Book {
            id: Int
            title: String
            authors: [Author]
            price: Int
    
        }
        type Author {
            id: Int
            name: String
        }

        type Query {
          books(criteria: String): [Book]
        }

        type Query {
          author(criteria: String): [Author]
        }
        
        input BookInput {
          title: String
          price: Int
          authorName: String

        }
        type Mutation {
            saveBook (book: BookInput): Book
        }

 `;
  //db
  const books = [
    {
      id: 1,
      title: 'Clean Code',
      authors: [
        {
          name: 'Robert C. Martin',
        },
        {
          name: 'Martin',
        },
      ],
      price: 64,
    },
    {
      id: 2,
      title: 'Learn React',
      authors: [
        {
          name: 'Alex Banks',
        },
        {
          name: 'Alex Banks Eve Porcello',
        },
      ],
      price: 50,
    },
    {
      id: 3,
      title: 'Beyound good and evil',
      authors: [
        {
          name: 'Nietzche',
        },
      ],
      price: 64,
    },
  ];

  const authors = [
    { id: 1, name: 'Richard C. Martin' },
    { id: 2, name: 'Alex Banks and Eve Porcello' },
    { id: 3, name: 'Nietzsche' },
  ];

  console.log(books);

  const resolvers = {
    Query: {
      books(obj: any, args: any) {
    
     
        if (!args.criteria) return books;
        return books.filter((books) =>
          books.title
            .toLocaleLowerCase()
            .includes(args.criteria.toLocaleLowerCase())
        );
      },
      author: (obj: any, args: any) => {
        if (!args.criteria) return authors;
      },

    },

    

    Mutation: {
      saveBook: (obj: any, args: any) => {
        console.log(args);
        const book = {
          id: books.length + 1,
          title: args.book.title,
          price: args.book.price,
          authors: [
            {
              name: args.book.authorName,
            },
          ],
        };

        books.push(book);
        return book;
      },
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
