import React from 'react';

import { styled } from '@mui/system';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

type CreateModalProps = {
    open: boolean;
    onClose: () => void;
}

type CreateModalState = {
    ticket: any;
}

const ModalBody = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    padding: '20px'
}));

const GridBody = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'auto 300px',
    columnGap: '20px'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}))

class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
    constructor(props) {
        super(props);

        this.state = {
            ticket: {
                name: '',
                description: '',
                attachments: '',
                status: 3,
                priority: 2,
                tags: [],
                assignedTo: -1
            }
        }
    }

    render() {
        const { open, onClose } = this.props;
        const { ticket } = this.state;

        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <GridBody>
                        <div>
                            <TextField
                                fullWidth
                                label="Ticket name"
                                variant="standard"
                            />
                        </div>
                        <div>
                            <Paper variant="outlined" sx={{
                                padding: '10px'
                            }}>
                                <Stack spacing={2}>
                                    <FlexDiv>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                width: '50%'
                                            }}
                                        >
                                            Status:
                                        </Typography>
                                        <Select
                                            variant="standard"
                                            size="small"
                                            fullWidth
                                            value={ticket.status}
                                            onChange={(e) => this.setState({
                                                ticket: {
                                                    ...ticket,
                                                    status: e.target.value
                                                }
                                            })}
                                            sx={{
                                                width: '50%'
                                            }}
                                        >
                                            <MenuItem value={0}>Todo</MenuItem>
                                            <MenuItem value={1}>In progress</MenuItem>
                                            <MenuItem value={2}>Waiting for review</MenuItem>
                                            <MenuItem value={3}>Unassigned</MenuItem>
                                        </Select>
                                    </FlexDiv>
                                    <FlexDiv>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                width: '50%'
                                            }}
                                        >
                                            Priority:
                                        </Typography>
                                        <Select
                                            variant="standard"
                                            size="small"
                                            fullWidth
                                            value={ticket.priority}
                                            onChange={(e) => this.setState({
                                                ticket: {
                                                    ...ticket,
                                                    priority: e.target.value
                                                }
                                            })}
                                            sx={{
                                                width: '50%'
                                            }}
                                        >
                                            <MenuItem value={0}>Critical</MenuItem>
                                            <MenuItem value={1}>High</MenuItem>
                                            <MenuItem value={2}>Medium</MenuItem>
                                            <MenuItem value={3}>Low</MenuItem>
                                            <MenuItem value={4}>Very low</MenuItem>
                                        </Select>
                                    </FlexDiv>
                                </Stack>
                            </Paper>
                        </div>
                    </GridBody>
                </ModalBody>
            </Modal>
        )
    }
}

export default CreateModal;