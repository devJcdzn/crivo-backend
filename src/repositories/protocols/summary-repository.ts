export interface ISummaryRepository {
  getSumary(userId: string, from?: string, to?: string): Promise<any>;
}
