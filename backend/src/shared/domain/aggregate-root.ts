export abstract class AggregateRoot {
  protected readonly _id!: string;

  get id(): string {
    return this._id;
  }

  equals(other?: AggregateRoot | null): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.constructor === other.constructor && this._id === other._id;
  }
}
