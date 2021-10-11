import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

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
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';

import AddIcon from '@mui/icons-material/Add';

type CreateModalProps = {
    open: boolean;
    onClose: () => void;
    user: any;
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
}));

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px'
}));

class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
    constructor(props) {
        super(props);

        this.createTicket = this.createTicket.bind(this)
        this.state = {
            ticket: {
                name: '',
                description: '',
                attachments: '',
                status: 3,
                priority: 2,
                tags: [],
                assignedTo: '',
                estimate: ''
            }
        }
    }

    createTicket(e) {

    }

    render() {
        const { open, onClose, user } = this.props;
        const { ticket } = this.state;
        console.log(user)
        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        gutterBottom
                        variant="subtitle1"
                    >
                        New ticket
                    </Typography>
                    <GridBody>
                        <div>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    variant="standard"
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Description"
                                    variant="outlined"
                                />
                                <Typography
                                    variant="subtitle2"
                                >
                                    Attachments
                                </Typography>
                                {/* <FlexDiv>
                                </FlexDiv> */}
                                <label htmlFor="new-ticket-upload-button" style={{ width: 'fit-content' }}>
                                    <Input 
                                        sx={{display: 'none'}} 
                                        inputProps={{
                                            accept: "image/*"
                                        }} 
                                        id="new-ticket-upload-button" 
                                        type="file"
                                    />
                                    <IconButton color="primary" component="span" size="small">
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </label>
                                <SmallButton
                                    variant="contained"
                                    onClick={this.createTicket}
                                >
                                    CREATE
                                </SmallButton>
                            </Stack>
                        </div>
                        <div>
                            <Stack spacing={2}>
                                <Select
                                    variant="filled"
                                    fullWidth
                                    label="Project"
                                    value={ticket.status}
                                    onChange={(e) => this.setState({
                                        ticket: {
                                            ...ticket,
                                            status: e.target.value
                                        }
                                    })}
                                    sx={{
                                        marginTop: '7px',
                                        backgroundColor: (theme) => `${theme.palette.primary.light} !important`,
                                        border: 'none',
                                        color: 'primary.contrastText',
                                        '&:before': {
                                            border: 'none !important'
                                        },
                                        '&:after': {
                                            border: 'none !important'
                                        },
                                        '& > svg': {
                                            fill: '#fff'
                                        },
                                        '& > .MuiInputBase-input': {
                                            paddingTop: '10px'
                                        }
                                    }}
                                >
                                    {/* <MenuItem value={0}>Todo</MenuItem>
                                    <MenuItem value={1}>In progress</MenuItem>
                                    <MenuItem value={2}>Waiting for review</MenuItem>
                                    <MenuItem value={3}>Done</MenuItem> */}
                                    { user.projects.map((project) => (
                                        <MenuItem value={project.name}>{project.name}</MenuItem>
                                    )) }
                                </Select>
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
                                                <MenuItem value={3}>Done</MenuItem>
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
                                        <FlexDiv>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: '50%'
                                                }}
                                            >
                                                Tags:
                                            </Typography>
                                            <Autocomplete
                                                multiple
                                                size="small"
                                                fullWidth
                                                options={[]}
                                                limitTags={3}
                                                value={ticket.tags}
                                                noOptionsText="No tags"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                    />
                                                )}
                                                sx={{
                                                    width: '50%'
                                                }}
                                            />
                                        </FlexDiv>
                                        <FlexDiv>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: '50%'
                                                }}
                                            >
                                                Estimate:
                                            </Typography>
                                            <TextField
                                                sx={{
                                                    width: '50%'
                                                }}
                                                fullWidth
                                                variant="standard"
                                                value={ticket.estimate}
                                            />
                                        </FlexDiv>
                                        <FlexDiv>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: '50%'
                                                }}
                                            >
                                                Assigned To:
                                            </Typography>
                                            <Autocomplete
                                                size="small"
                                                fullWidth
                                                options={[]}
                                                limitTags={3}
                                                value={ticket.assignedTo}
                                                renderOption={(e) => <div>scoopitypoop</div>}
                                                noOptionsText="No users"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                    />
                                                )}
                                                sx={{
                                                    width: '50%'
                                                }}
                                            />
                                        </FlexDiv>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </div>
                    </GridBody>
                </ModalBody>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
})

export default compose<any>(
    connect(mapStateToProps)
)(CreateModal);