import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { prisma }  from '../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole } from '../lib/session';

export const isUserLoggedIn = async (req: NextApiRequestWithSession, res: NextApiResponse, next: NextHandler) => {
    try {
        const id = req.session.user || -1;
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

export const isUserLoggedInWithRole = async (req: NextApiRequestWithSessionRole, res: NextApiResponse, next: NextHandler) => {
    try {
        const id = req.session.user || -1;
        const project_id = req.query.project_id as string;
        const rawUser = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                roles: {
                    where: {
                        projectId: project_id
                    }
                },
                projects: {
                    where: {
                        id: project_id
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
                                userId: id
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
                    }
                }
            }
        });
        if (rawUser.projects.length === 0) {
            return res.status(404).json({
                errors: ['Project does not exist.']
            });
        }
        if (rawUser.projects[0].roles.length === 0) {
            return res.status(404).json({
                errors: ['Project does not have any permissions.']
            });
        }

        if (rawUser) {
            req.user = rawUser;
            next();
        } else {
            throw new Error('User doesn\'t exist.');
        }
    } catch (err) {
        console.log(err)
        throw new Error('An error occurred while getting your details.');
    }
}