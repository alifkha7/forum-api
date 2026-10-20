import CommentsHandler from './handler.js';
import routes from './routes.js';

const comments = (container) => {
  const commentsHandler = new CommentsHandler(container);
  return routes(commentsHandler, container);
};

export default comments;
