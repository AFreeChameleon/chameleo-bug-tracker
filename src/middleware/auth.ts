import { NextApiRequest, NextApiResponse } from 'next';
import { prisma }  from '../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../lib/session';

type NextFunction = (req: NextApiRequestWithSession, res: NextApiResponse) => void;

export const isUserLoggedIn = async (req: NextApiRequestWithSession, res: NextApiResponse, next: NextFunction) => {
    try {
        const id = req.session.get('user') || -1;
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if (user) {
            req.user = user;
            next(req, res)
        } else {
            return res.status(404).json({
                errors: ['User doesn\'t exist.']
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            errors: ['An error occurred while']
        });
    }
}