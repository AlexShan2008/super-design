import React, {
    PropsWithChildren,
    CSSProperties,
    ReactNode,
    useMemo,
    useRef,
    useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import Button from '../button'
import { Icon } from '../icon'
import { ModalWrapper, ModalViewPort, ModalMask, CloseBtn, ConfirmWrapper, ChildrenWrapper, TitleWrapper } from './component'
// import { useStateAnimation } from './hooks'
// import { useStateAnimation, useStopScroll } from './hooks'

export type ModalProps = {
    /** 父组件用来控制的状态 */
    visible: boolean;
    /** 容器位置 */
    container?: Element;
    /** 父组件setstate */
    parentSetState: (v: boolean) => void;
    /** 弹出框标题 */
    title?: ReactNode;
    /** 是否有确认按钮 */
    confirm?: boolean;
    /** 改变确认按钮文本*/
    okText?: string;
    /** 改变取消按钮文本*/
    cancelText?: string;
    /** 点了确认的回调，如果传了，需要自行处理关闭 */
    onOk?: (set: (v: boolean) => void) => void;
    /** 点了取消的回调，如果传了，需要自行处理关闭*/
    onCancel?: (set: (v: boolean) => void) => void;
    /** 点确认或者取消都会走的回调 */
    callback?: (v: boolean) => void;
    /** 点击mask是否关闭模态框 */
    maskClose?: boolean;
    /** 是否有mask */
    mask?: boolean;
    /** 自定义模态框位置 */
    style?: CSSProperties;
    /** 是否有右上角关闭按钮 */
    closeButton?: boolean;
    /** 动画时间 */
    delay?: number;
    /** 是否停止滚动*/
    stopScroll?: boolean;
    /** portralstyle*/
    portralStyle?: CSSProperties;
    /** portral的回调 */
    refCallback?: (ref: HTMLDivElement) => void;
    /** 没点确认于取消，直接关闭的回调 */
    closeCallback?: () => void;
};

export function Modal(props: PropsWithChildren<ModalProps>) {
    const {
        visible,
        maskClose,
        closeButton,
        delay,
        mask,
        container,
        confirm,
        okText,
        style,
        cancelText,
        onOk,
        onCancel,
        callback,
        title,
        // parentSetState,
        // stopScroll,
        portralStyle,
        refCallback,
        closeCallback,
    } = props;
    const ref = useRef<HTMLDivElement>(null);

    // const [state, setState, unmount] = useStateAnimation(parentSetState, delay);
    const [state, setState, unmount] = [true, (v: boolean) => v, () => { }];

    const render = useMemo(() => {
        if (!visible) {
            unmount();
            return null;
        } else {
            return createPortal(
                <ModalWrapper ref={ref} style={portralStyle}>
                    <ModalViewPort style={style} visible={state} delay={delay!}>
                        <div>
                            {state}state
                            {title && <TitleWrapper>{title}</TitleWrapper>}
                            {closeButton && (
                                <CloseBtn>
                                    <Button
                                        style={{
                                            background: "white",
                                            borderRadius: "5px",
                                            padding: "5px",
                                        }}
                                        onClick={() => {
                                            setState(false);
                                            if (closeCallback) closeCallback();
                                        }}
                                    >
                                        <Icon icon="closeAlt"></Icon>
                                    </Button>
                                </CloseBtn>
                            )}
                        </div>
                        {<ChildrenWrapper>{props.children}</ChildrenWrapper>}
                        {confirm && (
                            <ConfirmWrapper>
                                <Button
                                    appearance="secondary"
                                    onClick={() => {
                                        onOk ? onOk(setState) : setState(false);
                                        if (callback) callback(true);
                                    }}
                                >
                                    {okText ? okText : "确认"}
                                </Button>
                                <Button
                                    appearance="secondary"
                                    onClick={() => {
                                        onCancel ? onCancel(setState) : setState(false);
                                        if (callback) callback(false);
                                    }}
                                    style={{ marginLeft: "10px" }}
                                >
                                    {cancelText ? cancelText : "取消"}
                                </Button>
                            </ConfirmWrapper>
                        )}
                    </ModalViewPort>
                    {mask && (
                        <ModalMask
                            onClick={() => {
                                if (maskClose) {
                                    setState(false);
                                    if (closeCallback) {
                                        closeCallback();
                                    }
                                }
                            }}
                        ></ModalMask>
                    )}
                </ModalWrapper>,
                container!
            );
        }
    }, [
        callback,
        cancelText,
        closeButton,
        closeCallback,
        confirm,
        container,
        mask,
        maskClose,
        okText,
        onCancel,
        onOk,
        portralStyle,
        props.children,
        setState,
        style,
        title,
        state,
        visible,
        delay,
        unmount,
    ]);
    // useStopScroll(visible!, 300, stopScroll!);

    useEffect(() => {
        if (refCallback && ref.current) {
            refCallback(ref.current);
        }
    }, [refCallback]);

    return <>{render}</>;
};

Modal.defaultProps = {
    visible: false,
    container: window.document.body,
    confirm: true,
    title: '标题',
    maskClose: true,
    mask: true,
    closeButton: true,
    delay: 200,
    stopScroll: true,
    btnSize: 'default',
};

export default Modal;