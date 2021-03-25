export default function getButton(cond: number, id: string) {
	if (cond === 0) {
		const emailHtml = `<table style="width: 100%; height: 100%; min-width: 348px; border: 0; background-color: #212121dc;">
            <tbody>
              <tr align="center">
                <td>
                  <table cellspacing="0" cellpadding="0" style="padding-bottom:20px;max-width:516px;min-width:220px; background-color: white; border-color: black;
                  border-style: solid;
                  border-width: medium;">
                    <tbody>
                      <tr>
                        <td width="8" style="width:8px"></td>
                        <td>
                          <div
                            style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                            align="center" class="m_4541679764111361952mdv2rw">
                            <div style="display: inline-flex;"> <img
                                src="https://cdn.discordapp.com/attachments/762786204071886848/824733778203115590/nintube_icon1.png" width="74"
                                height="74" aria-hidden="true" style="margin-bottom:16px" class="CToWUd">
                              <h1 style="margin-left: 5%;">NinTube</h1>
                            </div>
          
                            <div
                              style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                              <div style="font-size:24px">Obrigado por registra-se no NinTube. </div>
          
                            </div>
                            <div
                              style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:19px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center">
                              Por Favor verifique seu email clicando no botão abaixo.<div
                                style="padding-top:32px;text-align:center"><a
                                  href="http://localhost:3000/#/confirmation/${id}" style="
                                box-shadow: inset 0px -3px 0px 0px white;
                                background: linear-gradient(to bottom, #B3272C, #f03a41e1);
                                border-radius: 6px;
                                border: 1px solid black;
                                display: inline-flex;
                                cursor: pointer;
                                color: black;
                                font-family: Verdana;
                                font-size: 20px;
                                font-weight: bold;
                                padding: 2% 1%;
                                text-decoration: none;
                                text-shadow: 0px 1px 0px #ded17c;
                                text-align: center;
                              ">
                                  <img src="https://cdn.discordapp.com/attachments/762786204071886848/824733778203115590/nintube_icon1.png" width="27"
                                    height="25" class="CToWUd">
                                  Verificar</a></div>
                            </div>
                          </div>
                          <div style="text-align:left">
                            <div
                              style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:14px;line-height:18px;padding-top:12px;text-align:center">
                              <div>Este e-mail foi enviado a você para verificação de existencia de email informado na nossa
                                aplicação
                                NinTube.</div>
                            </div>
                          </div>
                        </td>
                        <td width="8" style="width:8px">
                        </td>
                      </tr>
                    </tbody>
                  </table>
          
          </table>
          </td>
          </tr>
          </tbody>
          </table>`;
		return emailHtml;
	} else {
		const emailHtml = `<table style="width: 100%; height: 100%; min-width: 348px; border: 0; background-color: #212121dc;">
            <tbody>
              <tr align="center">
                <td>
                  <table cellspacing="0" cellpadding="0" style="padding-bottom:20px;max-width:516px;min-width:220px; background-color: white; border-color: black;
                  border-style: solid;
                  border-width: medium;">
                    <tbody>
                      <tr>
                        <td width="8" style="width:8px"></td>
                        <td>
                          <div
                            style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                            align="center" class="m_4541679764111361952mdv2rw">
                            <div style="display: inline-flex;"> <img
                                src="https://cdn.discordapp.com/attachments/762786204071886848/824733778203115590/nintube_icon1.png" width="74"
                                height="74" aria-hidden="true" style="margin-bottom:16px" class="CToWUd">
                              <h1 style="margin-left: 5%;">NinTube</h1>
                            </div>
          
                            <div
                              style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                              <div style="font-size:24px">Oi você solicitou alteração de senha? </div>
          
                            </div>
                            <div
                              style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:19px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center">
                              Se sim clicar no link abaixo para altera-la.<div
                                style="padding-top:32px;text-align:center"><a
                                  href="http://localhost:3000/#/forgot_password/${id}" style="
                                box-shadow: inset 0px -3px 0px 0px white;
                                background: linear-gradient(to bottom, #B3272C, #f03a41e1);
                                border-radius: 6px;
                                border: 1px solid black;
                                display: inline-flex;
                                cursor: pointer;
                                color: black;
                                font-family: Verdana;
                                font-size: 20px;
                                font-weight: bold;
                                padding: 2% 1%;
                                text-decoration: none;
                                text-shadow: 0px 1px 0px #ded17c;
                                text-align: center;
                              ">
                                  <img src="https://cdn.discordapp.com/attachments/762786204071886848/824733778203115590/nintube_icon1.png" width="27"
                                    height="25" class="CToWUd">
                                  Alterar senha</a></div>
                            </div>
                          </div>
                          <div style="text-align:left">
                            <div
                              style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:14px;line-height:18px;padding-top:12px;text-align:center">
                              <div>Este e-mail foi enviado a você para verificação de existencia de email informado na nossa
                                aplicação
                                NinTube.</div>
                            </div>
                          </div>
                        </td>
                        <td width="8" style="width:8px">
                        </td>
                      </tr>
                    </tbody>
                  </table>
          
          </table>
          </td>
          </tr>
          </tbody>
          </table>`;
		return emailHtml;
	}
}
