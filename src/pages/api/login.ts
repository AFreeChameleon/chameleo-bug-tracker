import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../lib/prisma';
import { salt } from '../../lib/db';
import { sendVerifyEmail } from '../../lib/mail';
import withSession, { NextApiRequestWithSession } from '../../lib/session';

const schema = yup.object().shape({
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

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            postLogin(req, res)
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    errors: ['An error occurred while logging you in. Please try again soon.']
                });
            });
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const postLogin = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const {
            email,
            password
        } = schema.validateSync(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(401).json({
                errors: ['Invalid credentials.']
            });
        } else {
            const valid = bcrypt.compareSync(password, user.password);
            console.log(valid)
            if (valid) {
                req.session.set('user', user.id);
                await req.session.save();
                return res.json({
                    message: 'Successfully logged in!'
                });
            } else {
                return res.status(401).json({
                    errors: ['Invalid credentials.']
                });
            }
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