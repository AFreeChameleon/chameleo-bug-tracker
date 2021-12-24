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
import TabUnstyled from '@mui/base/TabUnstyled';
import TabPanelUnstyled  from '@mui/base/TabPanelUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';

const Root = styled('div')(({ theme }) => ({
    marginTop: '40px'
}));

const CodeBlock = styled('pre')(({ theme }: any) => ({
    ...(theme.typography as any).body2,
    padding: '5px 10px',
    wordWrap: 'break-word',
    borderRadius: theme.shape.borderRadius,
    fontFamily: "'Source Code Pro', monospace",
    letterSpacing: '0.5px'
}));

const Tab = styled(TabUnstyled)(({ theme }) => ({
    ...(theme.typography as any).body1,
    backgroundColor: theme.palette.background.light,
    padding: '10px 0',
    width: '150px',
    border: `1px solid ${theme.palette.grey['200']}`,
    cursor: 'pointer',
    borderRight: 'none',
    borderBottom: 'none',
    '&:first-of-type': {
        borderTopLeftRadius: '6px',
    },
    '&:last-of-type': {
        borderTopRightRadius: '6px',
        borderRight: `1px solid ${theme.palette.grey['200']}`,
    },
}));

const TabPanel = styled(TabPanelUnstyled)(({ theme }) => ({
    backgroundColor: theme.palette.background.light,
    border: `1px solid ${theme.palette.grey['200']}`,
    borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px',
    borderBottomLeftRadius: '6px',
    padding: '10px 15px',
    fontFamily: "'Source Code Pro', monospace",
}));

type GetOneTicketProps = {
    project: any;
    user: any;
}

type GetOneTicketState = {
    selectedTab: number;
}

class GetOneTicket extends React.Component<GetOneTicketProps, GetOneTicketState> {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 0
        }
    }

    render() {
        const { project, user } = this.props;
        const { selectedTab } = this.state;

        return (
            <Root>
                <Typography
                    gutterBottom
                    variant="h5"
                >
                    Get one ticket
                </Typography>
                <Box marginTop="20px">
                    <Box display="flex" alignItems="center" padding="10px" borderRadius="6px" sx={{
                        backgroundColor: 'background.light',
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                padding: '0 15px',
                                borderRight: `2px solid #fff`,
                                fontFamily: "'Source Code Pro', monospace",
                            }}
                        >
                            GET
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                padding: '0 15px',
                                fontFamily: "'Source Code Pro', monospace",
                            }}
                        >
                            https://parson-api.chameleo.dev/tickets/&#123;ticketNumber&#125;
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    gutterBottom
                    variant="h6"
                    sx={{ marginTop: '20px' }}
                >
                    Example response
                </Typography>
                <Box marginTop="20px">
                    <TabsUnstyled defaultValue={0}>
                        <TabsListUnstyled>
                            <Tab>Response body</Tab>
                        </TabsListUnstyled>
                        <TabPanel value={0}>
                            <CodeBlock style={{ margin: '0' }}>
                                {JSON.stringify({
                                    "ticket": {
                                        "name": "IMPORTANT! Website down",
                                        "description": "When accessing /home users get a 504 error.",
                                        "status": "In progress",
                                        "assignedTo": "example@email.com",
                                        "createdBy": "productowner@email.com"
                                    }
                                }, null, 4)}
                            </CodeBlock>
                        </TabPanel>
                    </TabsUnstyled>
                </Box>
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
)(GetOneTicket);