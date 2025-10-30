import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AuthService).toBe('function');
  });
});
