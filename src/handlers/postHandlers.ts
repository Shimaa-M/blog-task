import express, { Request, Response } from 'express';
import { Post, postStore } from '../models/Post';
import { postCreate } from '../DTO/postCreate.dto';
import { validatePost } from '../utilities/validatePost';
import isLogged from '../utilities/isLogged';
export const postRoutes = express.Router({mergeParams:true});

const store = new postStore();

const index = async (_req: Request, res: Response) => {
    try {
        const posts = await store.index();
        if (posts) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(posts);
        }
        else {
            return res.end('No Posts found');
        }
    } catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
};

const show = async (_req: Request, res: Response) => {
    try {
        const post = await store.show(parseInt(_req.params.id));
        if (post) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(post);
        } else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    } catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
};

const create = async (_req: Request, res: Response) => {
    try {
        const user_id: number = parseInt(res.locals.user_id);
        if (!user_id) {
            return res.setHeader('Content-Type', 'application/json')
                .status(401).end('You are not authorized to write post');
        }
        const post: postCreate = {
            title: _req.body.title,
            content: _req.body.content,
            user_id: user_id
        };
        const isEmpty = validatePost(post);
      
        if (isEmpty) {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('All Fields are required');
        }
        const newPost = await store.create(post);
        if (newPost) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(newPost);
        } else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post is created');
        }

    } catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
};

export const edit = async (_req: Request, res: Response) => {
    try {
        const user_id: number = parseInt(res.locals.user_id);
        if (!user_id) {
            return res.setHeader('Content-Type', 'application/json')
                .status(401).end('You are not authorized to edit post');
        }
        const post: Post = {
            id: parseInt(_req.params.id),
            title: _req.body.title,
            content: _req.body.content,
            user_id: user_id
        };
             
        const updatedPost = await store.edit(post);
        if (updatedPost) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(updatedPost);
        } else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
};

const destroy = async (_req: Request, res: Response) => {
    try {
        const deleted = await store.delete(parseInt(_req.params.id));
        if (deleted) {
            res.setHeader('Content-Type', 'application/json')
                .status(204).send(deleted);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    } catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
};

postRoutes.route('/').get(index);
postRoutes.use(isLogged);
postRoutes.route('/create').post(create);

postRoutes
  .route('/:id')
  .get(show)
  .patch(edit)
  .delete(destroy);
  

export default postRoutes;