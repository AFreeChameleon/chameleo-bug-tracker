import React from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { compose } from "redux";
import { connect } from "react-redux";

import { styled, alpha } from '@mui/system';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    width: '600px'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const SmallButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '100px'
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: '36px', 
    height: '36px', 
    fontSize: '17px'
}));

type AddUsersModalProps = {
    open: boolean;
    onClose: () => void;
    project: any;
}

type AddUsersModalState = {
    settingsAnchorEl: null | HTMLElement;
    userEmail: string;
    userSuggestions: any[];
    usersToAdd: string[];
}

class AddUsersModal extends React.Component<AddUsersModalProps, AddUsersModalState> {
    constructor(props) {
        super(props);

        this.addUser = this.addUser.bind(this);
        this.searchUser = this.searchUser.bind(this);

        this.state = {
            settingsAnchorEl: null,
            userEmail: '',
            userSuggestions: [],
            usersToAdd: []
        }
    }

    addUser(e) {
        e.preventDefault();
        const { userEmail, userSuggestions } = this.state;
        console.log(userEmail)
    }

    searchUser(e) {
        console.log(e)
        axios.post(`/api/user/find`, {
            email: e.target.value
        }, { withCredentials: true })
        .then((res: any) => {
            this.setState({ userSuggestions: res.data.users });
        }).catch((err) => {

        })
        this.setState({ userEmail: e.target.value });
    }

    render() {
        const { open, onClose, project } = this.props;
        const { settingsAnchorEl, userEmail, userSuggestions, usersToAdd } = this.state;
        console.log(userSuggestions, usersToAdd)

        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                        <Box display="flex" columnGap="20px">
                            <FolderSharedIcon />
                            <Typography
                                variant="h5"
                            >
                                Share
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={(e) => this.setState({ settingsAnchorEl: e.currentTarget })}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Box>
                    <Box component="form" onSubmit={this.addUser} action="">
                        <Autocomplete
                            clearOnEscape
                            fullWidth
                            options={userSuggestions}
                            inputValue={userEmail}
                            getOptionLabel={(option) => option.email}
                            onInputChange={(e, newVal) => {
                                if (!e || e.type === 'change') {
                                    return;
                                }
                                console.log(e, newVal);
                                this.setState({ 
                                    usersToAdd: [...usersToAdd, newVal],
                                    userEmail: ''
                                })
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    placeholder="Type in the user's email here..."
                                    size="small"
                                    onChange={this.searchUser}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: {
                                            paddingBottom: '10px !important',
                                            paddingTop: '10px !important'
                                        }
                                    }}
                                />
                            )}
                        />

                    </Box>
                    <Stack direction="column" marginTop="20px" spacing={1}>
                        <Box 
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display="flex" columnGap="10px" alignItems="center">
                                <SmallAvatar>
                                    H
                                </SmallAvatar>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                    >
                                        Ben Evans
                                    </Typography>
                                    <Typography
                                        color="GrayText"
                                    >
                                        ben.evans@chamel.io
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                color="GrayText"
                                component="i"
                                variant="body2"
                            >
                                Owner
                            </Typography>
                        </Box>
                        <Box 
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display="flex" columnGap="10px" alignItems="center">
                                <SmallAvatar>
                                    H
                                </SmallAvatar>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                    >
                                        Ben Evans
                                    </Typography>
                                    <Typography
                                        color="GrayText"
                                    >
                                        ben.evans@chamel.io
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                color="GrayText"
                                component="i"
                                variant="body2"
                            >
                                Owner
                            </Typography>
                        </Box>
                    </Stack>
                    <Box marginTop="20px">
                        <SmallButton
                            variant="contained"
                        >
                            Done
                        </SmallButton>
                    </Box>
                    <Menu
                        open={Boolean(settingsAnchorEl)}
                        anchorEl={settingsAnchorEl}
                        onClose={() => this.setState({ settingsAnchorEl: null })}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography
                                    color="error"
                                >
                                    Remove users
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </ModalBody>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data
});

const mapDispatchToProps = dispatch => ({
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(AddUsersModal);