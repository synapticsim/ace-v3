import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function timeFromTimestamp(timestamp: string): string {
    return dayjs(timestamp).fromNow();
}
