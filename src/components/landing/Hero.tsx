import React from'react';

import { withRouter, Router } from 'next/router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { styled, alpha } from '@mui/material/styles';

const Root = styled('div')({
    width: '100%',
    // 1920x1080 screen
    height: '630px',
    display: 'grid',
    placeItems: 'center'
});

const ActionButton = styled(Button)({
    height: '50px',
    width: '190px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500
});

type HeroProps = {
    router: Router;
}


class Hero extends React.Component<HeroProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { router } = this.props;

        return (
            <Root>
                <Box maxWidth="800px">
                    <Typography
                        component="h1"
                        textAlign="center"
                        color="primary"
                        sx={{ 
                            fontSize: '56px', 
                            fontWeight: '600' ,
                            lineHeight: '65px'
                        }}
                    >
                        Helping you manage projects quickly and efficiently
                    </Typography>
                    <Typography
                        component="h1"
                        textAlign="center"
                        color="textSecondary"
                        sx={{ 
                            fontSize: '24px',
                            marginTop: '40px'
                        }}
                    >
                        Free, open source project management tools to organise your ideas for you
                    </Typography>
                    <Box marginTop="75px" display="flex" justifyContent="center" columnGap="15px">
                        <ActionButton
                            variant="contained"
                            color="secondary"
                            sx={{
                                boxShadow: '0px 0px 8px 0px rgba(0, 175, 85) !important'
                            }}
                            onClick={() => router.push('/register')}
                        >
                            Sign up for the beta
                        </ActionButton>
                        <ActionButton
                            variant="outlined"
                            color="secondary"
                            sx={{
                                borderWidth: '2px !important',
                                borderColor: (theme) => theme.palette.secondary.main,
                                color: (theme) => theme.palette.primary.main
                            }}
                        >
                            Contact us
                        </ActionButton>
                    </Box>
                </Box>
            </Root>
        )
    }
}

export default withRouter(Hero);