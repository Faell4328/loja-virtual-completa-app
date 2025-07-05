/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const containerFormStyle = css`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 100%;
`;

const formStyle = css`
max-width: 400px;
border: 1px solid #aaa;
border-radius: 30px;
padding: 30px;

@media(max-width: 575px){
  max-width: 350px;
}
`

const imageStyle = css`
max-width: 300px;
max-height: 300px;
object-fit: cover;
margin: auto;
display: flex;
margin-bottom: 30px;

@media(max-width: 575px){
  max-width: 200px;
  max-height: 200px;
}
`;

const contentFormStyle = css`
width: 300px;
`

const containerButtonStyle = css`
display: flex;
justify-content: center;
width: 100%;
margin-bottom: 30px;
`

export { containerFormStyle, formStyle, imageStyle, contentFormStyle, containerButtonStyle };