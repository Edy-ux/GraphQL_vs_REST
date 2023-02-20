const crypto = require('crypto');
export default class Author {
    constructor(readonly id: string | undefined, readonly name: string) {
        if (!id) this.id = crypto.randomUUID();
    }
}
