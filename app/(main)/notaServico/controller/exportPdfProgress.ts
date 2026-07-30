type ExportPdfProgressState = {
    loading: boolean;
    progressValue: number;
    indeterminate: boolean;
};

type ExportPdfProgressListener = (state: ExportPdfProgressState) => void;

const initialState: ExportPdfProgressState = {
    loading: false,
    progressValue: 0,
    indeterminate: false
};

let currentState: ExportPdfProgressState = initialState;
const listeners = new Set<ExportPdfProgressListener>();

const notifyListeners = () => {
    listeners.forEach((listener) => listener(currentState));
};

const setState = (partialState: Partial<ExportPdfProgressState>) => {
    currentState = {
        ...currentState,
        ...partialState
    };

    notifyListeners();
};

export const getExportPdfProgressState = (): ExportPdfProgressState => currentState;

export const subscribeToExportPdfProgress = (listener: ExportPdfProgressListener) => {
    listeners.add(listener);
    listener(currentState);

    return () => {
        listeners.delete(listener);
    };
};

export const startExportPdfProgress = () => {
    setState({
        loading: true,
        progressValue: 8,
        indeterminate: false
    });
};

export const updateExportPdfProgress = (progress: number | null) => {
    if (typeof progress !== 'number' || !Number.isFinite(progress)) {
        setState({
            loading: true,
            indeterminate: true
        });
        return;
    }

    setState({
        loading: true,
        indeterminate: false,
        progressValue: Math.max(currentState.progressValue, Math.min(100, Math.max(0, progress)))
    });
};

export const advanceExportPdfProgress = () => {
    if (!currentState.loading || currentState.indeterminate || currentState.progressValue >= 90) {
        return;
    }

    const nextStep =
        currentState.progressValue < 45 ? 9 : currentState.progressValue < 75 ? 5 : 2;

    setState({
        progressValue: Math.min(90, currentState.progressValue + nextStep)
    });
};

export const finishExportPdfProgress = () => {
    setState({
        loading: true,
        indeterminate: false,
        progressValue: 100
    });
};

export const resetExportPdfProgress = () => {
    currentState = initialState;
    notifyListeners();
};
