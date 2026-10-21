import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
      const { id: userId } = req.auth;
      const { threadId, commentId } = req.params;

      await toggleLikeCommentUseCase.execute({ threadId, commentId, userId });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default LikesHandler;
