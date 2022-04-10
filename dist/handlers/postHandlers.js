"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Post_1 = require("../models/Post");
const validatePost_1 = require("../utilities/validatePost");
const isLogged_1 = __importDefault(require("../utilities/isLogged"));
exports.postRoutes = express_1.default.Router({ mergeParams: true });
const store = new Post_1.postStore();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield store.index();
        if (posts) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(posts);
        }
        else {
            return res.end('No Posts found');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const show = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield store.show(parseInt(_req.params.id));
        if (post) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(post);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(res.locals.user_id);
        if (!user_id) {
            return res.setHeader('Content-Type', 'application/json')
                .status(401).end('You are not authorized to write post');
        }
        const post = {
            title: _req.body.title,
            content: _req.body.content,
            user_id: user_id
        };
        console.log(post);
        const isEmpty = (0, validatePost_1.validatePost)(post);
        if (isEmpty) {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('All Fields are required');
        }
        const newPost = yield store.create(post);
        if (newPost) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(newPost);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post is created');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const edit = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(res.locals.user_id);
        if (!user_id) {
            return res.setHeader('Content-Type', 'application/json')
                .status(401).end('You are not authorized to edit post');
        }
        const post = {
            id: parseInt(_req.params.id),
            title: _req.body.title,
            content: _req.body.content,
            user_id: user_id
        };
        const updatedPost = yield store.edit(post);
        if (updatedPost) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(updatedPost);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    }
    catch (err) {
        res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const destroy = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield store.delete(parseInt(_req.params.id));
        if (deleted) {
            res.setHeader('Content-Type', 'application/json')
                .status(204).send(deleted);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No Post found with this ID');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
exports.postRoutes.route('/').get(index);
exports.postRoutes.use(isLogged_1.default);
exports.postRoutes.route('/create').post(create);
exports.postRoutes
    .route('/:id')
    .get(show)
    .patch(edit)
    .delete(destroy);
// const postRoutes = (app: express.Application) => {
//   app.get('/all-posts', index)
//   app.get('/posts/:id', show)
//   app.post('/create-post',isLogged, create)
//   app.delete('/posts/:id',isLogged, destroy)
//   app.put('/posts/:id',isLogged, edit)
// };
exports.default = exports.postRoutes;
