export interface Trace {
    _id: string
    status: TraceStatus | string
    position: [number, number]
    title: string
    description: string
    imageID: string
    traceType: TraceType | string
}

export enum TraceStatus {
    ACTIVE = 'ACTIVE',
    MISSING = 'MISSING',
    PENDING = 'PENDING',
    REMOVED = 'REMOVED',
    INVALID = 'INVALID'
}

export enum TraceType {
    Adventure = 'ADVENTURE',
    Knowledge = 'KNOWLEDGE',
}