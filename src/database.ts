import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const {
    POSTGRES_DRIVER,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DIALECT
} = process.env;

export const client = new Pool({
    
    host: POSTGRES_HOST,
    database: POSTGRES_DB ,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
   
});

export default client