export type ModalContentType = {
    rotate: number;
    times: number;
    img: HTMLImageElement;
    left: number;
    top: number;
};

export const getBase64 = (raw: File, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        callback(reader.result)
    });
    reader.readAsDataURL(raw);
}

export const canvasDraw = function (
    modalContent: ModalContentType,
    canvas: HTMLCanvasElement
) {
    const image = modalContent.img;
    const ctx = canvas.getContext("2d");
    // eslint-disable-next-line no-self-assign
    canvas.height = canvas.height; //清屏
    let imgWidth = image.width;
    let imgHeight = image.height;
    //canvas宽高300,判断图片长宽谁长，取长的
    const times = modalContent.times;
    if (imgWidth > imgHeight) {
        //如果宽比高度大
        let rate = canvas.width / imgWidth;
        imgWidth = canvas.width * times; //让宽度等于canvas宽度
        imgHeight = imgHeight * rate * times; //然后让高度等比缩放
    } else {
        let rate = canvas.height / imgHeight;
        imgHeight = canvas.height * times;
        imgWidth = imgWidth * rate * times;
    }
    //此时，长宽已等比例缩放，算起始点位偏移，起始高度就是canvas高-图片高再除2 宽度同理
    const startX = (canvas.width - imgWidth) / 2;
    const startY = (canvas.height - imgHeight) / 2;
    //旋转操作
    //旋转首先移动原点到图片中心，这里中心是canvas中心,然后再移动回来
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;
    ctx?.translate(midX, midY);

    ctx?.rotate(modalContent.rotate);
    ctx?.drawImage(
        image,
        startX - midX + modalContent.left,
        startY - midY + modalContent.top,
        imgWidth,
        imgHeight
    );
    ctx?.translate(0, 0);
};

export const showModalToSlice = function (
    f: File,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    modalContent: ModalContentType
) {
    getBase64(f, (s: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
            modalContent.img.src = s;
            modalContent.img.onload = () => {
                canvasDraw(modalContent, canvas);
            };
        }
    });
};