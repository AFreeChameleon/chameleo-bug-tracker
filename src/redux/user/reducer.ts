import {
    SET_USER_DATA,

    FETCH_USER_DETAILS_REQUEST,
    FETCH_USER_DETAILS_SUCCESS,
    FETCH_USER_DETAILS_FAILURE,
} from './types';

const defaultState = {
    loading: false,
    errors: [],
    data: {}
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                data: {
                    ...action.user
                }
            }
        case FETCH_USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_USER_DETAILS_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.data
                }
            }
        case FETCH_USER_DETAILS_FAILURE:
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
}

export default reducer;