import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const newComment = new NewComment({ ...useCasePayload, threadId, owner });
    return this._commentRepository.addComment(newComment);
  }
}

export default AddCommentUseCase;
