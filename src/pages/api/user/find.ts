import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../middleware/auth';
import { checkPermission } from '../../../lib/auth';
import { getProject } from '../../../lib/db';

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred. Please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedInWithRole);

handler.post(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const { email } = req.body;
        
        const userResults = await prisma.user.findMany({
            where: {
                email: email,
                // ! ADD IN AFTER DEVELOPMENT FINISHED
                // NOT: [
                //     { id: req.user.id }
                // ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return res.json({
            users: userResults
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while finding this user, please try again later.']
        })
    }
});

export default handler;