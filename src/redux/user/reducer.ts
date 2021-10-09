import {
    SET_USER_DETAILS
} from './types';

const defaultState = {
    firstName: '',
    lastName: '',
    email: '',
    notifications: [],
    projects: []
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER_DETAILS:
            return {
                ...state,
                ...action.user
            }
        default:
            return state;
    }
}

export default reducer;