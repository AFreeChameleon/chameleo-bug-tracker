import React from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { compose } from "redux";
import { connect } from "react-redux";
import {
    addUserToProject,
    changeUserPermissions
} from '../../redux/project/actions';
import { setAlerts, Alert } from '../../redux/alerts/actions';

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
import Select from '@mui/material/Select';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';
import { checkPermission } from '../../lib/auth';

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    width: '600px',
    outline: 'none'
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
    user: any;
    dispatchAddUserToProject: (id: string, email: string) => void;
    dispatchChangeUserPermissions: (id: string, email: string, role: string) => void;
    dispatchSetAlerts: (alerts: Alert[]) => void;
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
        this.submitChangeUserPermissions = this.submitChangeUserPermissions.bind(this);

        this.state = {
            settingsAnchorEl: null,
            userEmail: '',
            userSuggestions: [],
            usersToAdd: []
        }
    }

    addUser(e, email: string) {
        e && e.preventDefault();
        const { project, dispatchAddUserToProject } = this.props;

        dispatchAddUserToProject(project.id, email);
        this.setState({ 
            userEmail: '',
            userSuggestions: []
        });
    }

    searchUser(e) {
        const { dispatchSetAlerts } = this.props;

        axios.post(`/api/user/find`, {
            email: e.target.value
        }, { withCredentials: true })
        .then((res: any) => {
            this.setState({ userSuggestions: res.data.users });
        }).catch((err) => {
            if (err.response) {
                dispatchSetAlerts(err.response.data.errors.map((err) => ({ type: 'error', message: err })))
            } else {
                dispatchSetAlerts([{ type: 'error', message: 'An error occurred. Please try again later.' }]);
            }
        });
        this.setState({ userEmail: e.target.value });
    }

    submitChangeUserPermissions(e, email: string) {
        const { project, dispatchChangeUserPermissions } = this.props;

        dispatchChangeUserPermissions(project.id, email, e.target.value);
    }

    render() {
        const { open, onClose, project, user } = this.props;
        const { settingsAnchorEl, userEmail, userSuggestions, usersToAdd } = this.state;
        const usersProjectRole = user.roles.find((r) => r.projectId === project.id);
        const userPermissions = checkPermission(usersProjectRole.role);

        console.log(userSuggestions, usersToAdd, userEmail, project.users, user, usersProjectRole);

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
                    <Box component="form" onSubmit={(e) => this.addUser(e, userEmail)} action="">
                        <Autocomplete
                            clearOnEscape
                            fullWidth
                            freeSolo
                            noOptionsText="No users with that email found."
                            options={userSuggestions}
                            inputValue={userEmail}
                            getOptionLabel={(option) => option.email || option}
                            onChange={(e, newVal) => {
                                if (!e || e.type === 'change') {
                                    return;
                                }
                                this.addUser(e, newVal.email || newVal)
                            }}
                            renderOption={(props, option) => (
                                <Box 
                                    component="li" 
                                    display="flex" 
                                    columnGap="10px" 
                                    alignItems="center" 
                                    {...props} 
                                    onClick={(e) => this.addUser(e, option.email)}
                                >
                                    <SmallAvatar>
                                        {option.firstName[0].toUpperCase()}
                                    </SmallAvatar>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                        >
                                            {option.firstName} {option.lastName}
                                        </Typography>
                                        <Typography
                                            color="GrayText"
                                        >
                                            {option.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
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
                        { project.users.map((roleUser) => {
                            const u = roleUser.user;
                            const permissions = checkPermission(u.roles[0].role)
                            console.log(permissions, userPermissions)
                            return (
                                <Box 
                                    key={u.id}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box display="flex" columnGap="10px" alignItems="center">
                                        <SmallAvatar>
                                            {u.firstName[0].toUpperCase()}
                                        </SmallAvatar>
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                            >
                                                {u.firstName} {u.lastName}
                                            </Typography>
                                            <Typography
                                                color="GrayText"
                                            >
                                                {u.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    { userPermissions.userReadWrite && (userPermissions.priority > permissions.priority) ? (

                                        <Select
                                            value={u.roles[0].role}
                                            onChange={(e) => this.submitChangeUserPermissions(e, u.email)}
                                            size="small"
                                        >
                                            <MenuItem value="Administrator">
                                                Administrator
                                            </MenuItem>
                                            <MenuItem value="User">
                                                User
                                            </MenuItem>
                                            <MenuItem value="ReadOnly">
                                                Read-Only
                                            </MenuItem>
                                        </Select>
                                    ) : (
                                        <Typography
                                            color="GrayText"
                                            component="i"
                                            variant="body2"
                                        >
                                            {u.roles[0].role}
                                        </Typography>
                                    )}
                                </Box>
                        )}) }
                    </Stack>
                    <Box marginTop="20px">
                        <SmallButton
                            variant="contained"
                            onClick={onClose}
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
    user: state.user.data
});

const mapDispatchToProps = dispatch => ({
    dispatchAddUserToProject: (id: string, email: string) => dispatch(addUserToProject(id, email)),
    dispatchChangeUserPermissions: (id: string, email: string, role: string) => dispatch(changeUserPermissions(id, email, role)),
    dispatchSetAlerts: (alerts: Alert[]) => dispatch(setAlerts(alerts))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(AddUsersModal);