import React, {
    useRef,
    useState,
    useMemo,
    useCallback,
    ReactNode
} from "react";

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import Button from '../button'
import Icon from '../icon'
import Progress from '../progress'
import Modal from '../modal'
import { message } from '../message'
import styled from "styled-components";
import { color } from '../shared/styles'
import { IconSpin } from '../shared/animation'
import { canvasDraw, getBase64, showModalToSlice, ModalContentType } from './helper'
import { ImgWrapper, ImgCloseBtn, ProgressListItem, ProgressLi, ImgUpload, btnStyle, rotateBtnStyle } from './style'


interface ProgressBar {
    filename: string;
    percent: number;
    status: "ready" | "success" | "failed" | "upload";
    uid: string;
    size: number;
    raw: File | null;
    cancel?: CancelTokenSource;
    img?: string | ArrayBuffer | null;
}

interface UploadListProps {
    flist: ProgressBar[];
    onRemove: (item: ProgressBar) => void;
}

interface imageListProps extends UploadListProps {
    setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>;
}

type onProgressType = ((p: number, f: File, i: number) => void) | undefined;

export const updateFilist = (
    setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>,
    _file: ProgressBar,
    uploadPartial: Partial<ProgressBar>
) => {
    setFlist((prevList) => {
        if (prevList) {
            return prevList.map((v) => {
                if (v.uid === _file.uid) {
                    return { ...v, ...uploadPartial };
                } else {
                    return v;
                }
            });
        } else {
            return prevList;
        }
    });
};

const postData = function (
    file: File,
    filename: string,
    config: Partial<AxiosRequestConfig>,
    i: number, //多重上传时i用来标识第几个
    onProgress: onProgressType,
    setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>,
    successCallback: ((res: any, i: number) => void) | undefined,
    failCallback: ((res: any, i: number) => void) | undefined
) {
    const formData = new FormData();
    formData.append(filename, file);
    const source = axios.CancelToken.source();
    const _file: ProgressBar = {
        filename: file.name,
        percent: 0,
        status: "ready",
        uid: Date.now() + "upload",
        size: file.size,
        raw: file,
        cancel: source,
    };
    setFlist((prev) => {
        //添加进队列
        return [_file, ...prev];
    });

    const defaultAxiosConfig: Partial<AxiosRequestConfig> = {
        method: "post",
        url: "http://localhost:51111/user/uploadAvatar/",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        cancelToken: source.token,
        onUploadProgress: (e) => {
            let percentage = Math.round((e.loaded * 100) / e.total) || 0;
            console.log(percentage, 'percentage//////');

            updateFilist(setFlist, _file, {
                status: "upload",
                percent: percentage,
            }); //更新上传队列
            if (onProgress) {
                onProgress(percentage, file, i);
            }
        },
    };
    const mergeConfig = { ...defaultAxiosConfig, ...config };

    return axios(mergeConfig)
        .then((res) => {
            updateFilist(setFlist, _file, { status: "success", percent: 100 });
            if (successCallback) {
                successCallback(res, i);
            }
        })
        .catch((r) => {
            updateFilist(setFlist, _file, { status: "failed", percent: 0 });
            if (failCallback) {
                failCallback(r, i);
            }
        });
};

const resolveFilename = function (
    uploadFilename: string[] | string,
    index: number
) {
    if (Array.isArray(uploadFilename)) {
        return uploadFilename[index];
    } else {
        return uploadFilename;
    }
};

type UploadMode = 'default' | 'img'

