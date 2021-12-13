import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../lib/prisma';
import { getProject } from '../../../../lib/db';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../middleware/auth';
import { canUserReadTickets } from '../../../../middleware/permissions';

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
handler.use(canUserReadTickets);

handler.get(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const project = await getProject(req.user.projects[0].id, req.user.id);
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
                    where: {
                        archived: false
                    },
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