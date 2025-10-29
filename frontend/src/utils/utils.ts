import { TraceStatus } from "../types/types"

const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Active',
    PENDING: 'Pending',
    MISSING: 'Missing',
    REMOVED: 'Removed',
    INVALID: 'Invalid',
}

export const getStatusText = (status: TraceStatus | string) => {
    const key = typeof status === 'string' ? status : String(status)
    return STATUS_LABELS[key] ?? 'Unknown'
}
