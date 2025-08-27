export interface IRepository<T> {
  save: (data: T) => void;
  findById: (id: number) => void;
  findAll: () => void;
  update: (data: T, id: number) => void;
  delete: (id: number) => void;
}
