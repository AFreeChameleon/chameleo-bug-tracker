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