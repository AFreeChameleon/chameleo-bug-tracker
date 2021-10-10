import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.')
        .min(3, 'Name must have more than 3 characters.'),
    key: yup.string()
        .required()
});

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            isUserLoggedIn(req, res, postNewProject);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const postNewProject = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { name, key } = schema.validateSync(req.body);
        const project = await prisma.project.create({
            data: {
                userId: req.user.id,
                name: name,
                key: key
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
}