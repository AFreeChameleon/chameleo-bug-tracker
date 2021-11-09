import axios from 'axios';
import {
    SET_PROJECT_DATA,
    SET_PROJECT_DETAILS,

    FETCH_PROJECT_DETAILS_REQUEST,
    FETCH_PROJECT_DETAILS_SUCCESS,
    FETCH_PROJECT_DETAILS_FAILURE,

    UPDATE_PROJECT_DETAILS_REQUEST,
    UPDATE_PROJECT_DETAILS_SUCCESS,
    UPDATE_PROJECT_DETAILS_FAILURE
} from './types';

export const setProjectData = (data: any) => ({
    type: SET_PROJECT_DATA,
    data: data
});

export const fetchProjectDetails = (id: string) => {
    return dispatch => {
        dispatch({
            type: FETCH_PROJECT_DETAILS_REQUEST
        });
        axios.get(`/api/project/${id}/details`, { withCredentials: true })
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

export const setProjectDetails = (id: string, details: any) => {
    return dispatch => {
        dispatch({
            type: UPDATE_PROJECT_DETAILS_REQUEST,
            details
        });
        axios.patch(`/api/project/${id}/details`, {
            details: details
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: UPDATE_PROJECT_DETAILS_SUCCESS,
                project: res.data.project
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: UPDATE_PROJECT_DETAILS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: UPDATE_PROJECT_DETAILS_FAILURE,
                    errors: ['An error occurred while updating your project, please try again later.']
                })
            }
        })
    }
}