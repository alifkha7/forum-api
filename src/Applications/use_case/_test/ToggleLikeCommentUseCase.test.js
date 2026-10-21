import {
  describe, expect, it, vi,
} from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should throw error if use case payload does not contain needed property', async () => {
    // Arrange
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({});

    // Action & Assert
    await expect(toggleLikeCommentUseCase.execute({ threadId: 'thread-123' }))
      .rejects.toThrowError('TOGGLE_LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload does not meet data type specification', async () => {
    // Arrange
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({});

    // Action & Assert
    await expect(toggleLikeCommentUseCase.execute({
      threadId: 123,
      commentId: 'comment-123',
      userId: 'user-123',
    })).rejects.toThrowError('TOGGLE_LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate the like action correctly when comment is not liked yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.isCommentLiked = vi.fn().mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isCommentLiked).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.likeComment).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should orchestrate the unlike action correctly when comment is already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.isCommentLiked = vi.fn().mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.unlikeComment = vi.fn().mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isCommentLiked).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.unlikeComment).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});
