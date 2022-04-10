import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

if (process.env.ENV === 'prod')
{
    const client = new Pool({
      
        host: "POSTGRES_HOST_PROD",
        database: "POSTGRES_DB_PROD",
        user: "POSTGRES_USER_PROD",
        password: "POSTGRES_PASSWORD_PROD"
    });
}

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