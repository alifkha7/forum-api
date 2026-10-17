import { describe, expect, it, vi } from 'vitest';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addReply = vi.fn().mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, threadId, commentId, owner);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.addReply).toHaveBeenCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId,
      owner,
    }), commentId);
  });
});
