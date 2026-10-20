import RepliesHandler from './handler.js';
import routes from './routes.js';

const replies = (container) => {
  const repliesHandler = new RepliesHandler(container);
  return routes(repliesHandler, container);
};

export default replies;
