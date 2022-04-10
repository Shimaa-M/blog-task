import express, { Request, Response, Router } from 'express';
import { User, userStore } from '../models/User';
import { userCreate } from '../DTO/userCreate.dto';
import jwt from 'jsonwebtoken';
import {validateRegisteration} from '../utilities/validateRegisteration'
import isLogged from '../utilities/isLogged';
import { edit } from './postHandlers';
export const  userRoutes = express.Router({ mergeParams: true });

const store = new userStore();

const createSendToken = (user: User, statusCode: number, _req: Request, res: Response) => {
    const token = jwt.sign({user}, (process.env.JWT_TOKEN as unknown)as string);
    res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + parseInt((process.env.JWT_COOKIE_EXPIRES_IN as unknown)as string) * 24 * 60 * 60 * 1000
        ),
      httpOnly: true,
      secure: _req.secure || _req.headers['x-forwarded-proto'] === 'https'
    });

    res.setHeader('Content-Type', 'application/json').status(statusCode).send({
      status: 'success',
      token,
      data: {
        user
      }
    });
  }
 

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        if (users) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(users);
        }
        else {
            return res.end('No users found')
        }
    } catch(err) {
         return res.setHeader('Content-Type', 'application/json')
             .status(400).send(err);
        }
}

const show = async (_req: Request, res: Response) => {
    try {
        console.log("nested")
        const user = await store.show(parseInt(_req.params.id));
        if (user) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(user);
        }else {
            return res.setHeader('Content-Type', 'application/json')
            .status(400).end('No user found with this ID')
        }
    } catch(err) {
        return res.setHeader('Content-Type', 'application/json')
         .status(400).send(err);
       }
}

const showPostsRelatedUser = async (_req: Request, res: Response) => {
    try {
        const id =parseInt(res.locals.user_id);
        const posts = await store.showPostsRelatedUser(id);
        if (posts) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(posts);
        }else {
            return res.setHeader('Content-Type', 'application/json')
            .status(400).end('No posts found for this user')
        }
    } catch(err) {
        return res.setHeader('Content-Type', 'application/json')
         .status(400).send(err);
       }
}

const showOnePostRelatedUser = async (_req: Request, res: Response) => {
    try {
        const user_id = parseInt(res.locals.user_id);
        const post_id = parseInt(_req.params.id);
        const post = await store.showOnePostRelatedUser(user_id,post_id);
        if (post) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(post);
        }else {
            return res.setHeader('Content-Type', 'application/json')
            .status(400).end('No posts found for this user')
        }
    } catch(err) {
        return res.setHeader('Content-Type', 'application/json')
         .status(400).send(err);
       }
}

const create = async (_req: Request, res: Response) => {
    try {
        console.log('register');
        const user: userCreate = {
            name: _req.body.name,
            email: _req.body.email,
            password: _req.body.password
        };
    const valid = validateRegisteration(user);
        console.log(JSON.stringify(valid));
        if (valid.isEmpty)
        {
        return res.setHeader('Content-Type', 'application/json')
               .status(400).end('All Fields are required');
        }
        if (!valid.validEmail) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).end('Please enter valid email'); 
        }
        const newUser = await store.create(user);
        createSendToken(newUser,201,_req,res);
    } catch(err) {
     return res.setHeader('Content-Type', 'application/json')
      .status(400).send(err);
    }
}

const destroyPost = async (_req: Request, res: Response) => {
    try {
        const user_id = parseInt(res.locals.user_id);
        const post_id = parseInt(_req.params.id)
        const deleted = await store.deletePost(user_id,post_id);
        if (deleted) {
            res.setHeader('Content-Type', 'application/json')
                .status(204).send(deleted);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No post found with this ID')
            }
    } catch(err) {
        return res.setHeader('Content-Type', 'application/json')
         .status(400).send(err);
       }
}

const authenticate = async (_req: Request, res: Response) => {
  const {email , password} = _req.body;
    try {
        const user = await store.authenticate(email,password);
       
        if(!user){
            res.status(401).json({message : 'error login credintial' });
        }
        else createSendToken(user,200,_req,res);
    } catch(err) {
     return res.setHeader('Content-Type', 'application/json')
      .status(400).send(err);
    }
}

 userRoutes.route('/').get(index)
 userRoutes.route('/register').post(create);
userRoutes.route('/login').post(authenticate);

userRoutes.use(isLogged)  
userRoutes.route('/posts').get(showPostsRelatedUser);  
userRoutes
  .route('/posts/:id')
  .get(showOnePostRelatedUser)
  .patch(edit)
    .delete(destroyPost);  
  

