import {
    SET_USER_DETAILS
} from './types';

export const setUserDetails = (user) => ({
    type: SET_USER_DETAILS,
    user: user
})