import React from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { compose } from "redux";
import { connect } from "react-redux";
import {
    addUserToProject,
    changeUserPermissions
} from '../../../../redux/project/actions';
import { setAlerts, Alert } from '../../../../redux/alerts/actions';

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
import Divider from '@mui/material/Divider';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';

const Root = styled('div')(({ theme }) => ({
    border: `1px solid ${theme.palette.grey['200']}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: '30px'
}));

const InnerContainer = styled('div')(({ theme }) => ({
    padding: '15px 20px'
}));

const CodeBlock = styled('div')(({ theme }: any) => ({
    ...(theme.typography as any).body2,
    padding: '10px 15px',
    backgroundColor: theme.palette.background.light,
    wordWrap: 'break-word',
    borderRadius: theme.shape.borderRadius,
    fontFamily: "'Source Code Pro', monospace",
    letterSpacing: '0.5px'
}));

type APIKeysProps = {
    project: any;
    user: any;
}

type APIKeysState = {
    key: null | string;
}

class APIKeys extends React.Component<APIKeysProps, APIKeysState> {
    constructor(props) {
        super(props);

        this.fetchAPIKey = this.fetchAPIKey.bind(this);

        this.state = {
            key: null
        }
    }

    async fetchAPIKey(e) {
        const { project } = this.props;

        axios.get(`/api/project/${project.id}/api-key`, { withCredentials: true })
        .then((res: any) => {
            this.setState({
                key: res.data.key
            });
        }).catch((err) => {
            console.log(err.response.data.errors);
        });
    }

    render() {
        const { project, user } = this.props;
        const { key } = this.state;

        return (
            <Root>
                <InnerContainer>
                    <Typography
                        gutterBottom
                        variant="h5"
                    >
                        API keys
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'grey.700'}}
                    >
                        This key will allow you to authenticate API requests.
                    </Typography>
                </InnerContainer>
                <Divider/>
                <InnerContainer>
                    <Box display="flex">
                        <Typography
                            variant="body2"
                            sx={{ width: '105px' }}
                        >
                            Your API key
                        </Typography>
                        <Box maxWidth="calc(100% - 105px)" width="100%">
                            <CodeBlock>
                                {key ? key : 
                                <Link 
                                    sx={{ cursor: 'pointer' }}
                                    onClick={this.fetchAPIKey}
                                >
                                    Click to reveal
                                </Link>}
                            </CodeBlock>
                            <Typography
                                variant="body2"
                                sx={{ color: 'grey.700', marginLeft: '10px', marginTop: '10px' }}
                            >
                                Do NOT show this key to anyone
                            </Typography>
                        </Box>
                    </Box>
                </InnerContainer>
            </Root>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    user: state.user.data
});

const mapDispatchToProps = dispatch => ({
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(APIKeys);