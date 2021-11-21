import { combineReducers } from 'redux';
import alertReducer from './alerts/reducer';
import userReducer from './user/reducer';
import projectReducer from './project/reducer';
import ticketReducer from './ticket/reducer';

const rootReducer = combineReducers({
    alerts: alertReducer,
    user: userReducer,
    project: projectReducer,
    ticket: ticketReducer
});

export default rootReducer;