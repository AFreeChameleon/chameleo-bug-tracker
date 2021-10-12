import {
    SET_PROJECT_DATA,

    FETCH_PROJECT_DETAILS_REQUEST,
    FETCH_PROJECT_DETAILS_SUCCESS,
    FETCH_PROJECT_DETAILS_FAILURE
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
                    ...state.data,
                    ...action.data
                }
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