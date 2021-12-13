import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../../middleware/auth';
import { checkPermission } from '../../../../../lib/auth';
import { getProject } from '../../../../../lib/db';
import { canUserEditUsers } from '../../../../../middleware/permissions';

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
handler.use(canUserEditUsers);

handler.post(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const projectId = req.user.projects[0].id;
        const { email, role } = req.body;
        const userPermissions = checkPermission(req.user.roles[0].role);
        const desiredPermissions = checkPermission(role);
        
        if (userPermissions.priority <= desiredPermissions.priority) {
            return res.status(403).json({
                errors: ['You do not have authorisation.']
            });
        }

        const editingUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true
            }
        });

        await prisma.role.updateMany({
            where: {
                userId: editingUser.id,
                projectId: projectId
            },
            data: {
                role: role
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