import React from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { compose } from "redux";
import { connect } from "react-redux";
import {
    addUserToProject,
    changeUserPermissions
} from '../../../redux/project/actions';
import { setAlerts, Alert } from '../../../redux/alerts/actions';

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
import ApiKeys from './body/ApiKeys';
import GetOneTicket from './body/GetOneTicket';
import GetMultipleTickets from './body/GetMultipleTickets';

const CodeBlock = styled('div')(({ theme }: any) => ({
    ...(theme.typography as any).body2,
    padding: '5px 10px',
    backgroundColor: theme.palette.background.light,
    wordWrap: 'break-word',
    borderRadius: theme.shape.borderRadius,
    fontFamily: "'Source Code Pro', monospace",
    letterSpacing: '0.5px',
    width: 'fit-content',
    display: 'inline',
    margin: '0 5px'
}));

type APIBodyProps = {
    project: any;
    user: any;
}

class APIBody extends React.Component<APIBodyProps> {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { project, user } = this.props;

        return (
            <Box>
                <ApiKeys />
                <Box marginTop="30px">
                    <Typography
                        variant="h4"
                    >
                        API documenation
                    </Typography>
                    <Box marginTop="30px">
                        <Typography
                            variant="h5"
                        >
                            Authentication
                        </Typography>
                        <Box marginTop="20px">
                            We verify your requests using your API key, so you need to include the API key with every request. 
                            If you don’t include one or use an incorrect or outdated one, the response will be a
                            <CodeBlock>
                                401 - Unauthorized
                            </CodeBlock>
                        </Box>
                        <Box marginTop="20px">
                            To include your API key, with every request send a header called 
                            <CodeBlock>
                                X-API-KEY
                            </CodeBlock>
                            with the value of your API key.
                        </Box>
                    </Box>
                </Box>
                <GetOneTicket />
                <GetMultipleTickets />
            </Box>
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
)(APIBody);