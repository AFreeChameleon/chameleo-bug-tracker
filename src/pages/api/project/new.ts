import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.')
        .min(3, 'Name must have more than 3 characters.'),
    key: yup.string()
        .required(),
    company: yup.string()
        .required('Company is required.')
        .min(3, 'Company must have more than 3 characters.')
});

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

handler.use(session);
handler.use(isUserLoggedIn);

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { name, key, company } = schema.validateSync(req.body);
        const existingProjects = await prisma.project.findMany({
            where: {
                company: company
            }
        });
        if (existingProjects.length > 0) {
            return res.status(404).json({
                errors: ['Company with that name already exists.']
            })
        }
        const project = await prisma.project.create({
            data: {
                userId: req.user.id,
                name: name,
                key: key,
                company: company
            }
        });
        const role = await prisma.role.create({
            data: {
                userId: req.user.id,
                projectId: project.id,
                role: 'Owner'
            }
        });

        return res.json({
            message: 'Successfully created new project.'
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while creating your project, please try again later.']
        })
    }
})

export default handler;