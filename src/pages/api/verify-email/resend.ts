import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../lib/prisma";
import { sendVerifyEmail } from '../../../lib/mail';

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

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const email = req.body.email;
        const user = await prisma.user.findUnique({
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
        return res.status(500).json({
            errors: ['An error occurred while resending your email. Please try again.']
        });
    }
})

export default handler;