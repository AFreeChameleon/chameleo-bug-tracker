import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../middleware/auth';
import { checkPermission } from '../../../lib/auth';
import { getProject } from '../../../lib/db';
import { sendChangedEmailAddressEmail } from '../../../lib/mail';

const schema = yup.object().shape({
    firstName: yup.string()
        .required('First name is required.'),
    lastName: yup.string()
        .required('Last name is required'),
    email: yup.string()
        .required('Email is required.')
        .min(3, 'Email must have more than 3 characters.')
        .email('Email is invalid.')
        .lowercase('Email must be lowercase.'),
});

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
handler.use(isUserLoggedIn);

handler.patch(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const { 
            email,
            firstName,
            lastName 
        } = schema.validateSync(req.body);
        
        const userResults = await prisma.user.findMany({
            where: {
                email: email,
                NOT: [
                    { id: req.user.id }
                ]
            },
            select: {
                id: true,
            }
        });

        if (userResults.length > 0) {
            return res.status(409).json({
                errors: ['User with that email already exists.']
            });
        }

        const editedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                email: email,
                firstName: firstName,
                lastName: lastName
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

        if (req.user.email !== editedUser.email) {
            await sendChangedEmailAddressEmail(req.user.email)
        }

        return res.json({
            user: editedUser
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