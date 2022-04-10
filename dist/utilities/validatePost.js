"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePost = void 0;
const validatePost = (post) => {
    const isEmpty = Object.values(post).includes('');
    return isEmpty;
};
exports.validatePost = validatePost;
