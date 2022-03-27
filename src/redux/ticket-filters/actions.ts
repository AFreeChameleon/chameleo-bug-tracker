import {
    SET_TICKET_FILTER_OWNERS,
    SET_TICKET_FILTER_TITLE
} from './types';

export const setTicketFilterOwners = (value: any[]) => ({
    type: SET_TICKET_FILTER_OWNERS,
    value: value
});

export const setTicketFilterTitle = (value: string) => ({
    type: SET_TICKET_FILTER_TITLE,
    value: value
});