import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (handler, container) => {
  const router = express.Router();

  router.post('/', authMiddleware(container), handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);

  return router;
};

export default routes;
