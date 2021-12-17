import {
    SET_USER_DATA,

    FETCH_USER_DETAILS_REQUEST,
    FETCH_USER_DETAILS_SUCCESS,
    FETCH_USER_DETAILS_FAILURE,

    EDIT_USER_DETAILS_REQUEST,
    EDIT_USER_DETAILS_SUCCESS,
    EDIT_USER_DETAILS_FAILURE,

    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
} from './types';

const defaultState = {
    loading: {
        fetchUser: false,
        editUser: false,
        deleteUser: false,
    },
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
        case DELETE_USER_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteUser: true
                }
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteUser: false
                },
                data: {
                    ...action.user
                }
            }
        case EDIT_USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editUser: true
                }
            }
        case EDIT_USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editUser: false
                },
                data: {
                    ...action.user
                }
            }
        case EDIT_USER_DETAILS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    editUser: false
                },
                errors: action.errors
            }
        case FETCH_USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchUser: true
                }
            }
        case FETCH_USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchUser: false
                },
                data: {
                    ...action.data
                }
            }
        case FETCH_USER_DETAILS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    fetchUser: false
                },
                errors: action.errors
            }
        default:
            return state;
    }
}

export default reducer;