import React from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { NextRouter, withRouter } from 'next/router';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

import chameleologo from '../../public/img/chameleo-logo.png';
import { setAlerts } from '../redux/alerts/actions';
import { Button } from '@mui/material';

import CreateTicketModal from './projects/tickets/CreateModal';

type HeaderProps = {
    user: any;
    router: NextRouter;
    dispatchSetAlerts: (values: any[]) => void;

    createTicket?: boolean;
}

type HeaderState = {
    profileMenuAnchorEl: any;
    createTicketModalOpen: boolean;
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

class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        
        this.state = {
            profileMenuAnchorEl: null,
            createTicketModalOpen: false
        }
    }

    logout() {
        const { router, dispatchSetAlerts } = this.props;
        dispatchSetAlerts([]);
        axios.post('/api/logout', {}, { withCredentials: true })
        .then((res) => {
            router.push('/');
        })
        .catch((err) => {
            if (err.response) {
                dispatchSetAlerts(
                    err.response.data.errors.map((e: string) => ({
                        type: 'error',
                        message: e
                    }))
                );
            } else {
                dispatchSetAlerts([ {
                    type: 'error',
                    message: err.message
                } ]);
            }
        })
    }

    render() {
        const { user, createTicket } = this.props;
        const { profileMenuAnchorEl, createTicketModalOpen } = this.state;
        return (
            <Box sx={{ flexGrow: 1 }} position="relative" zIndex={10}>
                <AppBar position="static" color="transparent" sx={{boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)'}}>
                    <Toolbar sx={{  }}>
                        <NextLink href="/">
                            <StyledLink>
                                <NextImage src={chameleologo}/>
                            </StyledLink>
                        </NextLink>
                        <FlexGrow/>
                        {createTicket && <Button
                            onClick={() => this.setState({ createTicketModalOpen: true })}
                            sx={{ 
                                textTransform: 'none',
                                marginRight: '10px'
                            }}
                            variant="contained"
                        >
                            Create Ticket
                        </Button>}
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
                            onClick={(e) => this.setState({ profileMenuAnchorEl: e.currentTarget })}
                        >
                            <Avatar sx={{ height: 32, width: 32, marginTop: '2px' }}>
                                {user.firstName && user.firstName.slice(0, 1)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={profileMenuAnchorEl}
                            open={Boolean(profileMenuAnchorEl)}
                            onClose={() => this.setState({ profileMenuAnchorEl: null })}
                            onClick={() => this.setState({ profileMenuAnchorEl: null })}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 22,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem>
                                <Avatar /> Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={this.logout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                { createTicketModalOpen && <CreateTicketModal open={createTicketModalOpen} onClose={() => this.setState({ createTicketModalOpen: false })} /> }
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (values) => dispatch(setAlerts(values))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Header));