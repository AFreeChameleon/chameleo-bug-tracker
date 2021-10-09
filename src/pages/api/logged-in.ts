import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../lib/session';
import { isUserLoggedIn } from '../../middleware/auth';

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            isUserLoggedIn(req, res, postLoggedIn);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const postLoggedIn = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    return res.json({
        logged_in: true
    });
}