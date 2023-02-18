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

export type queryParams = {
    criteria: string;
};
export type Author = {
    id_author: string;
    name: string;
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
                const connection = new Connection();
                const bookData = await connection.query(
                    'SELECT * FROM cultura_book where ($1::text is null or title = $1)',
                    [params.criteria]
                );
                const books = async (book: Book, dataAuthor: any) => {
                    const _book = {
                        id: book.id_book,
                        title: book.title,
                        price: Number(book.price),
                        authors: dataAuthor.map((author: any) => ({
                            id: author.id_author,
                            name: author.name,
                        })),
                    };

                    return _book;
                };
                if (!params.criteria) {
                    return bookData.map(async (book: Book) => {
                        const dataAuthor = await connection.query(
                            'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                            [book.id_book]
                        );
                        /* TODO Disable button user for that have no duplicate connection on database */
                        if (bookData.indexOf(book) == bookData.length - 1)
                            await connection.close();
                        return books(book, dataAuthor);
                    });
                } else {
                    const bookDataFiltered = await connection.query(
                        'SELECT * FROM cultura_book',
                        [params.criteria]
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
            saveBook: async (obj: any, params: any) => {
                const connection = new Connection();
                const authorId = crypto.randomUUID();
                const bookId = crypto.randomUUID();

                const { title, price, authorName } = params.book;

                await connection.query(
                    'INSERT INTO cultura_book (id_book, id_author, title, price) VALUES ($1, $2, $3, $4)',
                    [bookId, authorId, title, price]
                );
                await connection.query(
                    'INSERT INTO cultura_author (id_author, id_book, name) VALUES ($1, $2, $3)',
                    [authorId, bookId, authorName]
                );

                const [bookData] = await connection.query(
                    'SELECT * FROM  cultura_book where id_book = ($1)',
                    [bookId]
                );

                const authors = await connection.query(
                    'SELECT rt.id_author, name from cultura_author rt inner join cultura_book lf on rt.id_book = lf.id_book where lf.id_book = $1',
                    [bookData.id_book]
                );
                await connection.close();

                return {
                    id: bookData.id_book,
                    title: bookData.title,
                    price: parseFloat(bookData.price),
                    authors: authors.map((author: Author) => ({
                        id: author.id_author,
                        name: author.name,
                    })),
                };
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
