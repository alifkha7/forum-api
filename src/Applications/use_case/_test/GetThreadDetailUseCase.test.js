import { describe, expect, it, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate get thread detail with comments and replies correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    // Tip 1: Mock raw database return (neutral)
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2026-10-17T00:00:00.000Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2026-10-17T01:00:00.000Z',
        content: 'komentar pertama',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: '2026-10-17T02:00:00.000Z',
        content: 'komentar kedua',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        reply_to: 'comment-1',
        username: 'dicoding',
        date: '2026-10-17T01:10:00.000Z',
        content: 'balasan pertama',
        is_delete: false,
      },
      {
        id: 'reply-2',
        reply_to: 'comment-1',
        username: 'johndoe',
        date: '2026-10-17T01:20:00.000Z',
        content: 'balasan kedua',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = vi.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockImplementation(() => Promise.resolve(mockComments));
    mockCommentRepository.getRepliesByThreadId = vi.fn().mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);

    expect(threadDetail).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2026-10-17T00:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2026-10-17T01:00:00.000Z',
          content: 'komentar pertama',
          replies: [
            {
              id: 'reply-1',
              username: 'dicoding',
              date: '2026-10-17T01:10:00.000Z',
              content: 'balasan pertama',
            },
            {
              id: 'reply-2',
              username: 'johndoe',
              date: '2026-10-17T01:20:00.000Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2026-10-17T02:00:00.000Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });
  });
});
