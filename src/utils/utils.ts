import { TraceStatus } from "../types/types"

export const statusText = (status: TraceStatus) => {
    switch (status) {
        case TraceStatus.ACTIVE:
            return 'Active'
        case TraceStatus.PENDING:
            return 'Pending'
        case TraceStatus.MISSING:
            return 'Missing'
        case TraceStatus.REMOVED:
            return 'Removed'
        case TraceStatus.INVALID:
            return 'Invalid'
        default:
            return 'Unknown'
    }
}
