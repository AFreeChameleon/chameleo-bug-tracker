import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { prisma }  from '../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../lib/session';

export const isUserLoggedIn = async (req: NextApiRequestWithSession, res: NextApiResponse, next: NextHandler) => {
    try {
        const id = req.session.get('user') || -1;
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });
        if (user) {
            req.user = user;
            next();
        } else {
            throw new Error('User doesn\'t exist.');
        }
    } catch (err) {
        console.log(err)
        throw new Error('An error occurred while getting your details.');
    }
}