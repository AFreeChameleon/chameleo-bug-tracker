import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/system';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const Body = styled('div')(({ theme }) => ({
    marginTop: '30px'
}));

type ArchivedTicketsBodyProps = {
    project: any;
}

class ArchivedTicketsBody extends React.Component<ArchivedTicketsBodyProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { project } = this.props;

        return (
            <Body>
                <FlexDiv>
                    <TextField

                    />
                    <Button
                        variant="contained"
                    >
                        Restore
                    </Button>
                </FlexDiv>
                <TableContainer
                    component={Paper}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox

                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Ticket Number</TableCell>
                                <TableCell align="right">Created At</TableCell>
                                <TableCell align="right">Last Edited</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {project.tickets.map((t) => (
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox

                                        />
                                    </TableCell>
                                    <TableCell>{t.name}</TableCell>
                                    <TableCell align="right">{t.ticketNumber}</TableCell>
                                    <TableCell align="right">{t.createdAt}</TableCell>
                                    <TableCell align="right">{t.updatedAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Body>
        )
    }
}

const mapStateToProps = (state) => ({
    project: state.project.data,
})

export default compose<any>(
    connect(mapStateToProps)
)(ArchivedTicketsBody);