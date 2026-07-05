/**
 * Mock implementation of AWS Blocks Auth
 * In production, this would use Cognito
 */

interface AuthConfig {
  name?: string;
  userPoolId?: string;
  clientId?: string;
  passwordPolicy?: any;
  [key: string]: any;
}

export class Auth {
  private userPoolId: string;
  private clientId: string;
  private config: AuthConfig;

  constructor(config?: AuthConfig) {
    this.config = config || {};
    this.userPoolId = config?.userPoolId || 'mock-user-pool';
    this.clientId = config?.clientId || 'mock-client-id';
  }

  async signUp(email: string, password: string): Promise<{ userId: string }> {
    return { userId: `user-${Date.now()}` };
  }

  async signIn(email: string, password: string): Promise<{ token: string }> {
    return { token: `token-${Date.now()}` };
  }

  async signOut(token: string): Promise<void> {
    // Mock implementation
  }

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    // Mock implementation - accept any token format
    if (token && token.startsWith('token-')) {
      return { userId: 'mock-user' };
    }
    return null;
  }
}
