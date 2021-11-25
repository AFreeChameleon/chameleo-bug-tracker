import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../middleware/auth';

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
handler.use(isUserLoggedInWithRole);

handler.get(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const project = await prisma.project.findFirst({
            where: {
                id: project_id
            },
            select: {
                name: true,
                id: true,
                details: true,
                tickets: {
                    select: {
                        id: true,
                        timeEstimate: true,
                        status: true,
                        priority: true,
                        description: true,
                        name: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        assignedUserId: true,
                        source: true,
                        started: true,
                        createdAt: true,
                        updatedAt: true,
                        ticketNumber: true
                    },
                },
                roles: {
                    where: {
                        userId: req.user.id
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                updatedAt: true,
                createdAt: true,
                user: { 
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });
        return res.json({
            project: project,
        })
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting project details, please try again later.']
        })
    }
});

handler.patch(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { details } = req.body;
        const project_id = req.query.project_id as string;
        const project = await prisma.project.update({
            where: {
                id: project_id
            },
            data: {
                details: details
            },
            select: {
                name: true,
                id: true,
                details: true,
                tickets: {
                    select: {
                        id: true,
                        timeEstimate: true,
                        status: true,
                        priority: true,
                        description: true,
                        name: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        assignedUserId: true,
                        source: true,
                        started: true,
                        createdAt: true,
                        updatedAt: true,
                        ticketNumber: true
                    },
                },
                roles: {
                    where: {
                        userId: req.user.id
                    }
                },
                tags: {
                    select: {
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                updatedAt: true,
                createdAt: true,
                user: { 
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        return res.json({
            project: project,
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting project details, please try again later.']
        })
    }
})

export default handler;