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
} from './types';

const defaultState = {
    loading: {
        deleteColumn: false,
        updateDetails: false,
        fetchDetails: false,
        fetchArchivedTickets: false
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
                    // ...state.data,
                    ...action.data
                }
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