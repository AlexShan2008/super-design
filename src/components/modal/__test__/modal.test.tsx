import React, { useState } from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Modal, ModalProps } from '../index'
import { color, typography } from '../../shared/styles'

const ModalTester = (props: ModalProps) => {
    const defaultVisible = props?.visible || false
    const [visible, setVisible] = useState(defaultVisible)
    return <Modal parentSetState={setVisible} {...props} visible={visible} />
}

describe('test Modal component', () => {
    it('render correctly', () => {
        const wrapper = render(<ModalTester visible />)
        expect(wrapper).toMatchSnapshot()
    })

    it('onCancel should be called', () => {
        const onCancel = jest.fn()
        const wrapper = render(
            <ModalTester visible onCancel={onCancel} cancelText="Cancel" />
        )
        const ele = wrapper.getByText('Cancel')

        fireEvent.click(ele)
        expect(onCancel).toHaveBeenCalled()
    })

    it('onOk should be called', () => {
        const onOk = jest.fn()
        const wrapper = render(<ModalTester visible onOk={onOk} okText="Cancel" />)
        const ele = wrapper.getByText('Cancel')

        fireEvent.click(ele)
        expect(onOk).toHaveBeenCalled()
    })
})
