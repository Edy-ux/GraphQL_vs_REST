import Author from './Author';
const crypto = require('crypto');
export default class Book {
    authors: Author[] = [];
    constructor(
         readonly id: string | undefined,
        readonly title: string,
        readonly price: number
    ) {
        if (!id) this.id = crypto.randomUUID();
        //    this.authors = this.authors
    }
    addAuthor(author: Author) {
        this.authors.push(author);
    }
}
