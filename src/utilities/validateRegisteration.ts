import { userCreate } from '../DTO/userCreate.dto';

export const validateRegisteration = (user: userCreate) => {
    const isEmpty = Object.values(user).includes('');
    
    const validEmail = String(user.email).toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return { isEmpty, validEmail };
};

