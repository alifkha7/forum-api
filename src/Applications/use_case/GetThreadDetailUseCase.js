import DetailComment from '../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = rawComments.map((comment) => comment.id);

    const [rawReplies, rawLikeCounts] = await Promise.all([
      this._commentRepository.getRepliesByThreadId(threadId),
      this._likeRepository.getLikeCountsByCommentIds(commentIds),
    ]);

    const likeCountMap = rawLikeCounts.reduce((acc, row) => {
      acc[row.comment_id] = row.like_count;
      return acc;
    }, {});

    // Group replies by parent comment
    const repliesByCommentId = rawReplies.reduce((acc, reply) => {
      const parentCommentId = reply.reply_to;
      if (!acc[parentCommentId]) {
        acc[parentCommentId] = [];
      }

      const detailReply = new DetailReply({
        id: reply.id,
        username: reply.username,
        date: reply.date,
        content: reply.content,
        isDelete: reply.is_delete,
      });

      acc[parentCommentId].push({
        id: detailReply.id,
        content: detailReply.content,
        date: detailReply.date,
        username: detailReply.username,
      });

      return acc;
    }, {});

    const comments = rawComments.map((comment) => {
      const commentReplies = repliesByCommentId[comment.id] || [];
      const likeCount = likeCountMap[comment.id] || 0;

      const detailComment = new DetailComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        isDelete: comment.is_delete,
        replies: commentReplies,
        likeCount,
      });

      return {
        id: detailComment.id,
        username: detailComment.username,
        date: detailComment.date,
        content: detailComment.content,
        likeCount: detailComment.likeCount,
        replies: detailComment.replies,
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
