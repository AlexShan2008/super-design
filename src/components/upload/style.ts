import styled from "styled-components";

export const ImgWrapper = styled.div`
display: inline-block;
position: relative;
width: 104px;
height: 104px;
margin-right: 8px;
margin-bottom: 8px;
text-align: center;
vertical-align: top;
background-color: #fafafa;
border: 1px dashed #d9d9d9;
border-radius: 2px;
cursor: pointer;
transition: border-color 0.3s ease;
> img {
    width: 100%;
    height: 100%;
}

&::before {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    content: " ";
}
&:hover::before {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    content: " ";
}
&:hover > .closebtn {
    display: block;
}
`;

export const ImgCloseBtn = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 2;
display: none;
`;

export const ProgressListItem = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`;

export const ProgressLi = styled.li`
list-style: none;
padding: 10px;
box-shadow: 2px 2px 4px #d9d9d9;
`;

export const ImgUpload = styled.div`
display: inline-block;
position: relative;
width: 104px;
height: 104px;
margin-right: 8px;
margin-bottom: 8px;
text-align: center;
vertical-align: top;
background-color: #fafafa;
border: 1px dashed #d9d9d9;
border-radius: 2px;
cursor: pointer;
transition: border-color 0.3s ease;
> svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
`;

export const btnStyle = {
    padding: "10px",
};

export const rotateBtnStyle = {
    padding: "10px",
    transform: "rotateY(180deg)",
};
