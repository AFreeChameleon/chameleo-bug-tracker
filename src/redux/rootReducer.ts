import { combineReducers } from 'redux';
import alertReducer from './alerts/reducer';
import userReducer from './user/reducer';

const rootReducer = combineReducers({
    alerts: alertReducer,
    user: userReducer
});

export default rootReducer;