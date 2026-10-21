import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (handler, container) => {
  const router = express.Router();

  router.put('/:threadId/comments/:commentId/likes', authMiddleware(container), handler.putLikeHandler);

  return router;
};

export default routes;
