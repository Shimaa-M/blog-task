import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
let client: Pool;

if (process.env.ENV == 'dev') {
    const {
                POSTGRES_HOST,
                POSTGRES_DB,
                POSTGRES_USER,
                POSTGRES_PASSWORD,
            } = process.env;
        
              client = new Pool({
            
                host: POSTGRES_HOST,
                database: POSTGRES_DB,
                user: POSTGRES_USER,
                password: POSTGRES_PASSWORD
           
            });
    
}
else {
    client = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });  
}
console.log(client);
export default client