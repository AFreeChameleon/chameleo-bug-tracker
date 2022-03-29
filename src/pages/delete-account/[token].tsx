import type { NextPage, GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { withIronSession } from 'next-iron-session';
import withSession, { session } from '../../lib/session';

type DeleteAccountTokenProps = {
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

const DeleteAccountToken: NextPage<DeleteAccountTokenProps> = ({ error, message }: DeleteAccountTokenProps) => {
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
                    Deleted your account
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
                    An error occurred while deleting your account.
                </Typography>
                <InnerContainerButton>
                    <Button
                        color="primary"
                        variant="contained" 
                        // fullWidth
                        onClick={(e) => router.push('/account')}
                        sx={{ textTransform: 'none' }}
                    >
                        Go back
                    </Button>
                </InnerContainerButton>
            </InnerContainer>
        </Root>
    )
}

export const getServerSideProps: GetServerSideProps = withSession(async (context) => {
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
                token: rawToken,
            },
            select: {
                user: {
                    select: {
                        id: true
                    }
                },
                createdAt: true
            }
        });
        if (token && token.user) {
            const expiration = new Date(token.createdAt!.getTime() + 30*60000);
            await prisma.token.deleteMany({
                where: {
                    userId: token.user.id,
                    purpose: 'delete-account'
                }
            });
            if (new Date() < expiration) {
                context.req.session.destroy();
                await prisma.user.delete({
                    where: {
                        id: token.user.id
                    }
                });
                return {
                    props: {
                        error: false,
                        message: 'Account was successfully deleted.'
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
    } catch (err: any) {
        console.log(err)
        return {
            props: {
                error: true,
                message: err.message
            }
        }
    }
});

DeleteAccountToken.displayName = 'DeleteAccountToken';

export default DeleteAccountToken;