import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../../middleware/auth';
import { getProject } from '../../../../../lib/db';

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while restoring tickets, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedInWithRole);

handler.patch(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const { ticketNumbers } = req.body;
        await prisma.ticket.updateMany({
            where: {
                projectId: project_id,
                OR: [
                    ticketNumbers.map((num) => ({
                        ticketNumber: num
                    }))
                ]
            },
            data: {
                archived: false
            }
        });
        const project = await getProject(project_id, req.user.id);
        return res.json({
            project: project
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

export default handler;