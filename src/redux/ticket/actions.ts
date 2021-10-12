import axios from 'axios';
import {
    SET_TICKET_DATA,

    FETCH_TICKET_DATA_REQUEST,
    FETCH_TICKET_DATA_SUCCESS,
    FETCH_TICKET_DATA_FAILURE,
} from './types';

export const fetchTickets = () => {
    return dispatch => {
        dispatch({
            type: FETCH_TICKET_DATA_REQUEST
        });
        return axios.get('/api/ticket/details', { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: FETCH_TICKET_DATA_SUCCESS,
                data: res.data.tickets
            })
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: FETCH_TICKET_DATA_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: FETCH_TICKET_DATA_FAILURE,
                    errors: ['An error occurred while getting your details, please try again later.']
                })
            }
        })
    }
}