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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postStore = void 0;
const database_1 = require("../database");
class postStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `select * from "Post"`;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Could not get Posts. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT * FROM "Post" WHERE id=($1) `;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [id]);
                const Post = result.rows[0];
                conn.release();
                return Post;
            }
            catch (err) {
                throw new Error(`Could not find Post ${id}. Error: ${err}`);
            }
        });
    }
    create(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `INSERT INTO "Post" (title,content,user_id) VALUES ($1, $2, $3) RETURNING *`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [p.title, p.content, p.user_id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not add new Post. Error: ${err}`);
            }
        });
    }
    edit(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `UPDATE "Post" SET title=$1 , content=$2, user_id=$3 WHERE id=$4 RETURNING *`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [p.title, p.content, p.user_id, p.id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not update the Post. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `DELETE FROM "Post" WHERE id=($1)`;
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [id]);
                const post = result.rows[0];
                conn.release();
                return post;
            }
            catch (err) {
                throw new Error(`Could not delete Post ${id}. Error: ${err}`);
            }
        });
    }
}
exports.postStore = postStore;
