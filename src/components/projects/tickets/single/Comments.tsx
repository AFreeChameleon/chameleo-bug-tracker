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
    editComment
} from '../../../../redux/ticket/actions';

import Comment from './Comment';

type CommentsProps = {
    user: any;
    ticket: any;
    project: any;

    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => void;
    dispatchEditComment: (projectId: string, ticketNumber: number, comment: any) => void;
}

type CommentsState = {
    newComment: string;
    selectedCommentIndex: number;
    editingComment: null | any;
}

const Main = styled('div')(({ theme }) => ({
    marginTop: '20px'
}))

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

class Comments extends React.Component<CommentsProps, CommentsState> {
    constructor(props) {
        super(props);

        this.createComment = this.createComment.bind(this);
        this.saveEditedComment = this.saveEditedComment.bind(this);

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

    saveEditedComment(e) {
        const { project, ticket, dispatchEditComment } = this.props;
        const { editingComment } = this.state;

        this.setState({ editingComment: null });
        dispatchEditComment(project.id, ticket.ticketNumber, editingComment);
    }

    render() {
        const { ticket, user, project } = this.props;
        const { newComment, editingComment } = this.state;

        return (
            <Main>
                <Typography
                    variant="subtitle1"
                >
                    Feedback
                </Typography>
                <CommentContainer>
                    <SmallAvatar>
                        {user.firstName[0].toUpperCase()}
                    </SmallAvatar>
                    <Box component="form" width="100%" onSubmit={this.createComment}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => this.setState({ newComment: e.target.value })}
                        />
                    </Box>
                </CommentContainer>
                { ticket.comments.map((comment) => {
                    return <Comment comment={comment} key={comment.id} />
                    // if (editingComment && editingComment.id === comment.id) {
                    //     return (
                    //         <CommentContainer key={comment.id}>
                    //             <SmallAvatar>
                    //                 {comment.user.firstName[0].toUpperCase()}
                    //             </SmallAvatar>
                    //             <Box width="100%">
                    //                 <Box display="flex" columnGap="15px">
                    //                     <Typography 
                    //                         variant="subtitle1" 
                    //                         sx={{ lineHeight: '1.5' }}
                    //                     >
                    //                         {comment.user.firstName} {comment.user.lastName}
                    //                     </Typography>
                    //                     <Typography 
                    //                         variant="body2" 
                    //                         sx={{ lineHeight: '1.8' }}
                    //                     >
                    //                         {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    //                     </Typography>
                    //                 </Box>
                    //                 <TextField
                    //                     fullWidth
                    //                     multiline
                    //                     size="small"
                    //                     sx={{ marginTop: '5px' }}
                    //                     value={editingComment.message}
                    //                     onChange={(e) => this.setState({ editingComment: {
                    //                         ...editingComment,
                    //                         message: e.target.value
                    //                     } })}
                    //                 />
                    //                 <Box 
                    //                     marginTop="15px"
                    //                     display="flex"
                    //                     columnGap="10px"
                    //                 >
                    //                     <CommentActionTypography 
                    //                         variant="body2"
                    //                         onClick={this.saveEditedComment}
                    //                     >
                    //                         Save
                    //                     </CommentActionTypography>
                    //                     <Typography 
                    //                         variant="body2" 
                    //                         sx={{fontWeight: 600}}
                    //                     >
                    //                         |
                    //                     </Typography>
                    //                     <CommentActionTypography 
                    //                         variant="body2"
                    //                         onClick={() => this.setState({ editingComment: null })}
                    //                     >
                    //                         Cancel                                    
                    //                     </CommentActionTypography>
                    //                 </Box>
                    //             </Box>
                    //         </CommentContainer>
                    //     )
                    // }

                    // return (
                    //     <CommentContainer key={comment.id}>
                    //         <SmallAvatar>
                    //             {comment.user.firstName[0].toUpperCase()}
                    //         </SmallAvatar>
                    //         <Box>
                    //             <Box display="flex" columnGap="15px">
                    //                 <Typography 
                    //                     variant="subtitle1" 
                    //                     sx={{ lineHeight: '1.5' }}
                    //                 >
                    //                     {comment.user.firstName} {comment.user.lastName}
                    //                 </Typography>
                    //                 <Typography 
                    //                     variant="body2" 
                    //                     sx={{ lineHeight: '1.8' }}
                    //                 >
                    //                     {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    //                 </Typography>
                    //             </Box>
                    //             <Box marginTop="5px">
                    //                 <Typography>
                    //                     {comment.message}
                    //                 </Typography>
                    //             </Box>
                    //             <Box 
                    //                 marginTop="15px"
                    //                 display="flex"
                    //                 columnGap="10px"
                    //             >
                    //                 <CommentActionTypography 
                    //                     variant="body2"
                    //                     onClick={() => this.setState({ editingComment: { ...comment } })}
                    //                 >
                    //                     Edit
                    //                 </CommentActionTypography>
                    //                 <Typography 
                    //                     variant="body2" 
                    //                     sx={{fontWeight: 600}}
                    //                 >
                    //                     |
                    //                 </Typography>
                    //                 <CommentActionTypography 
                    //                     variant="body2"
                    //                 >
                    //                     Delete                                    
                    //                 </CommentActionTypography>
                    //             </Box>
                    //         </Box>
                    //     </CommentContainer>
                    // )
                }) }
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
    dispatchCreateComment: (projectId: string, ticketNumber: number, message: string) => dispatch(createComment(projectId, ticketNumber, message)),
    dispatchEditComment: (projectId: string, ticketNumber: number, comment: any) => dispatch(editComment(projectId, ticketNumber, comment))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(Comments);