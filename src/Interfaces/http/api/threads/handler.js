import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
      const { id: owner } = req.auth;
      const addedThread = await addThreadUseCase.execute(req.body, owner);

      return res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { id: owner } = req.auth;
      const { threadId } = req.params;
      const addedComment = await addCommentUseCase.execute(req.body, threadId, owner);

      return res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { id: owner } = req.auth;
      const { threadId, commentId } = req.params;
      await deleteCommentUseCase.execute(threadId, commentId, owner);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ThreadsHandler;
