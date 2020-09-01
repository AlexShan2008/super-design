import styled, { css } from 'styled-components'
import { modalOpenAnimate, modalCloseAnimate } from '../shared/animation'
import { typography } from '../shared/styles'

export const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  `

export const ModalViewPort = styled.div<{ visible: boolean; delay: number }>`
    background: #fff;
    border: none;
    border-radius: 5px;
    box-shadow: 2px 2px 4px #d9d9d9;
    text-shadow: 1px 1px 4px #d9d9d9, -1px -1px 4px #fff;
    margin: 0 auto;
    min-width: 320px;
    overflow: hidden;
    padding: 8px;
    position: relative;
    top: 100px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    width: 30%;
    z-index: 1001;
    ${(props) =>
        props.visible &&
        css`
        animation: ${modalOpenAnimate} ${props.delay / 1000}s ease-in;
      `}
    ${(props) =>
        !props.visible &&
        css`
        animation: ${modalCloseAnimate} ${props.delay / 1000}s ease-in;
      `}
  `

export const ModalMask = styled.div`
    background-color: rgba(0, 0, 0, 0.45);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  `

export const CloseBtn = styled.div`
    position: absolute;
    right: 5px;
    top: 5px;
  `

export const ConfirmWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-item: center;
    padding: 10px;
  `

export const ChildrenWrapper = styled.div`
    min-height: 100px;
    padding: 10px;
  `

export const TitleWrapper = styled.div`
    height: 30px;
    line-height: 30px;
    font-size: ${typography.size.m2}px;
    font-weight: ${typography.weight.bold};
    padding: 5px;
  `;