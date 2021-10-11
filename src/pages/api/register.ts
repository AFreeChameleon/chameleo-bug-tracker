import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import { salt } from '../../lib/db';
import { sendVerifyEmail } from '../../lib/mail';

const schema = yup.object().shape({
    first_name: yup.string()
        .required('First name is required.'),
    last_name: yup.string()
        .required('Last name is required'),
    email: yup.string()
        .required('Email is required.')
        .min(3, 'Email must have more than 3 characters.')
        .email('Email is invalid.')
        .lowercase('Email must be lowercase.'),
    password: yup.string()
        .required('Password is required.')
        .min(8, 'Password must be 8 or more characters.')
        .matches(
            /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)/, 
            'Password invalid, must contain at least: one uppercase letter, one lowercase letter, one number, one symbol'
        )
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            postRegister(req, res)
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    errors: ['An error occurred while setting up your account. Please try again soon.']
                })
            });
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
}

const postRegister = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { first_name, last_name, email, password } = schema.validateSync(req.body);

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).json({
                errors: ['Email already registered.']
            });
        } else {
            const user = await prisma.user.create({
                data: {
                    firstName: first_name,
                    lastName: last_name, 
                    email: email,
                    password: await bcrypt.hash(password, salt),
                    tokens: {
                        create: [
                            {
                                purpose: 'verify-email',
                            }
                        ]
                    }
                },
                select: {
                    tokens: true,
                    id: true,
                }
            });
            await sendVerifyEmail(email, user.tokens[0].token);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    confirmationEmailSent: (new Date()).toISOString()
                }
            })
            return res.json({
                message: 'Success! You have been sent an email. Click on the link to verify your account.'
            });
        }
    } catch (err) {
        console.log('Error', err)
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while registering you. Please try again.']
        });
    }
}