type UploadProps = {
    /** 上传字段名*/
    uploadFilename: string[] | string;
    /** 发送设置，参考axios */
    axiosConfig?: Partial<AxiosRequestConfig>;
    /** 获取进度 */
    onProgress?: onProgressType;
    /** 成功回调 */
    successCallback?: ((res: any, i: number) => void) | undefined;
    /** 失败回调 */
    failCallback?: ((res: any, i: number) => void) | undefined;
    /** 上传列表初始值 */
    defaultProgressBar?: ProgressBar[];
    /** 如果返回promise，需要提供file，否则同步需要返回boolean，如果为false，则不发送*/
    beforeUpload?: (f: File, i: number) => boolean | Promise<File>;
    /** 上传模式 2种 */
    uploadMode?: UploadMode
    /** 是否开启进度列表 */
    progress?: boolean
    onRemoveCallback?: (f: ProgressBar) => void;
    /** 自定义删除行为，只有img与progress为true有效*/
    customRemove?: (
        file: ProgressBar,
        setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>
    ) => void;
    /** 允许上传最大容量*/
    max?: number;
    /** input的accept属性 */
    accept?: string;
    /** input的multiple属性   multiple为true和max冲突*/
    multiple?: boolean;
    /** 用户自定义按钮 */
    customBtn?: ReactNode;
    /** 是否裁剪 */
    slice?: boolean;
};

type ProgressBarStatus = "ready" | "success" | "failed" | "upload";

function chooseProgressListColor(status: ProgressBarStatus) {
    switch (status) {
        case "failed":
            return color.negative;
        case "ready":
            return color.warning;
        case "success":
            return color.positive;
        case "upload":
            return color.secondary;
    }
}

const ProgressListItemName = styled.div<{ status: ProgressBarStatus }>`
color: ${(props) => chooseProgressListColor(props.status)};
`;

const resolveBtnLoading = function (flist: ProgressBar[]) {
    return flist.some((v) => v.status === "upload");
};

function UploadList(props: UploadListProps) {
    const { flist, onRemove } = props;
    return (
        <ul style={{ padding: "10px" }}>
            {flist.map((item) => {
                return (
                    <ProgressLi key={item.uid}>
                        <ProgressListItem>
                            <ProgressListItemName status={item.status}>
                                {item.filename}
                            </ProgressListItemName>
                            <div>
                                <Button
                                    style={{
                                        padding: "0",
                                        background: "transparent",
                                    }}
                                    onClick={() => onRemove(item)}
                                >
                                    <Icon
                                        icon="close"
                                        color={chooseProgressListColor(
                                            item.status
                                        )}
                                    ></Icon>
                                </Button>
                            </div>
                        </ProgressListItem>

                        {(item.status === "upload" ||
                            item.status === "ready") && (
                                <Progress count={item.percent}></Progress>
                            )}
                    </ProgressLi>
                );
            })}
        </ul>
    );
}

export function ImageList(props: imageListProps) {
    const { flist, onRemove, setFlist } = props;
    useMemo(() => {
        if (flist) {
            flist.forEach((item) => {
                if (item.raw && !item.img) {
                    //如果有文件并且没有img地址，生成blob地址
                    getBase64(item.raw, (e: string) => {
                        updateFilist(setFlist, item, {
                            img: e || "error",
                        });
                    });
                }
            });
        }
    }, [flist, setFlist]);
    return (
        <React.Fragment>
            {flist.map((item) => {
                return (
                    <span key={item.uid}>
                        <ImgWrapper>
                            {item.status === "success" && (
                                <img
                                    src={item.img as string}
                                    alt="upload img"
                                ></img>
                            )}
                            {(item.status === "ready" ||
                                item.status === "upload") && (
                                    <IconSpin>
                                        <Icon
                                            icon="sync"
                                            color={color.warning}
                                        ></Icon>
                                    </IconSpin>
                                )}
                            {item.status === "failed" && (
                                <Icon
                                    icon="photo"
                                    color={color.negative}
                                ></Icon>
                            )}
                            <ImgCloseBtn
                                className="closebtn"
                                onClick={() => onRemove(item)}
                            >
                                <Icon icon="trash" color={color.light}></Icon>
                            </ImgCloseBtn>
                        </ImgWrapper>
                    </span>
                );
            })}
        </React.Fragment>
    );
}

