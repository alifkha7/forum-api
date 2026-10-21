import { describe, expect, it } from 'vitest';
import DetailComment from '../DetailComment.js';

describe('a DetailComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah comment',
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when likeCount did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah comment',
      isDelete: false,
      likeCount: '0',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object with original content when isDelete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual('sebuah comment');
    expect(detailComment.replies).toEqual([]);
    expect(detailComment.likeCount).toEqual(0);
  });

  it('should assign likeCount correctly when provided', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
      likeCount: 5,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.likeCount).toEqual(5);
  });

  it('should mask content as "**komentar telah dihapus**" when isDelete is true (Tip 3)', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah comment',
      isDelete: true,
      replies: [],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
});
