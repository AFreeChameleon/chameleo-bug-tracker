import React from 'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled, alpha } from '@mui/system';

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
import CloseIcon from '@mui/icons-material/Close';

import { setAlerts } from '../../../redux/alerts/actions';
import { fetchProjectDetails } from '../../../redux/project/actions';

type CreateModalProps = {
    open: boolean;
    onClose: () => void;
    user: any;
    project: any;
    dispatchSetAlerts: (value: any) => void;
    dispatchFetchProjectDetails: (company: string) => void;
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

const NoArrowAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-endAdornment': {
        display: 'none'
    }
}));

const AttachmentContainer = styled('div')(({ theme }) => ({
    height: '100px',
    width: '100px',
    boxShadow: theme.shadows[2],
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
}));

const AttachmentDescription = styled(Typography)(({ theme }) => ({
    width: '100%',
    backgroundColor: alpha(theme.palette.primary.main, 0.7),
    padding: '2px 5px',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    }
}));

const AttachmentClose = styled('div')(({ theme }) => ({
    textAlign: 'right',
    width: '100%'
}));

class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
    constructor(props) {
        super(props);

        this.createTicket = this.createTicket.bind(this);
        this.addAttachment = this.addAttachment.bind(this);
        this.state = {
            ticket: {
                name: '',
                description: '',
                attachments: [],
                status: 0,
                priority: 2,
                tags: [],
                assignedTo: '',
                estimate: ''
            },
        }
    }

    async createTicket(e) {
        const { onClose, project, user, dispatchSetAlerts, dispatchFetchProjectDetails } = this.props;
        const { ticket } = this.state;
        console.log(ticket, Boolean(ticket.description))
        if (!Boolean(ticket.name)) {
            dispatchSetAlerts([ {
                type: 'error',
                message: 'Name is required.'
            } ]);
            return;
        } else {
            const res = await axios.post('/api/ticket/new', {
                name: ticket.name,
                description: ticket.description,
                tags: [],
                project_company: project.company,
                status: ticket.status,
                priority: ticket.priority,
                assignedTo: ticket.assignedTo,
                estimate: ticket.estimate,
            }, { withCredentials: true });
            dispatchFetchProjectDetails(project.company);
            onClose();
        }
    }

    addAttachment(e) {
        const { ticket } = this.state;
        console.log(e.target.files)
        this.setState({
            ticket: {
                ...ticket,
                attachments: [...ticket.attachments, {
                    data: URL.createObjectURL(e.target.files[0]),
                    name: e.target.files[0].name,
                    size: e.target.files[0].size
                }]
            }
        })
    }

    render() {
        const { open, onClose, user, project } = this.props;
        const { ticket } = this.state;
        console.log(ticket)
        return (project && project.user) ? (
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
                                    value={ticket.name}
                                    onChange={(e) => this.setState({
                                        ticket: {
                                            ...ticket,
                                            name: e.target.value
                                        }
                                    })}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Description"
                                    variant="outlined"
                                    value={ticket.description}
                                    onChange={(e) => this.setState({
                                        ticket: {
                                            ...ticket,
                                            description: e.target.value
                                        }
                                    })}
                                />
                                <Typography
                                    variant="subtitle2"
                                >
                                    Attachments
                                </Typography>
                                <FlexDiv
                                    sx={{
                                        justifyContent: 'normal',
                                        columnGap: '10px'
                                    }}
                                >
                                    { ticket.attachments.map((a) => (
                                        <AttachmentContainer
                                            sx={{
                                                backgroundImage: `url('${a.data}')`,
                                            }}
                                        >
                                            <AttachmentClose>
                                                <CloseIcon fontSize="small" sx={{
                                                    fill: (theme) => theme.palette.primary.main
                                                }}/>
                                            </AttachmentClose>
                                            <AttachmentDescription
                                                variant="caption"
                                                color="white"
                                            >
                                                {a.name}
                                            </AttachmentDescription>
                                        </AttachmentContainer>
                                    )) }
                                </FlexDiv>
                                <label htmlFor="new-ticket-upload-button" style={{ width: 'fit-content' }}>
                                    <Input 
                                        sx={{display: 'none'}} 
                                        inputProps={{
                                            accept: "image/*"
                                        }} 
                                        id="new-ticket-upload-button" 
                                        type="file"
                                        onChange={this.addAttachment}
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
                                {/* <Select
                                    variant="filled"
                                    fullWidth
                                    label="Project"
                                    defaultValue={project.name}
                                    onChange={(e) => this.setState({
                                        selectedProject: e.target.value
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
                                    { user.projects.map((project, i) => (
                                        <MenuItem key={i} value={project.name}>{project.name}</MenuItem>
                                    )) }
                                </Select> */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        marginTop: '2px'
                                    }}
                                >
                                    {project.name}
                                </Typography>
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
                                            <NoArrowAutocomplete
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
                                                onChange={(e) => this.setState({
                                                    ticket: {
                                                        ...ticket,
                                                        estimate: e.target.value
                                                    }
                                                })}
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
                                            <NoArrowAutocomplete
                                                size="small"
                                                fullWidth
                                                options={[]}
                                                limitTags={3}
                                                defaultValue={`${project.user.firstName} ${project.user.lastName}`}
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
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    project: state.project.data
})

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (value: any[]) => dispatch(setAlerts(value)),
    dispatchFetchProjectDetails: (company: string) => dispatch(fetchProjectDetails(company))
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateModal);