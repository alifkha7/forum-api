import { describe, expect, it, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableReply = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyReplyOwner = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteReply = vi.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(threadId, commentId, replyId, owner);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyAvailableReply).toHaveBeenCalledWith(replyId);
    expect(mockCommentRepository.verifyReplyOwner).toHaveBeenCalledWith(replyId, owner);
    expect(mockCommentRepository.deleteReply).toHaveBeenCalledWith(replyId);
  });
});
