import React, {
    useRef,
    useState,
    useMemo,
    useEffect,
} from "react";

import styled from "styled-components";
import Icon from '../icon'

import { itemPropsRequired, TreeProps, source, levelSpace, flatten, changeVisible, switchInsert, insertTop, insertMiddle, insertLower, originPadding, throttle } from './helper'

interface TreeItemType {
    level: number;
}

const TreeIcon = styled.span<{ g: itemPropsRequired }>`
	& > svg {
		transition: linear 0.2s;
		height: 10px;
		margin-bottom: 5px;
		${(props) => {
        if (props.g.children && props.g.children.length !== 0) {
            if (props.g.children[0] && props.g.children[0]["visible"]) {
                return "display:inline-block;transform: rotate(-90deg);";
            } else {
                return "display:inline-block;";
            }
        } else {
            return "opacity:0";
        }
    }};
	}
`;

interface DragControlData {
    drag: boolean;
    x: number;
    itemkey: string;
}
type TreeGragType = { gkey: string } & DragControlData;

const TreeGrag = styled.div<TreeGragType>`
	position: absolute;
	width: 100%;
	height: 90%;
	${(props) => {
        switch (props.x) {
            case 1:
                return `margin-left:${-levelSpace}px ;`;
            case 2:
                return "";
            case 3:
                return `margin-left:${levelSpace}px  ;`;
            default:
                return "";
        }
    }};
	${(props) => {
        if (props.itemkey === props.gkey) {
            return "background: #00000030;";
        }
    }}
`;

interface DragHighlight {
    drag: boolean;
    itemkey: string;
}

interface TreeItemType {
    level: number;
    itemkey: string;
    highlight: DragHighlight;
}

const TreeItem = styled.div<TreeItemType>`
	padding-left: ${(props) => originPadding * props.level}px;
	padding-top: 2px;
	padding-bottom: 2px;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	${(props) => {
        if (props.highlight.drag && props.highlight.itemkey === props.itemkey) {
            return "border: 1px dashed #53c94fa8;";
        } else {
            return "";
        }
    }}
`;

export function Tree(props: TreeProps) {
    const root = useMemo(() => {
        return {
            level: 0,
            visible: true,
            expand: true,
            children: source,
            value: "root",
        };
    }, []);

    const [dragUpdate, setDragUpdate] = useState(0);

    const data = useMemo(() => {
        return flatten(root.children, 1, root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, dragUpdate]);
    const [start, setStart] = useState(0);
    const forceUpdate = useState(0)[1];
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            setStart(ref.current.getBoundingClientRect().left); //为了找到起始
        }
    }, []);
    const callback = () => {
        forceUpdate((state) => state + 1);
    };
    const dragCallback = () => {
        setDragUpdate((state) => state + 1);
    };
    const img = new Image();
    img.src = "https://www.easyicon.net/api/resizeApi.php?id=1200841&size=32";

    const [dragOver, setDragOver] = useState<DragControlData>({
        drag: false,
        x: 0,
        itemkey: "",
    });

    const dragHandler = (
        clientX: number,
        itemkey: string,
        g: itemPropsRequired
    ) => {
        const diff = clientX - start;
        const x = switchInsert(diff, g);
        setDragOver({
            drag: true,
            x,
            itemkey,
        });
    };

    useEffect(() => {
        const handler = () => {
            setDragOver((prev) => ({ ...prev, drag: false }));
        };

        window.addEventListener("dragend", handler);
        return () => {
            window.removeEventListener("dragend", handler);
        };
    }, []);

    const [highlight, setHighlight] = useState({
        drag: true,
        itemkey: "",
    });

    useEffect(() => {
        const handler = () => {
            setDragOver((prev) => ({ ...prev, drag: false }));
            setHighlight({
                drag: false,
                itemkey: "",
            });
        };
        window.addEventListener("dragend", handler);
        return () => {
            window.removeEventListener("dragend", handler);
        };
    }, []);

    return (
        <div ref={ref}>
            {data
                .filter((v) => v.visible === true)
                .map((g) => {
                    return (
                        <TreeItem
                            itemkey={g.key}
                            level={g.level}
                            highlight={highlight}
                            draggable
                            onClick={() => changeVisible(g, callback)}
                            key={g.key}
                            onDragStart={(e) => {
                                e.dataTransfer.setData("atomkey", `${g.key}`);
                                e.dataTransfer.setDragImage(img, 29, 29);
                                setHighlight({
                                    drag: true,
                                    itemkey: g.key,
                                });
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                throttle(dragHandler)(e.clientX, g.key, g);
                            }}
                            onDrop={(e) => {
                                const key = e.dataTransfer.getData("atomkey");
                                const left = e.clientX;
                                const diff = left - start; //离顶部差值
                                const res = switchInsert(diff, g);
                                switch (res) {
                                    case 1:
                                        insertTop(key, g, data, dragCallback);
                                        break;
                                    case 2:
                                        insertMiddle(
                                            key,
                                            g,
                                            data,
                                            dragCallback
                                        );
                                        break;
                                    case 3:
                                        insertLower(key, g, data, dragCallback);
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        >
                            <TreeIcon g={g}>
                                <Icon icon="arrowdown"></Icon>
                            </TreeIcon>
                            <span>{g.value}</span>
                        </TreeItem>
                    );
                })}
            {dragOver.drag && (
                <TreeGrag
                    gkey={g.key}
                    drag={dragOver.drag}
                    x={dragOver.x}
                    itemkey={dragOver.itemkey}
                ></TreeGrag>
            )}
        </div>
    );
};

Tree.defaultProps = {
    source: [],
    drag: true,
    borderColor: "#53c94fa8",
    backColor: "#00000030",
};

export default Tree;
