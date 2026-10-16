import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';

const authMiddleware = (container) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('Missing authentication');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('Missing authentication');
    }

    const tokenManager = container.getInstance(AuthenticationTokenManager.name);
    await tokenManager.verifyAccessToken(token);
    const { id, username } = await tokenManager.decodePayload(token);

    req.auth = { id, username };
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
