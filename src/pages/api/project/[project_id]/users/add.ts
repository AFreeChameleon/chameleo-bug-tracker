import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../../middleware/auth';
import { checkPermission } from '../../../../../lib/auth';
import { getProject } from '../../../../../lib/db';

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
handler.use(isUserLoggedInWithRole);

handler.post(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const projectId = req.user.projects[0].id;
        const { email } = req.body;
        
        const addingUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                projects: true
            }
        });

        if (!addingUser) {
            return res.status(404).json({
                errors: ['Cannot find user.']
            });
        }

        if (addingUser.projects.filter(p => p.id === projectId).length > 0) {
            return res.status(409).json({
                errors: ['User is already added to this project.']
            });
        }

        const createdJunction = await prisma.projectUserJunction.create({
            data: {
                userId: addingUser.id,
                projectId: projectId
            }
        });

        const newProject = await getProject(projectId, req.user.id);

        return res.json({
            project: newProject
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while deleting your project, please try again later.']
        })
    }
});

export default handler;