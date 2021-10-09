import {
    SET_ALERTS
} from './types';

const defaultState: string[] = [

];

const reducer = (state = defaultState, action: any) => {
    switch (action.type) {
        case SET_ALERTS:
            return [ ...action.alerts ];
        default:
            return state;
    }
}

export default reducer;