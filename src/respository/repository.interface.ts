export interface IRepository<T> {
  save(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): void;
  findById(id: number): void;
  findAll(): void;
  update(
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
    id: number,
  ): void;
  delete(id: number): void;
}
