const getEmailTemplate = (
  name,
  message,
  hasBtn = false,
  buttonText = "",
  buttonLink = ""
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Global Diamond Capital</title>

<style>
    body{
        margin:0;
        padding:0;
        background:#f5f5f5;
        font-family:Arial, Helvetica, sans-serif;
        color:#333;
    }

    .container{
        max-width:600px;
        margin:30px auto;
        background:#fff;
        border-radius:10px;
        overflow:hidden;
        border:1px solid #e5e5e5;
    }

    .header{
        background:#1abc9c;
        padding:30px;
        text-align:center;
    }

    .header h1{
        margin:0;
        color:#fff;
        font-size:28px;
    }

    .body{
        padding:35px 30px;
        line-height:1.8;
        font-size:16px;
    }

    .button-wrapper{
        text-align:center;
        margin:35px 0;
    }

    .btn{
        display:inline-block;
        padding:14px 28px;
        background:#1abc9c;
        color:#ffffff !important;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        font-size:16px;
    }

    .btn:hover{
        background:#16a085;
    }

    .footer{
        background:#fafafa;
        padding:25px;
        text-align:center;
        font-size:14px;
        color:#777;
    }

    .footer a{
        color:#1abc9c;
        text-decoration:none;
    }
</style>

</head>

<body>

<div class="container">

    <div class="header">
        <h1>Global Diamond Capital</h1>
    </div>

    <div class="body">

        <p>Hello <strong>${name}</strong>,</p>

        <p>${message}</p>

        ${
          hasBtn
            ? `
            <div class="button-wrapper">
                <a href="${buttonLink}" class="btn">
                    ${buttonText}
                </a>
            </div>
        `
            : ""
        }

        <p>
            If you have any questions or need assistance,
            simply reply to this email and our support team
            will be happy to help.
        </p>

    </div>

    <div class="footer">

        <p>Thank you for choosing Global Diamond Capital.</p>

        <p>
            <a href="https://globaldiamondcapital.com">
                Visit our website
            </a>
            &nbsp;|&nbsp;
            <a href="mailto:support@globaldiamondcapital.com">
                Contact Support
            </a>
        </p>

    </div>

</div>

</body>
</html>
`;
};

module.exports = getEmailTemplate;