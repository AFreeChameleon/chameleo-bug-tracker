import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled
} from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { createComment } from '../../../../redux/ticket/actions';

type CommentsProps = {
    user: any;
    ticket: any;
    project: any;

    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => void;
}

type CommentsState = {
    newComment: string;
    selectedCommentIndex: number;
    editingComment: null | string;
}

const Main = styled('div')(({ theme }) => ({
    marginTop: '20px'
}))

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: '30px', 
    height: '30px', 
    fontSize: '17px'
}));

class Comments extends React.Component<CommentsProps, CommentsState> {
    constructor(props) {
        super(props);

        this.createComment = this.createComment.bind(this);

        this.state = {
            newComment: '',

            selectedCommentIndex: -1,
            editingComment: null
        }
    }

    createComment(e) {
        e.preventDefault();
        const { project, ticket, dispatchCreateComment } = this.props;
        const { newComment } = this.state;

        dispatchCreateComment(project.id, ticket.ticketNumber, newComment);
    }

    render() {
        const { ticket, user, project } = this.props;
        const { newComment } = this.state;

        return (
            <Main>
                <Typography
                    variant="subtitle1"
                >
                    Feedback
                </Typography>
                <Box display="flex" columnGap="15px" marginTop="15px">
                    <SmallAvatar

                    >
                        {user.firstName[0].toUpperCase()}
                    </SmallAvatar>
                    <Box component="form" width="100%" onSubmit={this.createComment}>
                        <TextField
                            fullWidth
                            multiline
                            size="small"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => this.setState({ newComment: e.target.value })}
                        />
                    </Box>
                </Box>
                {ticket.comments.map((comment) => (
                    <Box display="flex" columnGap="15px" marginTop="15px" key={comment.id}>
                        <SmallAvatar>
                            {comment.user.firstName[0].toUpperCase()}
                        </SmallAvatar>
                        <Box>
                            <Box display="flex" columnGap="15px">
                                <Typography variant="subtitle1" sx={{ lineHeight: '1.5' }}>
                                    {comment.user.firstName} {comment.user.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: '1.8' }}>
                                    {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Box marginTop="5px">
                                <Typography>
                                    {comment.message}
                                </Typography>
                            </Box>
                            <Box marginTop="15px" display="flex" columnGap="10px">
                                <Typography variant="body2" sx={{fontWeight: 600, textDecoration: 'underline', cursor: 'pointer'}}>
                                    Edit
                                </Typography>
                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                    |
                                </Typography>
                                <Typography variant="body2" sx={{fontWeight: 600, textDecoration: 'underline', cursor: 'pointer'}}>
                                    Delete                                    
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )) }
            </Main>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    ticket: state.ticket.data,
    project: state.project.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => dispatch(createComment(projectId, ticketNumber, message))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(Comments);