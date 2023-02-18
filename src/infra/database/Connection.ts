import pgp from 'pg-promise';

export default class Connection {
  public connection: any;

  constructor() {
    this.connection = pgp()('postgresql://postgres:root@localhost:5432/app');
  }

  query(statement: string, params: any) {
    return this.connection.query(statement, params);
  }

  close() {
    return this.connection.$pool.end();
  }
}
