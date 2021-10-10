import React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

import chameleologo from '../../public/img/chameleo-logo.png';

type HeaderProps = {
    user: any;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    border: `1px solid ${theme.palette.grey['400']}`,
    marginRight: '30px',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

const StyledLink = styled(Link)(({ theme }) => ({
    cursor: 'pointer',
    marginTop: '15px'
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        background: theme.palette.error.main,
        color: theme.palette.error.contrastText
    }
}));

class Header extends React.Component<HeaderProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="transparent">
                    <Toolbar sx={{  }}>
                        <NextLink href="/">
                            <StyledLink>
                                <NextImage src={chameleologo}/>
                            </StyledLink>
                        </NextLink>
                        <FlexGrow/>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <NotificationBadge badgeContent="4" overlap="circular">
                                <NotificationsIcon />
                            </NotificationBadge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <Avatar sx={{ height: 32, width: 32, paddingTop: '2px' }}>
                                {user.firstName.slice(0, 1)}
                            </Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
})

export default compose<any>(
    connect(mapStateToProps)
)(Header);