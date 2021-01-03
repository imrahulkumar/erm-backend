"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailInviteHtml = void 0;
function emailInviteHtml(role, companyName, email, password, link) {
    let string = `<center>
  <table class='body-wrap' style='text-align:center;width:86%;font-family:arial,sans-serif;border:12px solid rgba(126, 122, 122, 0.08);border-spacing:4px 20px;'>
    
          <tr>
            <td>
                <center>
                    <table bgcolor='#FFFFFF' width='80%'' border='0'>
                        <tbody>
                            <tr>
                                <td style='font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5'>
                                    <h1 style='color:#575252;text-align:center;'>Welcome to ERM</h1>
                                </td>
                            </tr>
                            <tr style='text-align:center;color:#575252;font-size:14px;'>
                                <td>
                                    <span><h3>Congratulations<h3></span>
                                </td>
                            </tr>
                            <tr style='text-align:center;color:#a2a2a2;font-size:14px;'>
                                <td>
                                    <span>You are added as ${role} in our ${companyName}.</span>
                                </td>
                            </tr>
                            <tr style='text-align:center;color:#a2a2a2;font-size:14px;height:45px;'>
                                <td>
                                    <span>Please go and login your account <a href="${link}">Click Here</a></span>
                                </td>
                            </tr>
                            <tr style='text-align:center;color:#a2a2a2;font-size:14px;height:45px;'>
                                <td>
                                    <span><b style='color:#575252;'>Email:</b> ${email}</span>
                                </td>                               
                            </tr>
                            <tr style='text-align:center;color:#a2a2a2;font-size:14px;height:45px;'>
                               <td>
                                  <span><b style='color:#575252;'>Password:</b> ${password}</span>
                               </td>
                            </tr>

                        </tbody>
                    </table>
                </center>
            </td>
        </tr>
    </table>
</center>`;
    return string;
}
exports.emailInviteHtml = emailInviteHtml;
