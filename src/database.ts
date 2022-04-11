import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
let client: Pool;

if (process.env.ENV === 'production') {

     client = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
     const {
        POSTGRES_DRIVER,
        POSTGRES_HOST,
        POSTGRES_DB,
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        POSTGRES_DIALECT
    } = process.env;

      client = new Pool({
    
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
   
    });
}
console.log(client);
export default client