export abstract class AggregateRoot {
  protected readonly _id!: string;

  get id(): string {
    return this._id;
  }
}
