export interface Office {
  _id: string;
  name: string;
  address?: string;
  createdAt?: Date | null;
  updatedAt?: Date;
  deletedAt?: Date;
}
