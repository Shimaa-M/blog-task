"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.POSTGRES_DIALECT = exports.POSTGRES_PASSWORD = exports.POSTGRES_USER = exports.POSTGRES_DB = exports.POSTGRES_HOST = exports.POSTGRES_DRIVER = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
if (process.env.ENV === 'prod') {
    const client = new pg_1.Pool({
        host: "POSTGRES_HOST_PROD",
        database: "POSTGRES_DB_PROD",
        user: "POSTGRES_USER_PROD",
        password: "POSTGRES_PASSWORD_PROD"
    });
}
_a = process.env, exports.POSTGRES_DRIVER = _a.POSTGRES_DRIVER, exports.POSTGRES_HOST = _a.POSTGRES_HOST, exports.POSTGRES_DB = _a.POSTGRES_DB, exports.POSTGRES_USER = _a.POSTGRES_USER, exports.POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, exports.POSTGRES_DIALECT = _a.POSTGRES_DIALECT;
exports.client = new pg_1.Pool({
    host: exports.POSTGRES_HOST,
    database: exports.POSTGRES_DB,
    user: exports.POSTGRES_USER,
    password: exports.POSTGRES_PASSWORD
});
exports.default = exports.client;
