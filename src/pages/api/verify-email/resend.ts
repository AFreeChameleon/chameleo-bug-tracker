import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from 'nanoid';
import { prisma } from "../../../lib/prisma";
import { sendVerifyEmail } from '../../../lib/mail';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            postResendVerifyUserEmail(req, res)
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    errors: ['An error occurred while resending your verification email. Please try again soon.']
                });
            });
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
}

const postResendVerifyUserEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const email = req.body.email;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        await prisma.token.deleteMany({
            where: {
                userId: user.id,
                purpose: 'verify-email'
            }
        });
    
        const newToken = await prisma.token.create({
            data: {
                userId: user.id,
                purpose: 'verify-email',
            }
        });
    
        sendVerifyEmail(email, newToken.token)
        .then((message) => {
            return res.json({
                message: 'Success! You have been sent an email. Click on the link to verify your account.'
            });
        })
        .catch((err) => {
            return res.status(500).json({
                errors: ['An error occurred while resending your email. Please try again.']
            });
        });
    } catch (err) {
        console.log('UH OHHH')
        return res.status(500).json({
            errors: ['An error occurred while resending your email. Please try again.']
        });
    }
}