import React from 'react'
import Pagination from './index'
import { action } from "@storybook/addon-actions";
import { number } from "@storybook/addon-knobs";

import {
    withKnobs,
} from "@storybook/addon-knobs";

export default {
    title: "Pagination",
    component: Pagination,
    decorators: [withKnobs],
};

export const knobsPagination = () => (
    <Pagination
        defaultCurrent={number("defualtCurrent", 1)}
        total={number("total", 100)}
        barMaxSize={number("barMaxSize", 5)}
        pageSize={number("pageSize", 5)}
        callback={action("callback")}
    ></Pagination>
);