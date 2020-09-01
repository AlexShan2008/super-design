import {
    CSSProperties
} from "react";

export interface itemProps {
    value: string;
    level?: number;
    expand?: boolean;
    visible?: boolean;
    parent?: itemProps;
    children?: Array<itemProps>;
    key?: string;
}

export interface itemPropsRequired
    extends Omit<Required<itemProps>, "children" | "parent"> {
    children?: itemPropsRequired[];
    parent: itemPropsRequired;
}

export type TreeProps = {
    /** 数据源*/
    source: itemProps[];
    /** 是否可以拖拽 */
    drag?: boolean;
    /** 高亮边框颜色 */
    borderColor?: string;
    /** 拖拽提示色 */
    backColor?: string;
    /**外层样式*/
    style?: CSSProperties;
    /**外层类名*/
    classname?: string;
};

export const source = [
    {
        value: "北京分行",
        children: [
            {
                value: "朝阳支行办事处",
                children: [
                    { value: "朝阳支行办事处-1" },
                    { value: "朝阳支行办事处-2" },
                ],
            },
            { value: "海淀支行办事处" },
            { value: "石景山支行办事处" },
        ],
    },
    {
        value: "天津分行",
        children: [
            { value: "和平支行办事处" },
            { value: "河东支行办事处" },
            { value: "南开支行办事处" },
        ],
    },
];

export const flatten = function (
    list: Array<itemProps>,
    level = 1,
    parent: itemProps,
    defaultExpand = true
): itemPropsRequired[] {
    let arr: itemPropsRequired[] = []; //收集所有子项
    list.forEach((item) => {
        item.level = level;
        if (item.expand === undefined) {
            item.expand = defaultExpand;
        }
        if (item.visible === undefined) {
            item.visible = true;
        }
        if (!parent.visible || !parent.expand) {
            item.visible = false;
        }
        if (item.key === undefined) {
            item.key = item.value + Math.random();
        }

        item.parent = parent;
        arr.push(item as itemPropsRequired);
        if (item["children"]) {
            arr.push(
                ...flatten(item["children"], level + 1, item, defaultExpand)
            );
        }
    });
    return arr;
};

export const root = {
    level: 0,
    visible: true,
    expand: true,
    children: source,
    value: "root",
};

export const changeVisible = (item: itemPropsRequired, callback: Function) => {
    //给点击的children设置visible
    if (item.children) {
        //避免children有显示不一行为
        let visible: boolean;
        const depth = (item: itemPropsRequired[]) => {
            item.forEach((v) => {
                if (visible === undefined) {
                    visible = !v.visible;
                }
                v.visible = visible;
                if (v.children) {
                    //把孩子全部改掉
                    depth(v.children);
                }
            });
        };
        depth(item.children);
        callback(); //改完后更新页面
    }
};

export const checkParent = function (g: itemPropsRequired) {
    return g.level === 1;
};

export const levelSpace = 20; //同级生效间距

///1插上级 2插同级 3插下级 0不插
export const switchInsert = function (diff: number, g: itemPropsRequired) {
    if (!isNaN(diff)) {
        const origin = g.level * 10; //目标原本padding
        if (diff < origin) {
            //移动到padding前全部算上级
            if (checkParent(g)) {
                //排除最顶级
                return 2;
            } else {
                return 1;
            }
        } else if (diff < origin + levelSpace) {
            return 2;
        } else {
            return 3;
        }
    } else {
        return 0;
    }
};

export const findOrigin = function (key: string, data: itemPropsRequired[]) {
    const res = data.filter((v) => v.key === key);
    if (res.length > 0) {
        return res[0];
    } else {
        return null;
    }
};

export const getParent = function (g: itemPropsRequired) {
    if (g.parent && g.parent.parent) {
        return g.parent.parent;
    } else {
        return g.parent;
    }
};

export const judgeChildren = function (
    origin: itemPropsRequired,
    target: itemPropsRequired
) {
    let sign = true; //如果有孩子就是false
    const fn = (child: itemPropsRequired) => {
        if (child.children) {
            child.children.forEach((v) => {
                if (v === target) {
                    sign = false;
                    return;
                }
                fn(v);
            });
        }
    };
    fn(origin);
    return sign;
};
export const changeOriginParent = function (origin: itemPropsRequired) {
    const parent = origin.parent;
    if (parent.children) {
        const index = parent.children.indexOf(origin);
        if (index > -1) {
            parent.children.splice(index, 1);
        }
        //下面这个方法会产生bug
        //parent.children = parent.children.filter((v) => v !== origin);
    }
};

export const changeTargetParent = function (
    parent: itemPropsRequired,
    origin: itemPropsRequired,
    g: itemPropsRequired
) {
    origin.parent = parent;
    if (parent.children) {
        //判断应该插入父级节点哪里
        if (g.parent.children) {
            const index = g.parent.children.indexOf(g);
            if (index > -1) {
                parent.children.splice(index + 1, 0, origin);
            } else {
                //parent传递g会进来
                parent.children.push(origin);
            }
        } else {
            parent.children.push(origin);
        }
    } else {
        parent.children = [origin];
    }
};


export const checkTargetOrigin = function (
    g: itemPropsRequired,
    origin: itemPropsRequired
) {
    return g !== origin;
};

export const insertTop = function (
    key: string,
    g: itemPropsRequired,
    data: itemPropsRequired[],
    callback: Function
) {
    const origin = findOrigin(key, data);
    //origin插入target上级
    const parent = getParent(g);
    if (
        g.level !== 1 &&
        origin &&
        checkTargetOrigin(g, origin) &&
        judgeChildren(origin, g)
    ) {
        //修改以前父节点
        changeOriginParent(origin);
        //修改目标父节点的父节点（与父节点同级）
        changeTargetParent(parent, origin, g);
        callback();
    }
};

export const insertMiddle = function (
    key: string,
    g: itemPropsRequired,
    data: itemPropsRequired[],
    callback: Function
) {
    const origin = findOrigin(key, data);
    //origin插入target同级
    const parent = g.parent;
    if (
        g.level !== 0 &&
        origin &&
        checkTargetOrigin(g, origin) &&
        judgeChildren(origin, g)
    ) {
        changeOriginParent(origin);
        changeTargetParent(parent, origin, g);
        callback();
    }
};

export const insertLower = function (
    key: string,
    g: itemPropsRequired,
    data: itemPropsRequired[],
    callback: Function
) {
    const origin = findOrigin(key, data);
    const parent = g;
    if (origin && checkTargetOrigin(g, origin) && judgeChildren(origin, g)) {
        changeOriginParent(origin);
        changeTargetParent(parent, origin, g);
        callback();
    }
};

export const originPadding = 24; //原始间距

export function throttle(fn: Function, delay: number = 300) {
    let flag = true;
    return function (...args: any) {
        if (flag) {
            flag = false;
            fn(...args);
            setTimeout(() => {
                flag = true;
            }, delay);
        }
    };
}