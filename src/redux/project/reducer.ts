import {
    SET_PROJECT_DATA,

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

    ADD_USER_TO_PROJECT_REQUEST,
    ADD_USER_TO_PROJECT_SUCCESS,
    ADD_USER_TO_PROJECT_FAILURE,

    CHANGE_USER_PERMISSIONS_REQUEST,
    CHANGE_USER_PERMISSIONS_SUCCESS,
    CHANGE_USER_PERMISSIONS_FAILURE,
} from './types';

const defaultState = {
    loading: {
        deleteColumn: false,
        updateDetails: false,
        fetchDetails: false,
        fetchArchivedTickets: false,
        setArchivedTickets: false,
        restoreTickets: false,
        deleteTickets: false,
        addUser: false,
        changePermissions: false
    },
    errors: [],
    data: {}
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_PROJECT_DATA:
            return {
                ...state,
                data: {
                    ...action.data
                }
            }

        case CHANGE_USER_PERMISSIONS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    changePermissions: true
                }
            }
        case CHANGE_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    changePermissions: false
                },
                data: {
                    ...action.project
                }
            }
        case CHANGE_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    changePermissions: false
                },
                errors: action.errors
            }

        case ADD_USER_TO_PROJECT_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addUser: true
                }
            }
        case ADD_USER_TO_PROJECT_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addUser: false
                },
                data: {
                    ...action.project
                }
            }
        case ADD_USER_TO_PROJECT_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    addUser: false
                },
                errors: action.errors
            }

        case DELETE_TICKETS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteTickets: true
                }
            }
        case DELETE_TICKETS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteTickets: false
                },
                data: {
                    ...action.project
                }
            }
        case DELETE_TICKETS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteTickets: false
                },
                errors: action.errors
            }

        case SET_ARCHIVED_TICKETS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setArchivedTickets: true
                }
            }
        case SET_ARCHIVED_TICKETS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setArchivedTickets: false
                },
                data: {
                    ...action.project
                }
            }
        case SET_ARCHIVED_TICKETS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setArchivedTickets: false
                },
                errors: action.errors
            }

        case RESTORE_TICKETS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    restoreTickets: true
                }
            }
        case RESTORE_TICKETS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    restoreTickets: false
                },
                data: {
                    ...action.project
                }
            }
        case RESTORE_TICKETS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    restoreTickets: false
                },
                errors: action.errors
            }

        case FETCH_ARCHIVED_TICKETS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchArchivedTickets: true
                }
            }
        case FETCH_ARCHIVED_TICKETS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchArchivedTickets: false
                },
                data: {
                    ...state.data,
                    archivedTickets: action.tickets
                }
            }
        case FETCH_ARCHIVED_TICKETS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchArchivedTickets: false
                },
                errors: action.errors
            }
            
        case DELETE_PROJECT_COLUMN_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteColumn: true
                }
            }
        case DELETE_PROJECT_COLUMN_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteColumn: false
                },
                data: {
                    ...action.project
                }
            }
        case DELETE_PROJECT_COLUMN_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteColumn: false
                },
                errors: action.errors
            }

        case UPDATE_PROJECT_DETAILS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    updateDetails: true
                },
                data: {
                    ...state.data,
                    details: {
                        ...action.details
                    }
                }
            }
        case UPDATE_PROJECT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    updateDetails: false
                },
                errors: [],
                data: {
                    ...action.project
                }
            }
        case UPDATE_PROJECT_DETAILS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    updateDetails: false
                },
                errors: action.errors
            }
        case FETCH_PROJECT_DETAILS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchDetails: true
                }
            }
        case FETCH_PROJECT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchDetails: false
                },
                data: action.project,
                errors: []
            }
        case FETCH_PROJECT_DETAILS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchDetails: false
                },
                errors: action.errors
            }
        default:
            return state;
    }
}

export default reducer;