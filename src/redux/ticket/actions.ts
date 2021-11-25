import axios from 'axios';
import {
    SET_TICKET_DATA,

    SAVE_TICKET_TAGS_REQUEST,
    SAVE_TICKET_TAGS_SUCCESS,
    SAVE_TICKET_TAGS_FAILURE,

    SET_TICKET_PRIORITY_REQUEST,
    SET_TICKET_PRIORITY_SUCCESS,
    SET_TICKET_PRIORITY_FAILURE,

    SET_TICKET_ASSIGNED_TO_REQUEST,
    SET_TICKET_ASSIGNED_TO_SUCCESS,
    SET_TICKET_ASSIGNED_TO_FAILURE,

    SET_TICKET_TIME_ESTIMATE_REQUEST,
    SET_TICKET_TIME_ESTIMATE_SUCCESS,
    SET_TICKET_TIME_ESTIMATE_FAILURE,

    SET_TICKET_DESCRIPTION_REQUEST,
    SET_TICKET_DESCRIPTION_SUCCESS,
    SET_TICKET_DESCRIPTION_FAILURE,
    
    SET_TICKET_NAME_REQUEST,
    SET_TICKET_NAME_SUCCESS,
    SET_TICKET_NAME_FAILURE,

    ADD_TICKET_COMMENT_REQUEST,
    ADD_TICKET_COMMENT_SUCCESS,
    ADD_TICKET_COMMENT_FAILURE,

    EDIT_TICKET_COMMENT_REQUEST,
    EDIT_TICKET_COMMENT_SUCCESS,
    EDIT_TICKET_COMMENT_FAILURE,

    DELETE_TICKET_COMMENT_REQUEST,
    DELETE_TICKET_COMMENT_SUCCESS,
    DELETE_TICKET_COMMENT_FAILURE,
} from './types';

export const setTicketData = (data: any) => ({
    type: SET_TICKET_DATA,
    data: data
});

export const deleteComment = (projectId: string, ticketNumber: number, commentId: number) => {
    return dispatch => {
        dispatch({
            type: DELETE_TICKET_COMMENT_REQUEST,
            commentId: commentId
        });
        return axios.delete(`/api/project/${projectId}/ticket/${ticketNumber}/comments/${commentId}/delete`, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: DELETE_TICKET_COMMENT_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: DELETE_TICKET_COMMENT_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: DELETE_TICKET_COMMENT_FAILURE,
                    errors: ['An error occurred while deleting your comment, please try again later.']
                });
            }
        });
    }
}

export const editComment = (projectId: string, ticketNumber: number, comment: any) => {
    return dispatch => {
        dispatch({
            type: EDIT_TICKET_COMMENT_REQUEST,
            comment: comment
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/comments/${comment.id}/edit`, {
            message: comment.message
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: EDIT_TICKET_COMMENT_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: EDIT_TICKET_COMMENT_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: EDIT_TICKET_COMMENT_FAILURE,
                    errors: ['An error occurred while editing your comment, please try again later.']
                });
            }
        });
    }
}

export const createComment = (projectId: string, ticketNumber: number, message: string) => {
    return dispatch => {
        dispatch({
            type: ADD_TICKET_COMMENT_REQUEST,
            message: message
        });
        return axios.post(`/api/project/${projectId}/ticket/${ticketNumber}/comments/new`, {
            message: message
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: ADD_TICKET_COMMENT_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: ADD_TICKET_COMMENT_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: ADD_TICKET_COMMENT_FAILURE,
                    errors: ['An error occurred while changing the name, please try again later.']
                })
            }
        })
    }
}

export const setTicketName = (projectId: string, ticketNumber: number, name: string) => {
    return dispatch => {
        dispatch({
            type: SET_TICKET_NAME_REQUEST,
            name: name
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/name`, {
            name: name
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SET_TICKET_NAME_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_TICKET_NAME_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: SET_TICKET_NAME_FAILURE,
                    errors: ['An error occurred while changing the name, please try again later.']
                })
            }
        })
    }
}

export const setTicketDescription = (projectId: string, ticketNumber: number, description: string) => {
    return dispatch => {
        dispatch({
            type: SET_TICKET_DESCRIPTION_REQUEST,
            description: description
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/description`, {
            description: description
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SET_TICKET_DESCRIPTION_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_TICKET_DESCRIPTION_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: SET_TICKET_DESCRIPTION_FAILURE,
                    errors: ['An error occurred while changing the description, please try again later.']
                })
            }
        })
    }
}

export const setTicketTimeEstimate = (projectId: string, ticketNumber: number, time: string) => {
    return dispatch => {
        dispatch({
            type: SET_TICKET_TIME_ESTIMATE_REQUEST,
            time: time
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/time-estimate`, {
            time: time
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SET_TICKET_TIME_ESTIMATE_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_TICKET_TIME_ESTIMATE_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: SET_TICKET_TIME_ESTIMATE_FAILURE,
                    errors: ['An error occurred while changing the time estimate, please try again later.']
                })
            }
        })
    }
}

export const setTicketAssignedTo = (projectId: string, ticketNumber: number, user: any) => {
    return dispatch => {
        dispatch({
            type: SET_TICKET_ASSIGNED_TO_REQUEST,
            user: user
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/assigned-to`, {
            email: user.email
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SET_TICKET_ASSIGNED_TO_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SET_TICKET_ASSIGNED_TO_FAILURE,
                    errors: err.response.errors
                });
            } else {
                dispatch({
                    type: SET_TICKET_ASSIGNED_TO_FAILURE,
                    errors: ['An error occurred while assigning this ticket, please try again later.']
                })
            }
        })
    }
}

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
            type: SAVE_TICKET_TAGS_REQUEST,
            tags: tags
        });
        return axios.patch(`/api/project/${projectId}/ticket/${ticketNumber}/tags`, {
            tags: tags
        }, { withCredentials: true })
        .then((res: any) => {
            dispatch({
                type: SAVE_TICKET_TAGS_SUCCESS,
                data: res.data.ticket
            });
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: SAVE_TICKET_TAGS_FAILURE,
                    errors: err.response.errors  
                });
            } else {
                dispatch({
                    type: SAVE_TICKET_TAGS_FAILURE,
                    errors: ['An error occurred while adding the tag, please try again later.']
                })
            }
        })
    }
}