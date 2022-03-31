import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import { salt } from '../../lib/db';
import { sendContactEmail, sendVerifyEmail } from '../../lib/mail';

const schema = yup.object().shape({
    email: yup.string()
        .required('Email is required.')
        .min(3, 'Email must have more than 3 characters.')
        .email('Email is invalid.')
        .lowercase('Email must be lowercase.'),
    message: yup.string()
        .required('Message is required.'),
    name: yup.string()
        .required('Name is required.')
});

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while sending this email, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {
            email,
            message,
            name
        } = schema.validateSync(req.body);

        const emailRes = await sendContactEmail(name, email, message);

        return res.json({
            message: 'Success! Email has been sent.'
        });
    } catch (err) {
        console.log('Error', err)
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while sending this email. Please try again.']
        });
    }
});

export default handler;