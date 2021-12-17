import path from 'path';
import mailgun, { Mailgun } from 'mailgun-js';
import { readFileSync } from 'fs';

const mailer: Mailgun = mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string
});

const verifyEmailHTML = readFileSync(path.join(process.cwd(), './html/verification.html'));
const resetPassHTML = readFileSync(path.join(process.cwd(), './html/reset-password.html'));
const changedEmailHTML = readFileSync(path.join(process.cwd(), './html/account-details-changed.html'));
const deleteAccountHTML = readFileSync(path.join(process.cwd(), './html/delete-account.html'));
const passwordChangedHTML = readFileSync(path.join(process.cwd(), './html/password-changed.html'));

export const sendPasswordChangedEmail = (userEmail: string) => {
    return new Promise((resolve, reject) => {
        let passwordChangedHTML = deleteAccountHTML.toString();
        const data = {
            from: 'Support Chameleo <info@chamel.io>',
            to: userEmail,
            subject: 'Your password has been changed',
            html: passwordChangedHTML
        };
        mailer.messages().send(data, (err, body) => {
            if (err) {
                console.log(err)
                reject({
                    error: true,
                    message: err
                });
            } else {
                console.log(body)
                resolve({
                    error: false,
                    message: body
                });
            }
        });
    });
}

export const sendDeleteAccountEmail = (userEmail: string, token: string) => {
    return new Promise((resolve, reject) => {
        let newDeleteAccountHTML = deleteAccountHTML.toString()
            .replace('TOKEN_URL', `${process.env.HOST}/delete-account/${token}`);
        const data = {
            from: 'Support Chameleo <info@chamel.io>',
            to: userEmail,
            subject: 'Delete your account',
            html: newDeleteAccountHTML
        };
        mailer.messages().send(data, (err, body) => {
            if (err) {
                console.log(err)
                reject({
                    error: true,
                    message: err
                });
            } else {
                console.log(body)
                resolve({
                    error: false,
                    message: body
                });
            }
        });
    });
}

export const sendVerifyEmail = (userEmail: string, token: string) => {
    return new Promise((resolve, reject) => {
        let newVerifyEmailHTML = verifyEmailHTML.toString()
            .replace('TOKEN_URL', `${process.env.HOST}/verify-email/${token}`);
        const data = {
            from: 'Support Chameleo <info@chamel.io>',
            to: userEmail,
            subject: 'Verify your email!',
            html: newVerifyEmailHTML
        };
        mailer.messages().send(data, (err, body) => {
            if (err) {
                console.log(err)
                reject({
                    error: true,
                    message: err
                })
            } else {
                console.log(body)
                resolve({
                    error: false,
                    message: body
                });
            }
        });
    });
}

export const sendChangedEmailAddressEmail = (userEmail: string) => {
    return new Promise((resolve, reject) => {
        const newResetPassHTML = changedEmailHTML.toString();
        const data = {
            from: 'Support Chameleo <info@chamel.io>',
            to: userEmail,
            subject: 'Successfully changed your email.',
            html: newResetPassHTML
        };
        mailer.messages().send(data, (err, body) => {
            if (err) {
                reject({
                    error: true,
                    message: err
                })
            } else {
                resolve({
                    error: false,
                    message: body
                });
            }
        });
    });
}

export const sendResetPassEmail = (userEmail: string, token: string) => {
    return new Promise((resolve, reject) => {
        const newResetPassHTML = resetPassHTML.toString()
            .replace('TOKEN_URL', `${process.env.HOST}/forgot-password/${token}`);
        const data = {
            from: 'Support Chameleo <info@chamel.io>',
            to: userEmail,
            subject: 'Reset your password!',
            html: newResetPassHTML
        }
        mailer.messages().send(data, (err, body) => {
            if (err) {
                reject({
                    error: true,
                    message: err
                })
            } else {
                resolve({
                    error: false,
                    message: body
                });
            }
        });
    });
}