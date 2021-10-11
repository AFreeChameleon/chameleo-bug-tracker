import {
    SET_PROJECT_DATA
} from './types';

export const setProjectData = (data: any) => ({
    type: SET_PROJECT_DATA,
    data: data
})