import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import { salt } from '../../lib/db';
import { sendVerifyEmail } from '../../lib/mail';
import withSession, { NextApiRequestWithSession, session } from '../../lib/session';
import { isUserLoggedIn } from '../../middleware/auth';

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

handler.use(session);
handler.use(isUserLoggedIn);

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        req.user = null;
        req.session.destroy();
        return res.json({
            message: 'Logged out.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: ['An error occurred while logging you out, please try again later.']
        });
    }
})

export default handler;