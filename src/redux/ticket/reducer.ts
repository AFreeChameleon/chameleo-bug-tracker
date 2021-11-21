import {
    SET_TICKET_DATA,

    ADD_TAG_TO_TICKET_REQUEST,
    ADD_TAG_TO_TICKET_SUCCESS,
    ADD_TAG_TO_TICKET_FAILURE,

    SET_TICKET_PRIORITY_REQUEST,
    SET_TICKET_PRIORITY_SUCCESS,
    SET_TICKET_PRIORITY_FAILURE
} from './types';

const defaultState = {
    loading: {
        addTag: false,
        setPriority: false
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
        case ADD_TAG_TO_TICKET_REQUEST:
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
        case ADD_TAG_TO_TICKET_SUCCESS:
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
        case ADD_TAG_TO_TICKET_FAILURE:
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