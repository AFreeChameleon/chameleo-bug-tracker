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
        .min(3, 'Company must have more than 3 characters.'),
    originalCompany: yup.string()
        .required('Original company is required.')
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
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedIn);

handler.patch(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { name, key, company, originalCompany } = schema.validateSync(req.body);
        const existingProject = await prisma.project.findUnique({
            where: {
                company: company
            }
        });
        if (existingProject) {
            console.log(existingProject)
            return res.status(409).json({
                errors: ['Project with that company already exists.']
            });
        }
        const projects = await prisma.project.updateMany({
            where: {
                company: originalCompany,
                userId: req.user.id
            },
            data: {
                company: company,
                key: key,
                name: name
            }
        });
        if (projects.count === 0) {
            return res.status(404).json({
                errors: ['Cannot find project.']
            })
        }
        return res.json({
            message: 'Successfully updated project.'
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
});

export default handler;