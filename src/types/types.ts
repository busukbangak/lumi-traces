export interface MarkerData {
    id: number
    status: TraceStatus
    position: [number, number]
    title: string
    description: string
    image: string
}

export enum TraceStatus {
    ACTIVE,
    MISSING,
    PENDING,
    REMOVED,
    INVALID
}