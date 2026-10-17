class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyAvailableReply(replyId);
    await this._commentRepository.verifyReplyOwner(replyId, owner);
    await this._commentRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
