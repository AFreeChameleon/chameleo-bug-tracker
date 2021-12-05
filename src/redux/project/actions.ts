import axios from 'axios';
import { fetchTicketDetails } from '../ticket/actions';
import {
    SET_PROJECT_DATA,
    SET_PROJECT_DETAILS,

    FETCH_PROJECT_DETAILS_REQUEST,
    FETCH_PROJECT_DETAILS_SUCCESS,
    FETCH_PROJECT_DETAILS_FAILURE,

    UPDATE_PROJECT_DETAILS_REQUEST,
    UPDATE_PROJECT_DETAILS_SUCCESS,
    UPDATE_PROJECT_DETAILS_FAILURE,

    DELETE_PROJECT_COLUMN_REQUEST,
    DELETE_PROJECT_COLUMN_SUCCESS,
    DELETE_PROJECT_COLUMN_FAILURE,
    
    FETCH_ARCHIVED_TICKETS_REQUEST,
    FETCH_ARCHIVED_TICKETS_SUCCESS,
    FETCH_ARCHIVED_TICKETS_FAILURE,

    RESTORE_TICKETS_REQUEST,
    RESTORE_TICKETS_SUCCESS,
    RESTORE_TICKETS_FAILURE,

    SET_ARCHIVED_TICKETS_REQUEST,
    SET_ARCHIVED_TICKETS_SUCCESS,
    SET_ARCHIVED_TICKETS_FAILURE,

    DELETE_TICKETS_REQUEST,
    DELETE_TICKETS_SUCCESS,
    DELETE_TICKETS_FAILURE,
} from './types';

export const setProjectData = (data: any) => ({
    type: SET_PROJECT_DATA,
    data: data
});

export const deleteTickets = (id: string, ticketNumbers: number[]) => {
    return dispatch => {
        dispatch({
            type: DELETE_TICKETS_REQUEST
        });
        return axios.post(`/api/project/${id}/ticket/delete`, {
            ticketNumbers: ticketNumbers
        }).then((res: any) => {
            dispatch({
                type: DELETE_TICKETS_SUCCESS,
                project: res.data.project
            });
        }).catch((err) => {
            if (err.response) {
                dispatch({
                    type: DELETE_TICKETS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: DELETE_TICKETS_FAILURE,
                    errors: ['An error occurred while deleting these tickets, please try again later.']
                });
            }
        })
    }
}

export const setArchivedTickets = (id: string, ticketNumbers: number[], archived: boolean, refresh: boolean = false) => {
    return dispatch => {
        dispatch({
            type: SET_ARCHIVED_TICKETS_REQUEST
        });
        return axios.patch(`/api/project/${id}/ticket/archive`, {
            ticketNumbers: ticketNumbers,
            archived: archived
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SET_ARCHIVED_TICKETS_SUCCESS,
                project: res.data.project
            });
            if (refresh) {
                dispatch(fetchTicketDetails(id, ticketNumbers[0]));
            }
            dispatch(fetchArchivedTickets(id));
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_ARCHIVED_TICKETS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: SET_ARCHIVED_TICKETS_FAILURE,
                    errors: ['An error occurred while restoring these tickets, please try again later.']
                })
            }
        })
    }
}

export const restoreTickets = (id: string, ticketNumbers: number[]) => {
    return dispatch => {
        dispatch({
            type: RESTORE_TICKETS_REQUEST
        });
        axios.patch(`/api/project/${id}/ticket/restore`, {
            ticketNumbers: ticketNumbers
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: RESTORE_TICKETS_SUCCESS,
                project: res.data.project
            });
            dispatch(fetchArchivedTickets(id));
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: RESTORE_TICKETS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: RESTORE_TICKETS_FAILURE,
                    errors: ['An error occurred while restoring these tickets, please try again later.']
                })
            }
        })
    }
}

export const fetchArchivedTickets = (id: string) => {
    return dispatch => {
        dispatch({
            type: FETCH_ARCHIVED_TICKETS_REQUEST
        });
        axios.get(`/api/project/${id}/ticket/archived`, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: FETCH_ARCHIVED_TICKETS_SUCCESS,
                tickets: res.data.tickets
            });
        }).catch((err: any) => {
            if (err.response) {
                dispatch({
                    type: FETCH_ARCHIVED_TICKETS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: FETCH_ARCHIVED_TICKETS_FAILURE,
                    errors: ['An error occurred while getting your archived tickets, please try again later.']
                })
            }
        })
    }
}

export const deleteProjectColumn = (id: string, colId: string, method: string, colIdToMoveTo: string | null = null) => {
    return dispatch => {
        dispatch({
            type: DELETE_PROJECT_COLUMN_REQUEST
        });
        axios.post(`/api/project/${id}/column/delete`, {
            column_id: colId,
            method: method,
            backup_column_id: colIdToMoveTo
        }).then((res: any) => {
            dispatch({
                type: DELETE_PROJECT_COLUMN_SUCCESS,
                project: res.data.project
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: DELETE_PROJECT_COLUMN_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: DELETE_PROJECT_COLUMN_FAILURE,
                    errors: ['An error occurred while getting your details, please try again later.']
                })
            }
        });
    }
}

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