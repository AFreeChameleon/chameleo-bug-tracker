import { combineReducers } from 'redux';
import alertReducer from './alerts/reducer';
import userReducer from './user/reducer';
import projectReducer from './project/reducer';

const rootReducer = combineReducers({
    alerts: alertReducer,
    user: userReducer,
    project: projectReducer
});

export default rootReducer;