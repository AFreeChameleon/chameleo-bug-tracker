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

const defaultState = {
    loading: false,
    errors: [],
    data: {
        tickets: []
    }
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
        case UPDATE_PROJECT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
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
                loading: false,
                errors: [],
                data: {
                    ...action.project
                }
            }
        case UPDATE_PROJECT_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.errors
            }
        case FETCH_PROJECT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_PROJECT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.project,
                errors: []
            }
        case FETCH_PROJECT_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.errors
            }
        default:
            return state;
    }
}

export default reducer;