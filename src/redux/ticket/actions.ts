import axios from 'axios';
import {
    SET_TICKET_DATA,

    ADD_TAG_TO_TICKET_REQUEST,
    ADD_TAG_TO_TICKET_SUCCESS,
    ADD_TAG_TO_TICKET_FAILURE,

    SET_TICKET_PRIORITY_REQUEST,
    SET_TICKET_PRIORITY_SUCCESS,
    SET_TICKET_PRIORITY_FAILURE
} from './types';

export const setTicketData = (data: any) => ({
    type: SET_TICKET_DATA,
    data: data
});

export const setTicketPriority = (projectId: string, ticketNumber: number, priority: string) => {
    return dispatch => {
        dispatch({
            type: SET_TICKET_PRIORITY_REQUEST,
            priority: priority
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/priority`, {
            priority: priority,
        }, { withCredentials: true })
        .then((res: any) => {
            console.log(res.data)
            dispatch({
                type: SET_TICKET_PRIORITY_SUCCESS,
                data: res.data.ticket 
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_TICKET_PRIORITY_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: SET_TICKET_PRIORITY_FAILURE,
                    errors: ['An error occurred while changing the priority, please try again later.']
                })
            }
        })
    }
}

export const saveTicketTags = (projectId: string, ticketNumber: number, tags: any[] = []) => {
    return dispatch => {
        dispatch({
            type: ADD_TAG_TO_TICKET_REQUEST,
            tags: tags
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/tags`, {
            tags: tags
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: ADD_TAG_TO_TICKET_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: ADD_TAG_TO_TICKET_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: ADD_TAG_TO_TICKET_FAILURE,
                    errors: ['An error occurred while adding the tag, please try again later.']
                })
            }
        })
    }
}