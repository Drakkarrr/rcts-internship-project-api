export const emailVerification = ({
  title = 'Verify your email',
  name = '',
  link = '',
  time = new Date(),
  emailToken,
}: {
  title?: string;
  name?: string;
  link?: string;
  time?: Date;
  emailToken: string;
}): string => {
  return `
    <div>

        <head data-id="__react-email-head">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${title}</title>
        </head>
        <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Rcts erp demo verification<div>  &#8204;&#8203;&#8205;&#8206;&#8207; </div>
        </div>

        <body data-id="__react-email-body">
            <h2 data-id="react-email-heading">${title}</h2>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:16px;line-height:24px;margin:16px 0">Hello ${name},</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Code : <br>${emailToken}</br> </p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Thank you for signing up for RCTS ! Before we can activate your account, we kindly ask you to verify your email address by clicking on the link provided below:</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0"><a href="${link}">${link}</a></p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Thank you for choosing RCTS. We look forward to having you as a valued user!</p>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Best regards,</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Salah Eddine Lalami</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Founder @ RCTS</p>
        </body>
    </div>
    `;
};

export const passwordVerification = ({
  title = 'Reset your Password',
  name = '',
  link = '',
  time = new Date(),
}: {
  title?: string;
  name?: string;
  link?: string;
  time?: Date;
}): string => {
  return `
    <div>

        <head data-id="__react-email-head">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${title}</title>
        </head>
        <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Reset your Password<div>  &#8204;&#8203;&#8205;&#8206;&#8207; </div>
        </div>

        <body data-id="__react-email-body">
            <h2 data-id="react-email-heading">${title}</h2>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Hello ${name},</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">We have received a request to reset the password for your account on RCTS. To proceed with the password reset, please click on the link provided below:</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0"><a href="${link}">${link}</a></p>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Best regards,</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Salah Eddine Lalami</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Founder @ RCTS</p>
        </body>
    </div>
    `;
};

export const afterRegistrationSuccess = ({
  title = 'Customize RCTS ERP CRM or build your own SaaS',
  name = '',
}: {
  title?: string;
  name?: string;
}): string => {
  return `
    <div>

        <head data-id="__react-email-head">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${title}</title>
        </head>
        <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Customize RCTS or build your own Saas<div>  &#8204;&#8203;&#8205;&#8206;&#8207; </div>
        </div>

        <body data-id="__react-email-body">
            <h2 data-id="react-email-heading">${title}</h2>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Hello ${name},</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">I would like to invite you to book a call if you need : </p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0"> * Customize or adding new features to RCTS ERP CRM.</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0"> * Build your own custom SaaS solution based on RCTS ERP CRM , With RCTS SaaS license  ,  instead of investing  in an uncertain developer team. This opportunity allows you to build a tailored SaaS platform that meets your specific business needs.</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0"> Book a call here  <a href="https://pornhub.com">https://pornhub.com</a></p>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Best regards,</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Admin Drak Test</p>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0">Founder @ RCTS</p>
        </body>
    </div>
    
    `;
};
