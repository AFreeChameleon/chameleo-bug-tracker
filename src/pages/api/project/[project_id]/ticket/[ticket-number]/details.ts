import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../../lib/session';
import { isUserLoggedIn } from '../../../../../../middleware/auth';

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedIn);

handler.get(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        // const company = req.query.company as string;
        // const project = await prisma.project.findFirst({
        //     where: {
        //         userId: req.user.id,
        //         company: company
        //     },
        //     select: {
        //         name: true,
        //         key: true,
        //         company: true,
        //         tickets: {
        //             select: {
        //                 timeEstimate: true,
        //                 status: true,
        //                 priority: true,
        //                 description: true,
        //                 user: {
        //                     select: {
        //                         id: true,
        //                         email: true,
        //                         firstName: true,
        //                         lastName: true
        //                     }
        //                 },
        //                 assignedUserId: true,
        //                 source: true,
        //                 started: true,
        //                 createdAt: true,
        //                 updatedAt: true
        //             }
        //         },
        //         updatedAt: true,
        //         createdAt: true,
        //         user: { 
        //             select: {
        //                 id: true,
        //                 email: true,
        //                 firstName: true,
        //                 lastName: true
        //             }
        //         }
        //     },
        //     orderBy: {
        //         updatedAt: 'asc'
        //     }
        // });
    } catch (err) {
        return res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    }
})

export default handler;