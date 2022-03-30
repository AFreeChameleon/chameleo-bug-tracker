import type { NextPage, GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

type VerifyEmailTokenProps = {
    error: boolean;
    message: string;
}

const Root = styled('div')((theme) => ({
    width: '100%',
    height: '100vh',
    display: 'grid',
    placeItems: 'center'
}));

const InnerContainer = styled('div')((theme) => ({
    padding: '20px 40px',
    // boxShadow: '3px 3px 6px rgb(0, 0, 0, 0.2)',
    borderRadius: '6px',
    textAlign: 'center',
    maxWidth: '500px'
}));

const InnerContainerImg = styled('div')((theme) => ({

}));

const InnerContainerButton = styled('div')((theme) => ({
    paddingTop: '20px'
}));

const VerifyEmailToken: NextPage<VerifyEmailTokenProps> = ({ error, message }: VerifyEmailTokenProps) => {
    const router = useRouter();
    console.log(error, message)
    useEffect(() => {
        if (!error) {
            router.push('/login')
        }
    }, [])

    return !error ? (
        <Root>
            <InnerContainer>
                <InnerContainerImg>
                    <img src="/img/baby-chameleon.png" />
                </InnerContainerImg>
                <Typography
                    variant="h1"
                    gutterBottom
                >
                    Verified!
                </Typography>
                <Typography
                    variant="body2"
                >
                    Redirecting you to login shortly...
                </Typography>
            </InnerContainer>
        </Root>
    ) : (
        <Root>
            <InnerContainer>
                <InnerContainerImg>
                    <img src="/img/baby-chameleon.png" />
                </InnerContainerImg>
                <Typography
                    variant="h1"
                    gutterBottom
                >
                    Oops!
                </Typography>
                <Typography
                    variant="body2"
                    gutterBottom
                >
                    An error occurred while verifying your email.
                </Typography>
                <InnerContainerButton>
                    <Button
                        color="primary"
                        variant="contained" 
                        fullWidth
                        onClick={(e) => router.push('/register')}
                    >
                        Go back to register
                    </Button>
                </InnerContainerButton>
            </InnerContainer>
        </Root>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const rawToken = context.query.token as string;
        if (!rawToken) {
            return {
                props: {
                    error: true,
                    message: 'Token not supplied.'
                }
            }
        }
        const token = await prisma.token.findUnique({
            where: {
                token: rawToken
            },
            select: {
                id: true,
                createdAt: true,
                user: {
                    select: {
                        email: true,
                        confirmedAt: true,
                        id: true
                    }
                }
            }
        });
        if (!token) {
            return {
                props: {
                    error: true,
                    message: 'Token invalid.'
                }
            }
        }
        const { user } = token;

        console.log(user)
        if (!user.confirmedAt) {
            if (user.email) {
                const expiration = new Date(token.createdAt!.getTime() + 30*60000);
                await prisma.token.deleteMany({
                    where: {
                        userId: user.id,
                        purpose: 'verify-email'
                    }
                });
                if (new Date() < expiration) {
                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            confirmedAt: (new Date()).toISOString()
                        }
                    });
                    return {
                        props: {
                            error: false,
                            message: 'Email was successfully verified.'
                        }
                    }
                } else {
                    return {
                        props: {
                            error: true,
                            message: 'Token has expired. Please try again.'
                        }
                    }
                }
            } else {
                return {
                    props: {
                        error: true,
                        message: 'Invalid token.'
                    }
                }
            }
        } else {
            return {
                props: {
                    error: true,
                    message: 'User already verified.'
                }
            }
        }
    } catch (err: any) {
        console.log(err)
        return {
            props: {
                error: true,
                message: err.message
            }
        }
    }
}

VerifyEmailToken.displayName = 'VerifyEmailToken';

export default VerifyEmailToken;