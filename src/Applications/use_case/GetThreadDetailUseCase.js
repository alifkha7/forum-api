import DetailComment from '../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const rawReplies = await this._commentRepository.getRepliesByThreadId(threadId);

    // Group replies by parent comment
    const repliesByCommentId = rawReplies.reduce((acc, reply) => {
      if (!acc[reply.replyTo]) {
        acc[reply.replyTo] = [];
      }

      const detailReply = new DetailReply({
        id: reply.id,
        username: reply.username,
        date: reply.date,
        content: reply.content,
        isDelete: reply.isDelete,
      });

      acc[reply.replyTo].push({
        id: detailReply.id,
        content: detailReply.content,
        date: detailReply.date,
        username: detailReply.username,
      });

      return acc;
    }, {});

    const comments = rawComments.map((comment) => {
      const commentReplies = repliesByCommentId[comment.id] || [];

      const detailComment = new DetailComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        isDelete: comment.isDelete,
        replies: commentReplies,
      });

      return {
        id: detailComment.id,
        username: detailComment.username,
        date: detailComment.date,
        replies: detailComment.replies,
        content: detailComment.content,
      };
    });

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: typeof thread.date === 'string' ? thread.date : new Date(thread.date).toISOString(),
      username: thread.username,
      comments,
    };
  }
}

export default GetThreadDetailUseCase;
