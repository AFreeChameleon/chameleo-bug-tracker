import axios from 'axios';
import { redirect } from '../components/auth/functions';

export const authenticated = async (ctx) => {
    try {
        if (ctx.req) {
            const res = await axios.post(`${process.env.HOST}/api/logged-in`, {}, 
                { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie } });
            if (res.status !== 200) {
                redirect(ctx, "/login");
                return false;
            }
            return true;
        } else {
            const res = await axios.post('/api/logged-in', {}, 
                { withCredentials: true })
            if (res.status !== 200) {
                redirect(ctx, "/login");
                return false;
            }
            return true;
        }
    } catch (err) {
        console.log(err)
        redirect(ctx, "/login");
    }
}

export const checkPermission = (role: string) => {
    switch (role) {
        case 'Owner':
            return {
                read: true,
                write: true,
                userReadWrite: true,
                priority: 3
            }
        case 'Administrator':
            return {
                read: true,
                write: true,
                userReadWrite: true,
                priority: 2
            }
        case 'User':
            return {
                read: true,
                write: true,
                userReadWrite: false,
                priority: 1
            }
        case 'ReadOnly':
            return {
                read: true,
                write: false,
                userReadWrite: false,
                priority: 0
            }
        default:
            return {
                read: false,
                write: false,
                userReadWrite: false,
                priority: -1
            }
    }
}