import React from 'react'
import { ProcessBar } from './index'
import { withKnobs } from '@storybook/addon-knobs'

export default {
    title: '组件/ProgressBar',
    component: ProcessBar,
    decorators: [withKnobs],
}

export const knobsProcessBar = () => (
    <ProcessBar position='bottom' bgColor='gray' barColor='green' />
)