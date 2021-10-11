import {
    SET_PROJECT_DATA
} from './types';

const defaultState = {
    loading: false,
    errors: [],
    data: {

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
        default:
            return state;
    }
}

export default reducer;