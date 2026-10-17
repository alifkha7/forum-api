import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
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

  async postReplyHandler(req, res, next) {
    try {
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const { id: owner } = req.auth;
      const { threadId, commentId } = req.params;
      const addedReply = await addReplyUseCase.execute(req.body, threadId, commentId, owner);

      return res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
      const { id: owner } = req.auth;
      const { threadId, commentId, replyId } = req.params;
      await deleteReplyUseCase.execute(threadId, commentId, replyId, owner);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return next(error);
    }
  }

  async getThreadDetailHandler(req, res, next) {
    try {
      const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
      const { threadId } = req.params;
      const thread = await getThreadDetailUseCase.execute(threadId);

      return res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ThreadsHandler;
