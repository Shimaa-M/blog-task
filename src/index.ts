import express, { Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from './swaggerDocument.json'

import dotenv from 'dotenv';
import { userRoutes } from './handlers/userHandler';
import postRoutes from './handlers/postHandlers';

import * as bodyParser from 'body-parser';
import cookiesParser from 'cookie-parser';

dotenv.config({ path: './.env' });

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookiesParser())



app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));    

app.get('/', (req: Request, res: Response) => {
    return res.json({
        status: 'success'
    });
});


app.use('/users', userRoutes);
app.use('/posts', postRoutes);

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`Server listening on port ${port}`)
 
})
