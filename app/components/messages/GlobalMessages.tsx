'use client';

import { createPortal } from 'react-dom';
import { forwardRef, useEffect, useState } from 'react';
import {
    Messages as PrimeMessages
} from 'primereact/messages';

export type Messages = PrimeMessages;

type GlobalMessagesProps = React.ComponentProps<typeof PrimeMessages>;

export const Messages = forwardRef<PrimeMessages, GlobalMessagesProps>((props, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return createPortal(
        <PrimeMessages ref={ref} {...props} />,
        document.body
    );
});

Messages.displayName = 'GlobalMessages';
