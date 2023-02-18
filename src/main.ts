import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const crypto = require('crypto');
import Connection from './infra/database/Connection';

type Book = {
    id_book: string;
    title: string;
    price: number;
    authors?: { id: string; title: string; price: number }[];
};

type queryParams = {
    criteria: string;
};

(async () => {
    const typeDefs = `
   
        type Book {
            id: String
            title: String
            price: Int
            authors: [Author]
    
        }
        type Author {
            id: String
            name: String
        }

        type Query {
          search(criteria: String): [Book]
        }

        type Query {
          search(book: String): [Book]
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
    const resolvers = {
        Query: {
            async search(obj: {}, params: any) {
              console.log(params)
                const connection = new Connection();
                const bookData = await connection.query(
                    'SELECT * FROM cultura_book where ($1::text is null or title = $1)',
                    [params.criteria]
                );
                const books = (book: Book, dataAuthor: any) => ({
                    id: book.id_book,
                    title: book.title,
                    price: book.price,
                    authors: dataAuthor.map((author: any) => ({
                        id: author.id_author,
                        name: author.name,
                    })),
                });
                if (!params.criteria) {
                    return bookData.map(async (book: Book) => {
                        const dataAuthor = await connection.query(
                            'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                            [book.id_book]
                        );
                        return books(book, dataAuthor);
                    });
                  
                } else {
                    const bookDataFiltered = await connection.query(
                        'SELECT * FROM cultura_book',
                        [params.criteriay]
                    );
                    return bookDataFiltered
                        .filter((book: Book) => {
                            return book.title
                                .toLocaleLowerCase()
                                .includes(params.criteria.toLocaleLowerCase());
                        })
                        .map(async (book: Book) => {
                            const dataAuthor = await connection.query(
                                'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                                [book.id_book]
                            );
                            await connection.close();
                            return books(book, dataAuthor);
                        });
                }
            },

        },

        Mutation: {
            /*       saveBook: async (obj: any, params: any) => {
        const connection = pgp()(
          "postgresql://postgres:root@localhost:5432/app"
        );

        const books = await connection.query("SELECT * FROM cultura_book");
    
        const book = {
          id: books.length + 1,
          title: params.book.title,
          price: params.book.price,
          authors: [
            {
              name: params.book.authorName,
            },
          ],
        };

        books.push(book);
        return book;
      }, */
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
