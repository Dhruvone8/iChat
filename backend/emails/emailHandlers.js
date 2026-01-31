const { resendClient, sender } = require("../utils/resend");
const { createWelcomeEmailTemplate } = require("./emailTemplates");

const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to iChat",
        html: createWelcomeEmailTemplate(name, clientURL),
    })

    if(error) {
        console.error(error)
        throw error
    }

    console.log("Email sent successfully", data);
}

module.exports = {
    sendWelcomeEmail
}
