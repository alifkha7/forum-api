import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const newReply = new NewComment({ ...useCasePayload, threadId, owner });
    return this._commentRepository.addReply(newReply, commentId);
  }
}

export default AddReplyUseCase;
