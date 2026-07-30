import {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop
} from 'react-image-crop';

export const LOGO_CROP_ASPECT = 1;

export const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
                return;
            }

            reject(new Error('Nao foi possivel ler a imagem selecionada.'));
        };

        reader.onerror = () => {
            reject(new Error('Erro ao processar a imagem selecionada.'));
        };

        reader.readAsDataURL(file);
    });

export const createCenteredLogoCrop = (width: number, height: number): Crop => centerCrop(
    makeAspectCrop(
        {
            unit: '%',
            width: 80
        },
        LOGO_CROP_ASPECT,
        width,
        height
    ),
    width,
    height
);

export const getCroppedImageDataUrl = (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileType = 'image/png'
) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(crop.width * scaleX));
    const height = Math.max(1, Math.floor(crop.height * scaleY));

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Nao foi possivel preparar a edicao da logo.');
    }

    context.scale(pixelRatio, pixelRatio);
    context.imageSmoothingQuality = 'high';

    context.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        width,
        height,
        0,
        0,
        width,
        height
    );

    return canvas.toDataURL(fileType);
};
