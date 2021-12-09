import {
    SET_ALERTS
} from './types';

export type Alert = {
    type: 'success' | 'error';
    message: string;
}

export const setAlerts = (value: Alert[]) => ({
    type: SET_ALERTS,
    alerts: value
});