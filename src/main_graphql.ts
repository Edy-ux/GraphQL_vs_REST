import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import SaveBook from './aplication/saveBooks';
import SearchBooks from './aplication/SearchBooks';
import BookRepositoryDatabase from './infra/repository/BookRepositoyDataBase';

export type queryParams = {
    criteria: string;
};
export type Author = {
    id_author: string;
    name: string;
};

//entrypoint
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

        input BookInput {
          title: String
          price: Int
          authorName: String
        }
        type Mutation {
            saveBook(book: BookInput): Book
        }

 `;
    const resolvers = {
        Query: {
            async search(obj: {}, params: any) {
                const bookRepository = new BookRepositoryDatabase();
                const search = new SearchBooks(bookRepository);
                const output = await search.execute(params.criteria);
                return output;
            },
        },

        Mutation: {
            async saveBook(obj: any, params: any) {
                const bookRepository = new BookRepositoryDatabase();
                const saveBook = new SaveBook(bookRepository);
                const book = await saveBook.execute(params.book);
                console.log(book);
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
