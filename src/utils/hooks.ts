import { DependencyList, useEffect, useState } from 'react';

export function useAsyncMemo<T>(factory: () => Promise<T>, deps: DependencyList, initialValue: T): T {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        factory().then((val) => setValue(val));
    }, deps);

    return value;
}
