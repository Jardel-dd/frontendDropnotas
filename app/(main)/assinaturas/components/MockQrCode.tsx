import { useMemo } from 'react';

type Props = {
    value: string;
    size?: number;
};

const QR_GRID_SIZE = 21;

const isFinderCell = (row: number, column: number) => {
    const finderOrigins = [
        [0, 0],
        [0, QR_GRID_SIZE - 7],
        [QR_GRID_SIZE - 7, 0]
    ];

    return finderOrigins.some(([originRow, originColumn]) => {
        const insideFinder = row >= originRow && row < originRow + 7 && column >= originColumn && column < originColumn + 7;

        if (!insideFinder) {
            return false;
        }

        const innerRow = row - originRow;
        const innerColumn = column - originColumn;
        const isBorder = innerRow === 0 || innerRow === 6 || innerColumn === 0 || innerColumn === 6;
        const isCenter = innerRow >= 2 && innerRow <= 4 && innerColumn >= 2 && innerColumn <= 4;

        return isBorder || isCenter;
    });
};

export default function MockQrCode({ value, size = 240 }: Props) {
    const cells = useMemo(() => {
        const seed = Array.from(value).reduce((accumulator, character, index) => accumulator + character.charCodeAt(0) * (index + 1), 0);
        let current = seed || 1;

        return Array.from({ length: QR_GRID_SIZE * QR_GRID_SIZE }, (_, index) => {
            const row = Math.floor(index / QR_GRID_SIZE);
            const column = index % QR_GRID_SIZE;

            if (isFinderCell(row, column)) {
                return true;
            }

            current = (current * 1664525 + 1013904223) % 4294967296;

            return (current >> 3) % 2 === 0;
        });
    }, [value]);

    return (
        <div
            className="subscription-mock-qr"
            style={{
                width: size,
                height: size,
                gridTemplateColumns: `repeat(${QR_GRID_SIZE}, 1fr)`
            }}
            aria-label="QR Code simulado para pagamento Pix"
        >
            {cells.map((isFilled, index) => (
                <span key={`${value}-${index}`} className={isFilled ? 'is-filled' : ''} />
            ))}
        </div>
    );
}
