import LikesHandler from './handler.js';
import routes from './routes.js';

const likes = (container) => {
  const likesHandler = new LikesHandler(container);
  return routes(likesHandler, container);
};

export default likes;
