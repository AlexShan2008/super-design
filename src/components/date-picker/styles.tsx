import styled, { css } from 'styled-components'
import { rgba } from 'polished'
import { color } from '../shared/styles'
import { modalOpenAnimate, modalCloseAnimate } from '../shared/animation'

interface DateItem {
    day: number; //天
    isonMonth: boolean; //当月
    isonDay: boolean; //当日
    origin: Date;
}

export const CalendarWrapper = styled.div<{ visible: boolean; delay: number }>`
	position: absolute;
	border: 1px solid black;
	transition: all ${(props) => props.delay / 1000}s cubic-bezier(0.23, 1, 0.32, 1);
background: ${color.lightest};
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
`;

export const tableItemStyle = css`
display: inline-block;
min-width: 24px;
height: 24px;
line-height: 24px;
border-radius: 2px;
margin: 2px;
text-align: center;
`;

export const CalendarHeadItem = styled.td`
${tableItemStyle}
cursor:default;
`;

export const CalendarHeadWrapper = styled.div`
padding: 10px;
display: flex;
color: ${rgba(0, 0, 0, 0.85)};
border-bottom: 1px solid #f0f0f0;
justify-content: center;
`;

export const btnStyle = {
    padding: "0px",
    background: color.lightest,
};

export const IconWrapper = styled.span`
	display: inline-block;
	vertical-align: middle;
	> svg {
		height: 12px;
	}
`;

export const BtnDiv = styled.div`
	display: flex;
	jutify-content: center;
	align-items: center;
	height: 24px;
	line-height: 24px;
`;

export const CalendarDate = styled.td<Partial<DateItem>>`
display: inline-block;
min-width: 24px;
height: 24px;
line-height: 24px;
border-radius: 2px;
margin: 2px;
text-align: center;
cursor: pointer;
    ${(props) => {
        if (props.isonDay) {
            //当天的 
            return `color:${color.lightest};background:${color.primary};`;
        }
        return `&:hover {color: ${color.secondary};};`;
    }}
${(props) => {
        if (props.isonMonth === false) {
            //不是当月显示灰色
            return `color:${color.mediumdark};`;
        }
        return "";
    }}
`;

export const MonthWrapper = styled.div`
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	position: relative;
`;

export const Bwrapper = styled.b`
	cursor: pointer;
	&:hover {
		color: ${color.primary};
	}
`;

export const MonthItem = styled.div<{ toGrey?: boolean }>`
	width: 25%;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	${(props) => props.toGrey && `color:${color.mediumdark};`}
	&:hover {
		color: ${color.secondary};
	}
`;

export const CalendarIcon = styled.span`
	display: inline-block;
`;

export const DatePickerWrapper = styled.div`
	display: inline-block;
	border-color: #40a9ff;
	border-right-width: 1px !important;
	outline: 0;
	box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
`;

export const CalendarDateRow = styled.tr``;