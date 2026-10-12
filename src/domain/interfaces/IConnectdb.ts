export interface IConnectDB {
  connectMongo(): Promise<void>;
  disconnectMongo(): Promise<void>;
}
