/**
 * Mock implementation of AWS Blocks Storage
 * In production, this would use S3
 */

interface StorageConfig {
  name?: string;
  corsConfiguration?: any;
  [key: string]: any;
}

export class Storage {
  private name: string;
  private files: Map<string, Buffer> = new Map();
  private config: StorageConfig;

  constructor(config?: StorageConfig) {
    this.config = config || {};
    this.name = config?.name || 'default-storage';
  }

  async put(key: string, data: Buffer | string): Promise<void> {
    const buffer = typeof data === 'string' ? Buffer.from(data) : data;
    this.files.set(key, buffer);
  }

  async get(key: string): Promise<Buffer | null> {
    return this.files.get(key) || null;
  }

  async delete(key: string): Promise<void> {
    this.files.delete(key);
  }

  async list(): Promise<string[]> {
    return Array.from(this.files.keys());
  }
}
