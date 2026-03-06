import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';
import { JWTValidator } from '../services/jwt-validator.service';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let jwtValidator: JWTValidator;
  let reflector: Reflector;
  let context: Partial<ExecutionContext>;

  class MockJWTValidator {
    validate = jest.fn();
  }
  class MockReflector {
    getAllAndOverride = jest.fn();
  }

  beforeEach(() => {
    jwtValidator = new MockJWTValidator() as unknown as JWTValidator;
    reflector = new MockReflector() as unknown as Reflector;
    guard = new AuthenticationGuard(jwtValidator, reflector);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer validtoken' },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
  });

  it('should allow public route', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should allow with valid token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (jwtValidator.validate as jest.Mock).mockResolvedValue({});
    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException with invalid token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (jwtValidator.validate as jest.Mock).mockRejectedValue(
      new Error('invalid token'),
    );
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if no token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    context.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ headers: {} }),
    });
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });
});
