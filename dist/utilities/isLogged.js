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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const jwtToken = process.env.JWT_TOKEN;
const store = new User_1.userStore();
const isLogged = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (_req.headers.authorization && _req.headers.authorization.startsWith('Bearer')) {
        token = _req.headers.authorization.split(' ')[1];
    }
    else if (_req.cookies.jwt) {
        token = _req.cookies.jwt;
    }
    if (token) {
        try {
            // 1) verify token
            const decoded = yield jsonwebtoken_1.default.verify(_req.cookies.jwt, jwtToken);
            const userFound = Object.values(decoded)[0];
            const id = Object.values(userFound)[0];
            const currentUser = yield store.show(parseInt(id));
            if (currentUser == undefined) {
                res.status(401).send("user not found");
            }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            res.locals.user_id = id;
            next();
        }
        catch (err) {
            res.status(401).send("Not authorized");
        }
    }
    else {
        res.status(401).send("Not authorized");
    }
});
exports.default = isLogged;
