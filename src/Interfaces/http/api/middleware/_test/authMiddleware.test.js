import { describe, expect, it, vi } from 'vitest';
import authMiddleware from '../authMiddleware.js';
import AuthenticationError from '../../../../../Commons/exceptions/AuthenticationError.js';
import AuthenticationTokenManager from '../../../../../Applications/security/AuthenticationTokenManager.js';

describe('authMiddleware', () => {
  it('should call next with AuthenticationError when authorization header missing', async () => {
    // Arrange
    const req = { headers: {} };
    const res = {};
    const next = vi.fn();
    const middleware = authMiddleware({});

    // Action
    await middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next.mock.calls[0][0].message).toEqual('Missing authentication');
  });

  it('should call next with AuthenticationError when authorization scheme is not Bearer', async () => {
    // Arrange
    const req = { headers: { authorization: 'Basic xyz' } };
    const res = {};
    const next = vi.fn();
    const middleware = authMiddleware({});

    // Action
    await middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next.mock.calls[0][0].message).toEqual('Missing authentication');
  });

  it('should call next with AuthenticationError when token verification fails', async () => {
    // Arrange
    const req = { headers: { authorization: 'Bearer invalid_token' } };
    const res = {};
    const next = vi.fn();

    const mockTokenManager = {
      verifyAccessToken: vi.fn().mockRejectedValue(new AuthenticationError('invalid token')),
    };
    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockTokenManager),
    };

    const middleware = authMiddleware(mockContainer);

    // Action
    await middleware(req, res, next);

    // Assert
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('invalid_token');
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
  });

  it('should attach user payload to req.auth and call next without error when token is valid', async () => {
    // Arrange
    const req = { headers: { authorization: 'Bearer valid_token' } };
    const res = {};
    const next = vi.fn();

    const mockTokenManager = {
      verifyAccessToken: vi.fn().mockResolvedValue(),
      decodePayload: vi.fn().mockResolvedValue({ id: 'user-123', username: 'dicoding' }),
    };
    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockTokenManager),
    };

    const middleware = authMiddleware(mockContainer);

    // Action
    await middleware(req, res, next);

    // Assert
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('valid_token');
    expect(mockTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');
    expect(req.auth).toEqual({ id: 'user-123', username: 'dicoding' });
    expect(next).toHaveBeenCalledWith();
  });
});
