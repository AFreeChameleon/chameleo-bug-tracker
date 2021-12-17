import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';
import { sendDeleteAccountEmail, sendPasswordChangedEmail } from '../../../lib/mail';
import { salt } from '../../../lib/db';

const schema = yup.object().shape({
    currentPassword: yup.string()
        .required('Current password is required.'),
    newPassword: yup.string()
        .required('New password is required.')
        .min(8, 'Password must be 8 or more characters.')
        .matches(
            /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, 
            'Password invalid, must contain at least: one uppercase letter, one lowercase letter, one number, one symbol'
        ),
    confirmNewPassword: yup.string()
        .required('Password is required.')
        .min(8, 'Password must be 8 or more characters.')
        .matches(
            /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, 
            'Password invalid, must contain at least: one uppercase letter, one lowercase letter, one number, one symbol'
        ),
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

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { 
            currentPassword,
            newPassword,
            confirmNewPassword 
        } = schema.validateSync(req.body);

        if (newPassword !== confirmNewPassword) {
            return res.status(500).json({
                errors: ['Passwords do not match.']
            });
        }

        const valid = bcrypt.compareSync(currentPassword, req.user.password);
        if (!valid) {
            return res.status(401).json({
                errors: ['Incorrect password.']
            });
        }

        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: await bcrypt.hash(newPassword, salt)
            }
        });

        await sendPasswordChangedEmail(req.user.email);

        return res.json({
            message: 'Success! You have been sent an email to notify you.'
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