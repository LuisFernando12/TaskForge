export interface IRepository<T> {
  save(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
  update(
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
    id: number,
  ): void;
  delete(id: number): void;
}
