import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (handler, container) => {
  const router = express.Router();

  router.post('/:threadId/comments/:commentId/replies', authMiddleware(container), handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware(container), handler.deleteReplyHandler);

  return router;
};

export default routes;
