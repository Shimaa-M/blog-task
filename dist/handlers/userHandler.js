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
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateRegisteration_1 = require("../utilities/validateRegisteration");
const isLogged_1 = __importDefault(require("../utilities/isLogged"));
exports.userRoutes = express_1.default.Router({ mergeParams: true });
const store = new User_1.userStore();
const createSendToken = (user, statusCode, _req, res) => {
    const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_TOKEN);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
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
};
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield store.index();
        if (users) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(users);
        }
        else {
            return res.end('No users found');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const show = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("nested");
        const user = yield store.show(parseInt(_req.params.id));
        if (user) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(user);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No user found with this ID');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const showPostsRelatedUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(res.locals.user_id);
        const posts = yield store.showPostsRelatedUser(id);
        if (posts) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(posts);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No posts found for this user');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const showOnePostRelatedUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(res.locals.user_id);
        const post_id = parseInt(_req.params.id);
        const post = yield store.showOnePostRelatedUser(user_id, post_id);
        if (post) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(post);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No posts found for this user');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: register
 *         schema:
 *           type: object
 *         required: true
 *         description: {name,email,password}
 *     responses:
 *       201:
 *         description: The user is registered
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user can't be added
 */
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('register');
        const user = {
            name: _req.body.name,
            email: _req.body.email,
            password: _req.body.password
        };
        console.log(user);
        const valid = (0, validateRegisteration_1.validateRegisteration)(user);
        console.log(JSON.stringify(valid));
        if (valid.isEmpty) {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('All Fields are required');
        }
        if (!valid.validEmail) {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('Please enter valid email');
        }
        const newUser = yield store.create(user);
        createSendToken(newUser, 201, _req, res);
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const editPost = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = {
            id: parseInt(_req.params.id),
            title: _req.body.title,
            content: _req.body.content,
            user_id: parseInt(res.locals.user_id)
        };
        const updatedPost = yield store.editPost(post);
        if (updatedPost) {
            res.setHeader('Content-Type', 'application/json')
                .status(200).send(updatedPost);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No post found with this ID to be updated');
        }
    }
    catch (err) {
        res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const destroyPost = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(res.locals.user_id);
        const post_id = parseInt(_req.params.id);
        const deleted = yield store.deletePost(user_id, post_id);
        if (deleted) {
            res.setHeader('Content-Type', 'application/json')
                .status(204).send(deleted);
        }
        else {
            return res.setHeader('Content-Type', 'application/json')
                .status(400).end('No post found with this ID');
        }
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
const authenticate = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = _req.body;
    try {
        const user = yield store.authenticate(email, password);
        if (!user) {
            res.status(401).json({ message: 'error login credintial' });
        }
        else
            createSendToken(user, 200, _req, res);
    }
    catch (err) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400).send(err);
    }
});
exports.userRoutes.route('/').get(index);
exports.userRoutes.route('/register').post(create);
exports.userRoutes.route('/login').post(authenticate);
exports.userRoutes.use(isLogged_1.default);
exports.userRoutes.route('/posts').get(showPostsRelatedUser);
exports.userRoutes
    .route('/posts/:id')
    .get(showOnePostRelatedUser)
    .patch(editPost)
    .delete(destroyPost);
