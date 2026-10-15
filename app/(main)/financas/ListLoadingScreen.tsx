'use client';

import LoadingScreen, { type LoadingScreenProps } from '@/app/loading';

export default function ListLoadingScreen(props: LoadingScreenProps) {
    return <LoadingScreen {...props} fullScreen={false} />;
}
