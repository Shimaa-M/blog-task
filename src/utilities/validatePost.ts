import { postCreate } from '../DTO/postCreate.dto';

export const validatePost = (post: postCreate): boolean => {
    const isEmpty = Object.values(post).includes('');
    return isEmpty;
};

