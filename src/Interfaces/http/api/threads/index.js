import ThreadsHandler from './handler.js';
import routes from './routes.js';

const threads = (container) => {
  const threadsHandler = new ThreadsHandler(container);
  return routes(threadsHandler, container);
};

export default threads;
