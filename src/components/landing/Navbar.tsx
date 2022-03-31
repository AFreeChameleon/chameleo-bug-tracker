import React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { withRouter, Router } from 'next/router';
import chameleoLogo from '../../../public/img/chameleo-logo.png';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import { styled, alpha } from '@mui/material/styles';

const Root = styled('div')({
    width: '100%',
    height: '80px'
});

const StyledLink = styled(Link)(({ theme }) => ({
    cursor: 'pointer',
    marginTop: '15px'
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

type NavbarProps = {
    router: Router;
}

class Navbar extends React.Component<NavbarProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { router } = this.props;

        return (
            <Box sx={{ flexGrow: 1 }} zIndex={10} marginBottom="64px">
                <Box position="absolute" width="100%" top={0} zIndex={10}>
                    <AppBar position="fixed" color="inherit" sx={{boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)'}}>
                        <Toolbar sx={{ columnGap: '15px' }}>
                            <NextLink href="/">
                                <StyledLink>
                                    <NextImage src={chameleoLogo}/>
                                </StyledLink>
                            </NextLink>
                            <FlexGrow/>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: (theme) => `${theme.palette.success.main} !important`,
                                    width: '100px',
                                    textTransform: 'none'
                                }}
                                onClick={() => router.push('/login')}
                                >
                                Log in
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: (theme) => `${theme.palette.success.main} !important`,
                                    width: '100px',
                                    textTransform: 'none'
                                }}
                                onClick={() => router.push('/register')}
                            >
                                Register
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Box>
        )
    }
}

export default withRouter(Navbar);