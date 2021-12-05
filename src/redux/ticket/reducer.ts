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

    ARCHIVE_TICKET_REQUEST,
    ARCHIVE_TICKET_SUCCESS,
    ARCHIVE_TICKET_FAILURE,

    FETCH_TICKET_DETAILS_REQUEST,
    FETCH_TICKET_DETAILS_SUCCESS,
    FETCH_TICKET_DETAILS_FAILURE,
} from './types';

const defaultState: any = {
    loading: {
        addTag: false,
        setPriority: false,
        assignedTo: false,
        timeEstimate: false,
        description: false,
        name: false,
        addComment: false,
        editComment: false,
        deleteComment: false,
        archive: false
    },
    errors: [],
    data: {}
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TICKET_DATA:
            return {
                ...state,
                data: {
                    ...action.data
                }
            }

        case FETCH_TICKET_DETAILS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchTicket: true
                }
            }
        case FETCH_TICKET_DETAILS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchTicket: false
                },
                data: {
                    ...action.ticket
                }
            }
        case FETCH_TICKET_DETAILS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchTicket: false
                },
                errors: action.errors
            }

        case ARCHIVE_TICKET_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    archive: true
                }
            }
        case ARCHIVE_TICKET_SUCCESS:
            console.log(action)
            return {
                ...state,
                loading: {
                    ...state.loading,
                    archive: false
                },
                data: {
                    ...action.ticket
                }
            }
        case ARCHIVE_TICKET_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    archive: false
                },
                errors: action.errors
            }
            
        case DELETE_TICKET_COMMENT_REQUEST:
            let deletedComments = [
                ...state.data.comments
            ];
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteComment: true
                },
                data: {
                    ...state.data,
                    comments: [
                        ...deletedComments.filter(c => c.id !== action.commentId)
                    ]
                }
            }
        case DELETE_TICKET_COMMENT_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteComment: false
                },
                data: {
                    ...action.data
                }
            }
        case DELETE_TICKET_COMMENT_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteComment: false
                },
                errors: action.errors
            }

        case EDIT_TICKET_COMMENT_REQUEST:
            let editedComments = [
                ...state.data.comments
            ];
            editedComments.splice(editedComments.findIndex(c => c.id === action.comment.id), 1, {
                creating: true,
                ...action.comment
            });
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editComment: true
                },
                data: {
                    ...state.data,
                    comments: [
                        ...editedComments
                    ]
                }
            }
        case EDIT_TICKET_COMMENT_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editComment: false
                },
                data: {
                    ...action.data
                }
            }
        case EDIT_TICKET_COMMENT_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editComment: false
                },
                errors: action.errors
            }

        case ADD_TICKET_COMMENT_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addComment: true,
                },
                data: {
                    ...state.data,
                    comments: [
                        {
                            creating: true,
                            message: action.message,
                            createdAt: new Date()
                        },
                        ...state.data.comments,
                    ]
                }
            }
        case ADD_TICKET_COMMENT_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addComment: false
                },
                data: {
                    ...action.data
                }
            }
        case ADD_TICKET_COMMENT_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addComment: false
                },
                errors: action.errors
            }

        case SET_TICKET_NAME_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    name: true
                },
                data: {
                    ...state.data,
                    name: action.name
                }
            }
        case SET_TICKET_NAME_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    name: false
                },
                data: {
                    ...action.data
                }
            }
        case SET_TICKET_NAME_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    name: false
                },
                errors: action.errors
            }

        case SET_TICKET_DESCRIPTION_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    description: true
                },
                data: {
                    ...state.data,
                    description: action.description
                }
            }
        case SET_TICKET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    description: false
                },
                data: {
                    ...action.data
                }
            }
        case SET_TICKET_DESCRIPTION_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    description: false
                },
                errors: action.errors
            }

        case SET_TICKET_TIME_ESTIMATE_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    timeEstimate: true
                },
                data: {
                    ...state.data,
                    timeEstimate: action.time
                }
            }
        case SET_TICKET_TIME_ESTIMATE_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    timeEstimate: false
                },
                data: {
                    ...action.data
                }
            }
        case SET_TICKET_TIME_ESTIMATE_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    timeEstimate: false
                },
                errors: action.errors
            }

        case SET_TICKET_ASSIGNED_TO_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    assignedTo: true
                },
                data: {
                    ...state.data,
                    assignedUserId: action.user.id,
                    assignedUser: action.user
                }
            }
        case SET_TICKET_ASSIGNED_TO_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    assignedTo: false
                },
                data: {
                    ...action.data
                }
            }
        case SET_TICKET_ASSIGNED_TO_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    assignedTo: false
                },
                errors: action.errors
            }

        case SET_TICKET_PRIORITY_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setPriority: true
                },
                data: {
                    ...state.data,
                    priority: action.priority
                }
            }
        case SET_TICKET_PRIORITY_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setPriority: false
                },
                data: {
                    ...action.data
                }
            }
        case SET_TICKET_PRIORITY_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setPriority: false
                },
                errors: action.errors
            }

        case SAVE_TICKET_TAGS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addTag: true
                },
                data: {
                    ...state.data,
                    tags: action.tags
                }
            }
        case SAVE_TICKET_TAGS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addTag: false
                },
                data: {
                    ...action.data
                }
            }
        case SAVE_TICKET_TAGS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addTag: false
                },
                errors: action.errors
            }
        default:
            return state;
    }
}

export default reducer;