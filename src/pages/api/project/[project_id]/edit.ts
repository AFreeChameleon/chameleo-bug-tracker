import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../middleware/auth';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.')
        .min(3, 'Name must have more than 3 characters.'),
    key: yup.string()
        .required(),
    id: yup.string().uuid()
        .required('ID is required.')
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
handler.use(isUserLoggedInWithRole);

handler.patch(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const { name, key } = schema.validateSync(req.body);
        // const existingProject = await prisma.project.findUnique({
        //     where: {
        //         id: id
        //     }
        // });
        // if (existingProject) {
        //     return res.status(409).json({
        //         errors: ['Project with that id already exists.']
        //     });
        // }
        const projects = await prisma.project.updateMany({
            where: {
                id: req.user.projects[0].id,
                userId: req.user.id
            },
            data: {
                key: key,
                name: name
            }
        });
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