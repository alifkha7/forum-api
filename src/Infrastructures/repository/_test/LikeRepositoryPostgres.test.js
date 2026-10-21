import {
  afterAll, afterEach, describe, expect, it,
} from 'vitest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should persist like in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.likeComment('user-123', 'comment-123');

      // Assert
      const likes = await LikesTableTestHelper.findLike({ userId: 'user-123', commentId: 'comment-123' });
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toBe('like-123');
    });
  });

  describe('unlikeComment function', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.likeComment({ id: 'like-123', userId: 'user-123', commentId: 'comment-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.unlikeComment('user-123', 'comment-123');

      // Assert
      const likes = await LikesTableTestHelper.findLike({ userId: 'user-123', commentId: 'comment-123' });
      expect(likes).toHaveLength(0);
    });
  });

  describe('isCommentLiked function', () => {
    it('should return true when comment is already liked by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.likeComment({ id: 'like-123', userId: 'user-123', commentId: 'comment-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      const isLiked = await likeRepositoryPostgres.isCommentLiked('user-123', 'comment-123');
      expect(isLiked).toBe(true);
    });

    it('should return false when comment is not liked by user', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      const isLiked = await likeRepositoryPostgres.isCommentLiked('user-123', 'comment-123');
      expect(isLiked).toBe(false);
    });
  });

  describe('getLikeCountsByCommentIds function', () => {
    it('should return empty array if commentIds is empty', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await likeRepositoryPostgres.getLikeCountsByCommentIds([]);

      // Assert
      expect(likeCounts).toEqual([]);
    });

    it('should return correct like counts grouped by comment_id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user1' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123', owner: 'user-123' });

      await LikesTableTestHelper.likeComment({ id: 'like-1', userId: 'user-123', commentId: 'comment-1' });
      await LikesTableTestHelper.likeComment({ id: 'like-2', userId: 'user-456', commentId: 'comment-1' });
      await LikesTableTestHelper.likeComment({ id: 'like-3', userId: 'user-123', commentId: 'comment-2' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await likeRepositoryPostgres.getLikeCountsByCommentIds(['comment-1', 'comment-2', 'comment-3']);

      // Assert
      expect(likeCounts).toHaveLength(2);
      const comment1Count = likeCounts.find((item) => item.comment_id === 'comment-1');
      const comment2Count = likeCounts.find((item) => item.comment_id === 'comment-2');
      expect(comment1Count.like_count).toBe(2);
      expect(comment2Count.like_count).toBe(1);
    });
  });
});
