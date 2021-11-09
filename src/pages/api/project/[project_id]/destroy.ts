import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../middleware/auth';
import { checkPermission } from '../../../../lib/auth';

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

handler.delete(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        if (!checkPermission(req.user.projects[0].roles[0].role).write) {
            return res.status(401).json({
                errors: ['You do not have permissions to delete this.']
            });
        }
        const projectId = req.user.projects[0].id;
        const projects = await prisma.project.deleteMany({
            where: {
                id: projectId,
            },
        });
        return res.json({
            message: 'Successfully deleted project.'
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