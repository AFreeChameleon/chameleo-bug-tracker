import React from 'react';
import NextLink from 'next/link';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled,
    alpha
} from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';

import SaveIcon from '@mui/icons-material/Save';

import { setAlerts } from '../../redux/alerts/actions';
import { fetchUserData } from '../../redux/user/actions';

type ProjectTableProps = {
    newProjectRowOpen: boolean;
    setNewProjectRowOpen: (val: boolean) => void;
    user: any;
    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
}

type ProjectTableState = {
    newProject: {
        name: string;
        key: string;
        company: string;
    }
}

const CheckboxTableCell = styled(TableCell)(({ theme }) => ({
    padding: '0 10px',
    width: '50px'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center'
}))

class ProjectTable extends React.Component<ProjectTableProps, ProjectTableState> {
    constructor(props) {
        super(props);

        this.saveNewProject = this.saveNewProject.bind(this);
        this.state = {
            newProject: {
                name: '',
                key: '',
                company: ''
            }
        }
    }

    saveNewProject(e) {
        e.preventDefault();
        const { dispatchSetAlerts, dispatchFetchUserData, setNewProjectRowOpen } = this.props;
        const { newProject } = this.state;

        axios.post('/api/project/new', {
            name: newProject.name,
            key: newProject.key,
            company: newProject.company
        }, { withCredentials: true })
        .then((res) => {
            dispatchSetAlerts([]);
            dispatchFetchUserData();
        })
        .catch((err) => {
            if (err.response) {
                dispatchSetAlerts(err.response.data.errors.map((e) => ({
                    type: 'error',
                    message: e
                })));
            } else {
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while creating your project. Please try again later.' } ])
            }
        })
        .finally(() => {
            setNewProjectRowOpen(false);
        })
    }

    render() {
        const { newProjectRowOpen, user } = this.props;
        const { newProject } = this.state;
        return (
            <form action="/api/project/new" method="POST" onSubmit={this.saveNewProject}>
                <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <CheckboxTableCell>
                                    <Checkbox
                                        size="small"
                                    />
                                </CheckboxTableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Company</TableCell>
                                <TableCell align="left">Key</TableCell>
                                <TableCell align="left">Owner</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(user && user.projects) && user.projects.map((project, i) => (
                                <NextLink
                                    shallow 
                                    key={i}
                                    href={`/projects/${project.company}`} 
                                >
                                    <TableRow
                                        sx={{ 
                                            '&:last-child td, &:last-child th': { 
                                                border: 0 
                                            }, 
                                            cursor: 'pointer',
                                            '&:hover': (theme) => ({
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                            })
                                        } as any}
                                    >
                                        <CheckboxTableCell>
                                            <Checkbox
                                                size="small"
                                            />
                                        </CheckboxTableCell>
                                        <TableCell component="th" scope="row">
                                            {project.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {project.company}
                                        </TableCell>
                                        <TableCell>{project.key}</TableCell>
                                        <TableCell>
                                            <FlexDiv>
                                                <Avatar sx={{ height: 32, width: 32, paddingTop: '2px' }}>
                                                    {project.user.firstName.slice(0, 1)}
                                                </Avatar>
                                                {project.user.firstName} {project.user.lastName}
                                            </FlexDiv>
                                        </TableCell>
                                    </TableRow>
                                </NextLink>
                            ))}
                            { newProjectRowOpen && <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <CheckboxTableCell>
                                    <Tooltip title="Save">
                                        <IconButton
                                            onClick={this.saveNewProject}
                                            type="submit"
                                        >
                                            <SaveIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </CheckboxTableCell>
                                <TableCell component="th" scope="row">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="name"
                                        value={newProject.name}
                                        onChange={(e) => this.setState({
                                            newProject: {
                                                ...newProject,
                                                name: e.target.value
                                            }
                                        })}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="company"
                                        value={newProject.company}
                                        onChange={(e) => this.setState({
                                            newProject: {
                                                ...newProject,
                                                company: e.target.value
                                            }
                                        })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="key"
                                        value={newProject.key}
                                        onChange={(e) => this.setState({
                                            newProject: {
                                                ...newProject,
                                                key: e.target.value
                                            }
                                        })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FlexDiv>
                                        <Avatar sx={{ height: 32, width: 32, paddingTop: '2px' }}>
                                            {user.firstName.slice(0, 1)}
                                        </Avatar>
                                        {user.firstName} {user.lastName}
                                    </FlexDiv>
                                </TableCell>
                            </TableRow> }
                        </TableBody>
                    </Table>
                </TableContainer>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values)),
    dispatchFetchUserData: () => dispatch(fetchUserData())
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(ProjectTable);