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
        const token = context.query.token as string;
        if (!token) {
            return {
                props: {
                    error: true,
                    message: 'Token not supplied.'
                }
            }
        }
        const user = (await prisma.user.findMany({
            select: {
                tokens: {
                    where: {
                        token: token,
                    }
                },
                email: true,
                confirmedAt: true,
                id: true
            }
        }))[0];
        if (!user) {
            return {
                props: {
                    error: true,
                    message: 'Could not find user.'
                }
            }
        }
        if (!user.confirmedAt) {
            if (user.email && user.tokens.length > 0) {
                const expiration = new Date(user.tokens[0].createdAt!.getTime() + 30*60000);
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
        return {
            props: {
                error: true,
                message: err.message
            }
        }
    }
}

export default VerifyEmailToken;