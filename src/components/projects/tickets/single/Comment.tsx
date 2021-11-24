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
import { 
    createComment,
    editComment,
    deleteComment
} from '../../../../redux/ticket/actions';

type CommentProps = {
    user: any;
    ticket: any;
    project: any;
    comment: any;

    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => void;
    dispatchEditComment: (projectId: string, ticketNumber: number, comment: any) => void;
    dispatchDeleteComment: (projectId: string, ticketNumber: number, commentId: number) => void;
} 

type CommentState = {
    editingComment: null | any;
    deletingComment: null | any;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: '30px', 
    height: '30px', 
    fontSize: '17px'
}));

const CommentActionTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 600, 
    textDecoration: 'underline', 
    cursor: 'pointer'
}));

const CommentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    marginTop: '15px'
}))

class Comment extends React.Component<CommentProps, CommentState> {
    constructor(props) {
        super(props);

        this.createLoadingComment = this.createLoadingComment.bind(this);
        this.createEditingComment = this.createEditingComment.bind(this);
        this.createDeletingComment = this.createDeletingComment.bind(this);
        this.saveEditedComment = this.saveEditedComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);

        this.state = {
            editingComment: null,
            deletingComment: null
        }
    }

    saveEditedComment(e) {
        e.preventDefault();
        const { project, ticket, dispatchEditComment } = this.props;
        const { editingComment } = this.state;

        this.setState({ editingComment: null });
        dispatchEditComment(project.id, ticket.ticketNumber, editingComment);
    }

    deleteComment(e) {
        e.preventDefault();
        const { project, ticket, dispatchDeleteComment } = this.props;
        const { deletingComment } = this.state;

        this.setState({ deletingComment: null });
        dispatchDeleteComment(project.id, ticket.ticketNumber, deletingComment.id);
    }

    createLoadingComment() {
        const { user, project, comment } = this.props;

        return (
            <CommentContainer>
                <SmallAvatar>
                    {user.firstName[0].toUpperCase()}
                </SmallAvatar>
                <Box>
                    <Box display="flex" columnGap="15px">
                        <Typography 
                            variant="subtitle1" 
                            sx={{ lineHeight: '1.5', color: (theme) => theme.palette.grey['500'] }}
                        >
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ lineHeight: '1.8', color: (theme) => theme.palette.grey['500'] }}
                        >
                            {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <Box marginTop="5px">
                        <Typography sx={{ color: (theme) => theme.palette.grey['500'] }}>
                            {comment.message}
                        </Typography>
                    </Box>
                </Box>
            </CommentContainer>
        )
    }

    createEditingComment() {
        const { comment } = this.props;
        const { editingComment } = this.state;

        return (
            <CommentContainer>
                <SmallAvatar>
                    {comment.user.firstName[0].toUpperCase()}
                </SmallAvatar>
                <Box width="100%" component="form" onSubmit={this.saveEditedComment}>
                    <Box display="flex" columnGap="15px">
                        <Typography 
                            variant="subtitle1" 
                            sx={{ lineHeight: '1.5' }}
                        >
                            {comment.user.firstName} {comment.user.lastName}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ lineHeight: '1.8' }}
                        >
                            {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        size="small"
                        sx={{ marginTop: '5px' }}
                        value={editingComment.message}
                        onChange={(e) => this.setState({ editingComment: {
                            ...editingComment,
                            message: e.target.value
                        } })}
                    />
                    <Box 
                        marginTop="15px"
                        display="flex"
                        columnGap="10px"
                    >
                        <CommentActionTypography 
                            variant="body2"
                            onClick={this.saveEditedComment}
                        >
                            Save
                        </CommentActionTypography>
                        <Typography 
                            variant="body2" 
                            sx={{fontWeight: 600}}
                        >
                            |
                        </Typography>
                        <CommentActionTypography 
                            variant="body2"
                            onClick={() => this.setState({ editingComment: null })}
                        >
                            Cancel                                    
                        </CommentActionTypography>
                    </Box>
                </Box>
            </CommentContainer>
        )
    }

    createDeletingComment() {
        const { comment } = this.props;

        return (
            <CommentContainer>
                <SmallAvatar>
                    {comment.user.firstName[0].toUpperCase()}
                </SmallAvatar>
                <Box width="100%">
                    <Box display="flex" columnGap="15px">
                        <Typography 
                            variant="subtitle1" 
                            sx={{ lineHeight: '1.5' }}
                        >
                            {comment.user.firstName} {comment.user.lastName}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ lineHeight: '1.8' }}
                        >
                            {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <Box marginTop="5px">
                        <Typography>
                            Are you sure?
                        </Typography>
                    </Box>
                    <Box 
                        marginTop="15px"
                        display="flex"
                        columnGap="10px"
                    >
                        <CommentActionTypography 
                            variant="body2"
                            onClick={this.deleteComment}
                        >
                            Yes
                        </CommentActionTypography>
                        <Typography 
                            variant="body2" 
                            sx={{fontWeight: 600}}
                        >
                            |
                        </Typography>
                        <CommentActionTypography 
                            variant="body2"
                            onClick={() => this.setState({ deletingComment: null })}
                        >
                            No                                    
                        </CommentActionTypography>
                    </Box>
                </Box>
            </CommentContainer>
        )
    }

    render() {
        const { comment } = this.props;
        const { editingComment, deletingComment } = this.state;

        if (comment.creating) {
            return this.createLoadingComment();
        }

        if (editingComment && (editingComment.id === comment.id)) {
            return this.createEditingComment();
        }

        if (deletingComment && (deletingComment.id === comment.id)) {
            return this.createDeletingComment();
        }

        return (
            <CommentContainer>
                <SmallAvatar>
                    {comment.user.firstName[0].toUpperCase()}
                </SmallAvatar>
                <Box>
                    <Box display="flex" columnGap="15px">
                        <Typography 
                            variant="subtitle1" 
                            sx={{ lineHeight: '1.5' }}
                        >
                            {comment.user.firstName} {comment.user.lastName}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ lineHeight: '1.8' }}
                        >
                            {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <Box marginTop="5px">
                        <Typography>
                            {comment.message}
                        </Typography>
                    </Box>
                    <Box 
                        marginTop="15px"
                        display="flex"
                        columnGap="10px"
                    >
                        <CommentActionTypography 
                            variant="body2"
                            onClick={() => this.setState({ editingComment: { ...comment } })}
                        >
                            Edit
                        </CommentActionTypography>
                        <Typography 
                            variant="body2" 
                            sx={{fontWeight: 600}}
                        >
                            |
                        </Typography>
                        <CommentActionTypography 
                            variant="body2"
                            onClick={() => this.setState({ deletingComment: { ...comment } })}
                        >
                            Delete                                    
                        </CommentActionTypography>
                    </Box>
                </Box>
            </CommentContainer>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    ticket: state.ticket.data,
    project: state.project.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => dispatch(createComment(projectId, ticketNumber, message)),
    dispatchEditComment: (projectId: string, ticketNumber: number, comment: any) => dispatch(editComment(projectId, ticketNumber, comment)),
    dispatchDeleteComment: (projectId: string, ticketNumber: number, commentId: number) => dispatch(deleteComment(projectId, ticketNumber, commentId)),
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(Comment);