import { describe, expect, it } from 'vitest';
import ToggleLikeComment from '../ToggleLikeComment.js';

describe('a ToggleLikeComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new ToggleLikeComment(payload))
      .toThrowError('TOGGLE_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new ToggleLikeComment(payload))
      .toThrowError('TOGGLE_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create toggleLikeComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const toggleLikeComment = new ToggleLikeComment(payload);

    // Assert
    expect(toggleLikeComment.threadId).toEqual(payload.threadId);
    expect(toggleLikeComment.commentId).toEqual(payload.commentId);
    expect(toggleLikeComment.userId).toEqual(payload.userId);
  });
});
