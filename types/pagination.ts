export interface Pagination<T> {
    status: boolean
    total: number
    page: number
    limit: number
    data: T[]
}
