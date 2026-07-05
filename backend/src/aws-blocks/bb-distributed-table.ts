/**
 * Mock implementation of AWS Blocks DistributedTable
 * In production, this would use DynamoDB
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
  private data: Map<string, any> = new Map();

  constructor(config: TableConfig) {
    this.name = config.name;
    this.partitionKey = config.partitionKey;
    this.sortKey = config.sortKey;
  }

  async put(item: any): Promise<void> {
    const key = this.getKey(item);
    this.data.set(key, item);
  }

  async get(partitionKeyValue: string, sortKeyValue?: any): Promise<any> {
    const key = sortKeyValue ? `${partitionKeyValue}#${sortKeyValue}` : partitionKeyValue;
    return this.data.get(key);
  }

  async query(partitionKeyValue: string): Promise<any[]> {
    const prefix = partitionKeyValue + '#';
    return Array.from(this.data.values()).filter(item => {
      const key = this.getKey(item);
      return key.startsWith(prefix) || key === partitionKeyValue;
    });
  }

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
