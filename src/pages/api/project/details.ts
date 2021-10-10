import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            console.log('WOOP')
            isUserLoggedIn(req, res, getProjectDetails);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const getProjectDetails = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const key = req.query.key as string;
        console.log('key: ', req.query)
        const project = await prisma.project.findFirst({
            where: {
                userId: req.user.id,
                key: key
            },
            select: {
                name: true,
                key: true,
                tickets: {
                    select: {
                        timeEstimate: true,
                        status: true,
                        priority: true,
                        description: true,
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
                        updatedAt: true
                    }
                },
            }
        });
        const user = await prisma.user.findFirst({
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
                        name: true,
                        key: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                    }
                }
            }
        });
        console.log(project, user)
        return res.json({
            project: project,
            user: user
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
}