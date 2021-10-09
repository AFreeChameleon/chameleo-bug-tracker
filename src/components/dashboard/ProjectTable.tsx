import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled
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

import Checkbox from '@mui/material/Checkbox';

type ProjectTableProps = {
    newProjectRowOpen: boolean;
    user: any;
}

type ProjectTableState = {
    newProject: {
        name: string;
        key: string;
    }
}

const CheckboxTableCell = styled(TableCell)(({ theme }) => ({
    padding: '0 10px',
    width: '50px'
}));

class ProjectTable extends React.Component<ProjectTableProps, ProjectTableState> {
    constructor(props) {
        super(props);

        this.state = {
            newProject: {
                name: '',
                key: ''
            }
        }
    }

    render() {
        const { newProjectRowOpen, user } = this.props;
        const { newProject } = this.state;

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <CheckboxTableCell>
                                <Checkbox
                                    size="small"
                                />
                            </CheckboxTableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Key</TableCell>
                            <TableCell align="left">Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.projects.map((project) => (
                            <TableRow
                                key={project.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <CheckboxTableCell>
                                    <Checkbox
                                        size="small"
                                    />
                                </CheckboxTableCell>
                                <TableCell component="th" scope="row">
                                    {project.name}
                                </TableCell>
                                <TableCell>{project.key}</TableCell>
                                <TableCell>
                                    <Avatar sx={{ height: 32, width: 32, paddingTop: '2px' }}>
                                        {project.user.firstName.slice(0, 1)}
                                    </Avatar>
                                </TableCell>
                            </TableRow>
                        ))}
                        { newProjectRowOpen && <TableRow
                            key={newProject.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <CheckboxTableCell>
                                <Checkbox
                                    size="small"
                                />
                            </CheckboxTableCell>
                            <TableCell component="th" scope="row">
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={newProject.name}
                                    onChange={(e) => this.setState({
                                        newProject: {
                                            ...newProject,
                                            name: e.target.value
                                        }
                                    })}
                                />
                            </TableCell>
                            <TableCell>{newProject.key}</TableCell>
                            <TableCell>
                                <Avatar sx={{ height: 32, width: 32, paddingTop: '2px' }}>
                                    {user.firstName.slice(0, 1)}
                                </Avatar>
                                {user.firstName} {user.lastName}
                            </TableCell>
                        </TableRow> }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default compose<any>(
    connect(mapStateToProps)
)(ProjectTable);