import React, { FunctionComponent, useEffect, useState } from 'react';
import styled, { css } from "styled-components";

declare type Position = 'top' | 'bottom' | 'left' | 'right';

const ProcessBarWrapper = styled.div<ProcessBarProps>`
  z-index: 1000;
  position: fixed;
  width: 100%;
  height: 10px;

  ${props => props.position === 'top' && css`top: 0;`}

  ${props => props.position === 'bottom' && css`bottom: 0;`}

  ${props => props.position === 'left' && css`left: 0;`}

  ${props => props.position === 'right' && css`right: 0;`}

  > div {
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    height: 10px;
    background-color: var(--process-bar-primary-color, #03256c);
  }
`

export interface ProcessBarProps {
  // 根元素 ID
  rootId?: string;
  // 跟元素
  rootEle?: HTMLElement;
  // 进度条颜色
  barColor?: string;
  // 进度条背景颜色
  bgColor?: string;
  // 进度条开始展示或者隐藏的滚动偏移量
  offset?: number;
  // 进度条展示的位置
  position?: Position;
}

export const ProcessBar: FunctionComponent<ProcessBarProps> = ({ rootEle, bgColor, barColor, rootId='root', offset=0 }: ProcessBarProps) => {
  const [barWidth, setBarWidth] = useState(10);

  useEffect(() => {
    let rootEleDOM = rootEle || document.body;
    const { offsetHeight } = rootEleDOM;

    if (document.body.offsetHeight <= window.innerHeight) {
      rootEleDOM = document.getElementById(rootId) || rootEleDOM;
    } else if (rootEleDOM.offsetHeight <= window.innerHeight) {
      const child = rootEleDOM.firstChild;
      if (child) {
        // offsetHeight = child.offsetHeight;
      }
    }

    const updateBarWidth = () => {
      const { body } = document;
      const html = document.documentElement;
      const htmlHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
        offsetHeight,
      );
      const scrollTop = rootEleDOM?.scrollTop || 0;
      const width = scrollTop <= offset ? 0 : scrollTop / htmlHeight;

      setBarWidth(Math.floor(width * 100 * 100) / 100);
    };

    rootEleDOM.addEventListener('scroll', updateBarWidth);
    return () => rootEleDOM?.removeEventListener('scroll', updateBarWidth);
  });
  return (
    <ProcessBarWrapper style={{ backgroundColor: bgColor }}>
      <div style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
    </ProcessBarWrapper>
  );
};

export default ProcessBar;
