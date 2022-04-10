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
exports.userStore = void 0;
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const pepper = process.env.BCRYPT_PASSWORD;
class userStore {
    /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - name
   *         - email
   *         - password
   *       properties:
   *         id:
   *           type: number
   *           description: The auto-generated id of the user
   *         name:
   *           type: string
   *           description: The user name
   *         email:
   *           type: string
   *           description: The user email
   *       example:
   *         id: 1
   *         name: Shimaa Mahmoud
   *         email: engshimaamahmoud@gmail.com
   *         password: xxxxxxxxxx
   */
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: The Users managing API
     */
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Returns the list of all the users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: The list of the users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `select * from "User" `;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Could not get users. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT * FROM "User" WHERE id=($1)`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [id]);
                const user = result.rows[0];
                conn.release();
                return user;
            }
            catch (err) {
                throw new Error(`Could not find user ${id}. Error: ${err}`);
            }
        });
    }
    showPostsRelatedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT "Post".id as post_id,"User".name,"Post".title,"Post".content 
                   FROM "User" 
                  Inner JOIN "Post" 
                  ON "User".id = "Post".user_id
                  WHERE "User".id=($1)`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [id]);
                const posts = result.rows;
                conn.release();
                return posts;
            }
            catch (err) {
                throw new Error(`Could not find posts rellated to user ${id}. Error: ${err}`);
            }
        });
    }
    showOnePostRelatedUser(user_id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT "Post".id as post_id,"User".name,"Post".title,"Post".content 
                   FROM "User" 
                  Inner JOIN "Post" 
                  ON "User".id = "Post".user_id
                  WHERE "User".id=($1) AND "Post".id=($2)`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [user_id, post_id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not find post with this id ${post_id}. Error: ${err}`);
            }
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `INSERT INTO "User" (name,email,password) VALUES ($1, $2, $3) RETURNING *`;
                const hash = bcrypt_1.default.hashSync(u.password + pepper, saltRounds);
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [u.name, u.email, hash]);
                const user = result.rows[0];
                conn.release();
                return user;
            }
            catch (err) {
                throw new Error(`Could not add new user. Error: ${err}`);
            }
        });
    }
    editPost(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `UPDATE "User" SET name=$1 , email=$2, password=$3 FROM "Post" WHERE "User".id= RETURNING *`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [p.title, p.content, p.user_id, p.id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not update the user. Error: ${err}`);
            }
        });
    }
    deletePost(user_id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `DELETE FROM "Post" P Using "User" as U WHERE U.id=($1) AND P.id=($2);`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [user_id, post_id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not delete post ${post_id}. Error: ${err}`);
            }
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM "User" WHERE email=($1)`;
                const result = yield conn.query(sql, [email]);
                if (result.rowCount == 1) {
                    const user = result.rows[0];
                    if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                        return user;
                    }
                }
                return null;
            }
            catch (err) {
                throw new Error(`Could not authenticate user . Error: ${err}`);
            }
        });
    }
}
exports.userStore = userStore;
