import joi from 'joi'

export type validation = (joi: joi.Root) => {
    [name: string]: () => {
        description?: string,
        params: joi.Schema,
        result: joi.Schema
    }
}