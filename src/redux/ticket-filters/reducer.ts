import {
    SET_TICKET_FILTER_OWNERS,
    SET_TICKET_FILTER_TITLE
} from './types';

const defaultState = {
    owners: [],
    title: ''
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TICKET_FILTER_OWNERS:
            return {
                ...state,
                owners: [ ...action.value ]
            };
        case SET_TICKET_FILTER_TITLE:
            return {
                ...state,
                title: action.value
            }
        default:
            return state;
    }
}

export default reducer;