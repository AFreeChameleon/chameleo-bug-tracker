import axios from 'axios';
import {
    SET_USER_DETAILS,

    FETCH_USER_DETAILS_REQUEST,
    FETCH_USER_DETAILS_SUCCESS,
    FETCH_USER_DETAILS_FAILURE,
} from './types';

export const setUserDetails = (user) => ({
    type: SET_USER_DETAILS,
    user: user
});

export const fetchUserData = () => {
    return dispatch => {
        dispatch({
            type: FETCH_USER_DETAILS_REQUEST
        });
        return axios.get('/api/user/details', { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: FETCH_USER_DETAILS_SUCCESS,
                data: { ...res.data.user }
            })
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: FETCH_USER_DETAILS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: FETCH_USER_DETAILS_FAILURE,
                    errors: ['An error occurred while getting your details, please try again later.']
                })
            }
        })
    }
}