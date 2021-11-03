import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import timestring from 'timestring';
import { prisma }  from '../../../../../lib/prisma';
import { isUserLoggedIn } from '../../../../../middleware/auth';
import withSession, { NextApiRequestWithSession, session } from '../../../../../lib/session';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.'),
});

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while creating your tag, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedIn);

handler.post(async (req: any, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const { name } = schema.validateSync(req.body);
        const existingTag = await prisma.tag.findFirst({
            where: {
                projectId: req.user.projects[0].id,
                name: name
            },
            select: {
                id: true
            }
        });
        if (existingTag) {
            return res.status(409).json({
                errors: ['Tag with that name already exists.']
            });
        }
        const tag = await prisma.tag.create({
            data: {
                name: name,
                projectId: req.user.projects[0].id
            },
            select: {
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return res.json({
            message: 'Successfully created tag.',
            tag: tag
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while creating your tag, please try again later.']
        })
    }
})