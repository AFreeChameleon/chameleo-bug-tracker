import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { prisma }  from '../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole } from '../lib/session';

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

export const isUserLoggedInWithRole = async (req: NextApiRequestWithSessionRole, res: NextApiResponse, next: NextHandler) => {
    try {
        const id = req.session.get('user') || -1;
        const project_id = req.query.project_id as string;
        const rawUser = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                projects: {
                    where: {
                        id: project_id
                    },
                    select: {
                        id: true,
                        roles: {
                            where: {
                                userId: id
                            }
                        },
                    }
                }
            }
        });
        let user = {
            ...rawUser,
            project: {
                ...rawUser.projects[0],
                role: rawUser.projects[0].roles[0]
            }
        }
        if (user) {
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