import ToggleLikeComment from '../../Domains/likes/entities/ToggleLikeComment.js';

class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = new ToggleLikeComment(useCasePayload);

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    const isLiked = await this._likeRepository.isCommentLiked(userId, commentId);

    if (isLiked) {
      await this._likeRepository.unlikeComment(userId, commentId);
    } else {
      await this._likeRepository.likeComment(userId, commentId);
    }
  }
}

export default ToggleLikeCommentUseCase;
