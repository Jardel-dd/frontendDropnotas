'use client';

export const USER_REFRESH_EVENT = 'auth:user-refresh-requested';

export const requestUserRefresh = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new Event(USER_REFRESH_EVENT));
};
