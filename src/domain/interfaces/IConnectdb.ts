export interface IConnectDB {
  connectMongo(): Promise<void>;
}
