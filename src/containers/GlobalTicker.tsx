import { useEffect } from 'react';
import { globalTicker } from 'helper/ticker';

export const GlobalTicker = () => {
    useEffect(() => {
        globalTicker();
    }, []);
    return null;
};
