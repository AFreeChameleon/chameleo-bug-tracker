import React from 'react';

import NextImage from 'next/image';
import shareModal from '../../../public/img/sharemodal.png';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { styled, alpha } from '@mui/material/styles';

const Root = styled('div')(({theme}) => ({
    backgroundColor: `${theme.palette.secondary.main}21`,
    height: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

const Container = styled('div')(({ theme }) => ({
    width: '850px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 auto'
}));

const Img = styled('img')(({ theme }) => ({
    boxShadow: theme.shadows[4],
    borderRadius: '5px'
}))

class OpenBeta extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Root>
                <FlexGrow/>
                <Container>
                    <Box maxWidth="450px">
                        <Typography
                            variant="h3"
                            color="primary"
                            sx={{
                                marginBottom: '20px'
                            }}
                        >
                            We're in open beta!
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                        >
                            Create tickets and assign progress, time estimates and priorities to them. Contained in projects you can share with other users for collaboration.
                        </Typography>
                    </Box>
                    <Img
                        src="/img/sharemodal.png"
                        alt="Share modal"
                        sx={{
                            lineHeight: 0,
                        }}
                    />
                </Container>
            </Root>
        )
    }
}

export default OpenBeta;