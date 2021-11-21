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
} from './types';

const defaultState = {
    loading: {
        addTag: false,
        setPriority: false,
        assignedTo: false,
        timeEstimate: false,
        description: false,
        name: false
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