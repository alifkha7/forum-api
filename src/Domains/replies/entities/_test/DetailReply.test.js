import { describe, expect, it } from 'vitest';
import DetailReply from '../DetailReply.js';

describe('a DetailReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah balasan',
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object with original content when isDelete is false', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah balasan',
      isDelete: false,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual('sebuah balasan');
  });

  it('should mask content as "**balasan telah dihapus**" when isDelete is true (Tip 3)', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2026-10-17T00:00:00.000Z',
      content: 'sebuah balasan',
      isDelete: true,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });
});
