import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';
import { sendDeleteAccountEmail } from '../../../lib/mail';

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

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const token = await prisma.token.create({
            data: {
                purpose: 'delete-account',
                userId: req.user.id
            }
        })

        await sendDeleteAccountEmail(req.user.email, token.token);

        return res.json({
            message: 'Success!'
        });
    } catch (err) {
        console.log(err)
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting your details, please try again later.']
        });
    }
})

export default handler;