/**
 * Amazon S3 モック実装
 * 本番環境では Amazon S3 と統合される
 * 
 * 機能:
 * - put(): オブジェクトをストレージに保存
 * - get(): ストレージからオブジェクトを取得
 * - delete(): オブジェクトを削除
 * - list(): 保存されているキーの一覧を取得
 */

interface StorageConfig {
  name?: string;
  corsConfiguration?: any;
  [key: string]: any;
}

export class Storage {
  private name: string;
  // E2E環境: メモリ内にファイルを保存
  // 本番環境では S3 バケットに保存
  private files: Map<string, Buffer> = new Map();
  private config: StorageConfig;

  constructor(config?: StorageConfig) {
    this.config = config || {};
    this.name = config?.name || 'default-storage';
  }

  /**
   * ストレージにオブジェクトを保存する
   * @param key オブジェクトのキー（パス）
   * @param data 保存するデータ
   * 
   * 本番環境では S3 の PutObject API を呼び出す:
   * await s3Client.putObject({
   *   Bucket: this.bucketName,
   *   Key: key,
   *   Body: data
   * });
   */
  async put(key: string, data: Buffer | string): Promise<void> {
    const buffer = typeof data === 'string' ? Buffer.from(data) : data;
    this.files.set(key, buffer);
  }

  /**
   * ストレージからオブジェクトを取得する
   * @param key オブジェクトのキー（パス）
   * @returns オブジェクトのデータ、存在しない場合は null
   * 
   * 本番環境では S3 の GetObject API を呼び出す:
   * const response = await s3Client.getObject({
   *   Bucket: this.bucketName,
   *   Key: key
   * });
   */
  async get(key: string): Promise<Buffer | null> {
    return this.files.get(key) || null;
  }

  /**
   * ストレージからオブジェクトを削除する
   * @param key オブジェクトのキー（パス）
   * 
   * 本番環境では S3 の DeleteObject API を呼び出す:
   * await s3Client.deleteObject({
   *   Bucket: this.bucketName,
   *   Key: key
   * });
   */
  async delete(key: string): Promise<void> {
    this.files.delete(key);
  }

  /**
   * ストレージに保存されているキーの一覧を取得する
   * @returns キーの配列
   * 
   * 本番環境では S3 の ListObjects API を呼び出す:
   * const response = await s3Client.listObjects({
   *   Bucket: this.bucketName
   * });
   */
  async list(): Promise<string[]> {
    return Array.from(this.files.keys());
  }
}
