export abstract class BaseEntity {
    constructor(public id?: number) { }

    abstract toRecord(): Record<string, unknown>
}