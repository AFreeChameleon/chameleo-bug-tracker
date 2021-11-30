import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';

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
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                notifications: true,
                projects: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                    }
                },
                roles: {
                    select: {
                        createdAt: true,
                        updatedAt: true,
                        role: true,
                        projectId: true
                    }
                },
                history: {
                    take: 5,
                    distinct: ['ticketId'],
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        projectId: true,
                        ticketId: true,
                        createdAt: true,
                        updatedAt: true,
                        project: true,
                        ticket: true
                    }
                }
            }
        });
        return res.json({
            user: user
        });
    } catch (err) {
        console.log(err)
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting your details, please try again later.']
        });
    }
})

export default handler;