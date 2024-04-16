import { Comment } from "../comment.entity";

export class CommentDTO {
    id: number;
    username: string;
    comment: string;
    like: number;

    constructor(comment: Comment) {
        this.id = comment.id;
        this.username = comment.user.username;
        this.comment = comment.comment;
        this.like = comment.like;
    }
}