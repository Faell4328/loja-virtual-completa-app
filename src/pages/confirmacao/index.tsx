/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Flex } from "antd";

import { body, container } from "./confirmacao.style";

export default function Confirmacao(){
  return(
    <div css={body}>
      <div css={container}>
        <b>Caro usuário, foi enviado para seu email o link para ativação da conta</b>
      </div>
    </div>
  )
}