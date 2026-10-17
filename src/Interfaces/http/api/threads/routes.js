import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (handler, container) => {
  const router = express.Router();

  router.post('/', authMiddleware(container), handler.postThreadHandler);
  router.post('/:threadId/comments', authMiddleware(container), handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authMiddleware(container), handler.deleteCommentHandler);
  router.post('/:threadId/comments/:commentId/replies', authMiddleware(container), handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware(container), handler.deleteReplyHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);

  return router;
};

export default routes;
