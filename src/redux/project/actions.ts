import axios from 'axios';
import {
    SET_PROJECT_DATA,

    FETCH_PROJECT_DETAILS_REQUEST,
    FETCH_PROJECT_DETAILS_SUCCESS,
    FETCH_PROJECT_DETAILS_FAILURE
} from './types';

export const setProjectData = (data: any) => ({
    type: SET_PROJECT_DATA,
    data: data
});

export const fetchProjectDetails = (company: string) => {
    return dispatch => {
        dispatch({
            type: FETCH_PROJECT_DETAILS_REQUEST
        });
        axios.get(`/api/project/details?company=${company}`, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: FETCH_PROJECT_DETAILS_SUCCESS,
                project: res.data.project
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: FETCH_PROJECT_DETAILS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: FETCH_PROJECT_DETAILS_FAILURE,
                    errors: ['An error occurred while getting your details, please try again later.']
                })
            }
        })
    }
}