export function Upload(props: UploadProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [rescallback, setResCallback] = useState<{ restfn: Function }>({
        restfn: () => { },
    });

    const [modalContent, setModalContent] = useState<ModalContentType>({
        rotate: 0,
        times: 1,
        img: new Image(),
        left: 0,
        top: 0,
    });

    const {
        axiosConfig,
        customRemove,
        onProgress,
        defaultProgressBar,
        uploadFilename,
        successCallback,
        failCallback,
        beforeUpload,
        uploadMode,
        progress,
        onRemoveCallback,
        max,
        multiple,
        accept,
        customBtn
    } = props;

    const [flist, setFlist] = useState<ProgressBar[]>(defaultProgressBar || []);
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mouseActive, setMouseActive] = useState(false);
    const [startXY, setStartXY] = useState({ X: 0, Y: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (e.target.files && e.target.files.length <= 0) return;
        let filelist = Array.from(e.target.files);
        filelist.forEach((f, i) => {
            //裁剪会改变file
            const restfn = (f: File) => {
                if (beforeUpload) {
                    const p = beforeUpload(f, i);
                    if (p instanceof Promise) {
                        p.then((res: File) => {
                            postData(
                                res,
                                resolveFilename(uploadFilename, i),
                                axiosConfig!,
                                i,
                                onProgress,
                                setFlist,
                                successCallback,
                                failCallback
                            );
                        });
                    } else {
                        if (p) {
                            //false不执行
                            postData(
                                f,
                                resolveFilename(uploadFilename, i),
                                axiosConfig!,
                                i,
                                onProgress,
                                setFlist,
                                successCallback,
                                failCallback
                            );
                        }
                    }
                } else {
                    postData(
                        f,
                        resolveFilename(uploadFilename, i),
                        axiosConfig!,
                        i,
                        onProgress,
                        setFlist,
                        successCallback,
                        failCallback
                    );
                }
            };

            setResCallback({ restfn });
            if (showSlice) {
                setModalOpen(true);
                showModalToSlice(f, canvasRef, modalContent);
            } else {
                restfn(f);
            }
        });
    };
    const handleClick = () => {
        inputRef.current?.click();
    };

    const onRemove = useCallback(
        (file: ProgressBar) => {
            if (customRemove) {
                customRemove(file, setFlist);
            } else {
                setFlist((prev) => {
                    return prev.filter((item) => {
                        if (
                            item.uid === file.uid &&
                            item.status === "upload" &&
                            item.cancel
                        ) {
                            item.cancel.cancel();
                        }
                        return item.uid !== file.uid;
                    });
                });
            }

            if (onRemoveCallback) {
                onRemoveCallback(file);
            }
        },
        [customRemove, onRemoveCallback]
    );

    const shouldShow = useMemo(() => {
        if (max !== undefined) {
            return flist.length < max;
        } else {
            return true;
        }
    }, [max, flist]);

    const showSlice = useMemo(() => {
        if (!multiple && uploadMode === 'img') {
            return true
        } else {
            return false
        }
    }, [multiple, uploadMode])

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setMouseActive(true);
        setStartXY({
            X: e.clientX - modalContent.left,
            Y: e.clientY - modalContent.top,
        });
    };

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (mouseActive) {
            let diffX = e.clientX - startXY.X;
            let diffY = e.clientY - startXY.Y;
            let newContent = { ...modalContent, left: diffX, top: diffY };
            setModalContent(newContent);
            canvasDraw(newContent, canvasRef.current!);
        }
    };

    const handleMouseUp = () => {
        setMouseActive(false);
    };

    // const handleMouseLeave = () => {
    //     setMouseActive(false);
    // };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                onChange={handleChange}
                style={{ display: "none" }}
                value=""
                multiple={multiple}
                accept={accept}
            ></input>

            {
                shouldShow && uploadMode === "default" && (
                    <span onClick={handleClick}>
                        {customBtn ? (
                            customBtn
                        ) : (
                                <Button
                                    isLoading={resolveBtnLoading(flist)}
                                    loadingText="上传中..."
                                >
                                    upload
                                </Button>
                            )}
                    </span>
                )
            }
            {
                shouldShow && uploadMode === "img" && (
                    <ImgUpload onClick={handleClick}>
                        <Icon icon="plus"></Icon>
                    </ImgUpload>
                )
            }

            {
                uploadMode === "default" && progress && (
                    <UploadList flist={flist} onRemove={onRemove}></UploadList>
                )
            }
            {
                uploadMode === "img" && (
                    <ImageList
                        flist={flist}
                        setFlist={setFlist}
                        onRemove={onRemove}
                    ></ImageList>
                )
            }

            <Modal
                title="图片裁剪"
                callback={(v: boolean) => {
                    if (v) {
                        //如果取消，不执行后续上传
                        canvasRef.current!.toBlob(function (blob) {
                            if (rescallback.restfn) rescallback.restfn(blob);
                        });
                    }
                    //清除旋转和倍数
                    setModalContent({ ...modalContent, rotate: 0, times: 1 });
                }}
                maskClose={false}
                closeButton={false}
                visible={modalOpen}
                parentSetState={setModalOpen}
            >
                <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <canvas
                        width={300}
                        height={300}
                        style={{ width: "100%", height: "100%", border: "1px dashed #ff4785" }}
                        ref={canvasRef}
                    >
                        您的浏览器不支持Canvas
					</canvas>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <Button
                        appearance="primary"
                        style={btnStyle}
                        onClick={() => {
                            let newContent = {
                                ...modalContent,
                                ...{ times: modalContent.times + 0.1 },
                            };
                            setModalContent(newContent);
                            canvasDraw(newContent, canvasRef.current!);
                        }}
                    >
                        <Icon icon="zoom" color={color.light}></Icon>
                    </Button>
                    <Button
                        appearance="primary"
                        style={btnStyle}
                        onClick={() => {
                            let newContent = {
                                ...modalContent,
                                ...{ times: modalContent.times - 0.1 },
                            };
                            setModalContent(newContent);
                            canvasDraw(newContent, canvasRef.current!);
                        }}
                    >
                        <Icon icon="zoomout" color={color.light}></Icon>
                    </Button>
                    <Button
                        appearance="primary"
                        style={btnStyle}
                        onClick={() => {
                            let newContent = {
                                ...modalContent,
                                ...{ rotate: modalContent.rotate - 0.1 },
                            };
                            setModalContent(newContent);
                            canvasDraw(newContent, canvasRef.current!);
                        }}
                    >
                        <Icon icon="undo" color={color.light}></Icon>
                    </Button>
                    <Button
                        appearance="primary"
                        style={rotateBtnStyle}
                        onClick={() => {
                            let newContent = {
                                ...modalContent,
                                ...{ rotate: modalContent.rotate + 0.1 },
                            };
                            setModalContent(newContent);
                            canvasDraw(newContent, canvasRef.current!);
                        }}
                    >
                        <Icon icon="undo" color={color.light}></Icon>
                    </Button>
                    <Button
                        appearance="primary"
                        style={btnStyle}
                        onClick={() => {
                            let newContent = {
                                ...modalContent,
                                rotate: 0,
                                times: 1,
                                left: 0,
                                top: 0,
                            };
                            setModalContent(newContent);
                            canvasDraw(newContent, canvasRef.current!);
                        }}
                    >
                        <Icon icon="zoomreset" color={color.light}></Icon>
                    </Button>
                </div>
            </Modal>
        </div >
    );
};

Upload.defaultProps = {
    uploadMode: 'default',
    axiosConfig: {},
    uploadFilename: "avatar",
    successCallback: () => {
        console.log('successCallback');

        return message.success("上传成功")
    },
    failCallback: () => message.error("上传失败"),
};

export default Upload;