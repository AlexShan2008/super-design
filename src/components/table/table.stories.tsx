import React from 'react'
import Table from './index'
import { boolean, number } from "@storybook/addon-knobs";

import { columns, data } from './data'

import {
    withKnobs,
} from "@storybook/addon-knobs";

export default {
    title: "Table",
    component: Table,
    decorators: [withKnobs],
};

export const knobsTable = () => (
    <Table
        columns={columns}
        data={data}
        sorted={boolean("sorted", true)}
        pagination={boolean("pagination", false)}
        pageSize={number("pageSize", 2)}
    ></Table>
);

export const withPagination = () => (
    <Table columns={columns} data={data} pagination={true} pageSize={2}></Table>
);
