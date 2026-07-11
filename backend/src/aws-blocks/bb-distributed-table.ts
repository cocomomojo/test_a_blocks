/**
 * Amazon DynamoDB モック実装
 * 本番環境では Amazon DynamoDB と統合される
 * 
 * 機能:
 * - put(): アイテムをテーブルに保存
 * - get(): パーティションキーとソートキーでアイテムを取得
 * - query(): パーティションキーでアイテム群を検索
 * - delete(): アイテムを削除
 */

interface TableConfig {
  name: string;
  partitionKey: {
    name: string;
    type: string;
  };
  sortKey?: {
    name: string;
    type: string;
  };
}

export class DistributedTable {
  private name: string;
  private partitionKey: { name: string; type: string };
  private sortKey?: { name: string; type: string };
  // E2E環境: メモリ内にデータを保存
  // 本番環境では DynamoDB テーブルに保存
  private data: Map<string, any> = new Map();

  constructor(config: TableConfig) {
    this.name = config.name;
    this.partitionKey = config.partitionKey;
    this.sortKey = config.sortKey;
  }

  /**
   * テーブルにアイテムを追加する
   * @param item 保存するアイテム
   * 
   * 本番環境では DynamoDB の PutItem API を呼び出す:
   * await dynamoDbClient.putItem({
   *   TableName: this.name,
   *   Item: marshal(item)
   * });
   */
  async put(item: any): Promise<void> {
    const key = this.getKey(item);
    this.data.set(key, item);
  }

  /**
   * パーティションキーとソートキーでアイテムを取得
   * @param partitionKeyValue パーティションキーの値
   * @param sortKeyValue ソートキーの値（オプション）
   * @returns マッチしたアイテム、存在しない場合は undefined
   * 
   * 本番環境では DynamoDB の GetItem API を呼び出す:
   * const result = await dynamoDbClient.getItem({
   *   TableName: this.name,
   *   Key: {
   *     [partitionKeyName]: { S: partitionKeyValue },
   *     [sortKeyName]: { N: sortKeyValue }
   *   }
   * });
   */
  async get(partitionKeyValue: string, sortKeyValue?: any): Promise<any> {
    const key = sortKeyValue ? `${partitionKeyValue}#${sortKeyValue}` : partitionKeyValue;
    return this.data.get(key);
  }

  /**
   * パーティションキーで条件に合うアイテム群を検索
   * @param partitionKeyValue パーティションキーの値
   * @returns マッチしたアイテムの配列
   * 
   * 本番環境では DynamoDB の Query API を呼び出す:
   * const result = await dynamoDbClient.query({
   *   TableName: this.name,
   *   KeyConditionExpression: 'pk = :pk',
   *   ExpressionAttributeValues: {
   *     ':pk': { S: partitionKeyValue }
   *   }
   * });
   */
  async query(partitionKeyValue: string): Promise<any[]> {
    const prefix = partitionKeyValue + '#';
    return Array.from(this.data.values()).filter(item => {
      const key = this.getKey(item);
      return key.startsWith(prefix) || key === partitionKeyValue;
    });
  }

  /**
   * テーブルからアイテムを削除
   * @param partitionKeyValue パーティションキーの値
   * @param sortKeyValue ソートキーの値（オプション）
   * 
   * 本番環境では DynamoDB の DeleteItem API を呼び出す:
   * await dynamoDbClient.deleteItem({
   *   TableName: this.name,
   *   Key: {
   *     [partitionKeyName]: { S: partitionKeyValue },
   *     [sortKeyName]: { N: sortKeyValue }
   *   }
   * });
   */
  async delete(partitionKeyValue: string, sortKeyValue?: any): Promise<void> {
    const key = sortKeyValue ? `${partitionKeyValue}#${sortKeyValue}` : partitionKeyValue;
    this.data.delete(key);
  }

  private getKey(item: any): string {
    const pkValue = item[this.partitionKey.name];
    if (this.sortKey) {
      const skValue = item[this.sortKey.name];
      return `${pkValue}#${skValue}`;
    }
    return pkValue;
  }
}
