import axios from 'axios';
import {
    SET_USER_DATA,

    FETCH_USER_DETAILS_REQUEST,
    FETCH_USER_DETAILS_SUCCESS,
    FETCH_USER_DETAILS_FAILURE,

    EDIT_USER_DETAILS_REQUEST,
    EDIT_USER_DETAILS_SUCCESS,
    EDIT_USER_DETAILS_FAILURE,

    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
} from './types';

export const setUserData = (user) => ({
    type: SET_USER_DATA,
    user: user
});

export const deleteUserDetails = () => {
    return dispatch => {
        dispatch({
            type: DELETE_USER_REQUEST
        });
        return axios.patch(`/api/user/delete`, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: DELETE_USER_SUCCESS
            });
        }).catch((err) => {
            if (err.response) {
                dispatch({
                    type: DELETE_USER_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: DELETE_USER_FAILURE,
                    errors: ['An error occurred while deleting you, please try again later.']
                })
            }
        })
    }
}

export const editUserDetails = ({ firstName, lastName, email }) => {
    return dispatch => {
        dispatch({
            type: EDIT_USER_DETAILS_REQUEST
        });
        return axios.patch(`/api/user/edit`, {
            firstName: firstName,
            lastName: lastName,
            email: email
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: EDIT_USER_DETAILS_SUCCESS,
                user: res.data.user
            });
        }).catch((err) => {
            if (err.response) {
                dispatch({
                    type: EDIT_USER_DETAILS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: EDIT_USER_DETAILS_FAILURE,
                    errors: ['An error occurred while setting your details, please try again later.']
                })
            }
        })
    }
}

export const fetchUserData = () => {
    return dispatch => {
        dispatch({
            type: FETCH_USER_DETAILS_REQUEST
        });
        return axios.get('/api/user/details', { withCredentials: true })
        .then((res: any) => {
            console.log(res.data)
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