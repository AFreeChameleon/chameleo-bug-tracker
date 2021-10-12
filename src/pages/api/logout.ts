import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import { salt } from '../../lib/db';
import { sendVerifyEmail } from '../../lib/mail';
import withSession, { NextApiRequestWithSession } from '../../lib/session';
import { isUserLoggedIn } from '../../middleware/auth';

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            isUserLoggedIn(req, res, postLogout);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const postLogout = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
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
}