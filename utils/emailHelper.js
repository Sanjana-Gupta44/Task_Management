const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    auth:{
        user:process.env.SEND_MAIL_GMAIL_ACCOUNT,
        pass:process.env.SEND_MAIL_GMAIL_ACCOUNT_PASSWORD,
    },
});

const sendEmail = async(to,subject,html) =>{
    try{
        const info = await transporter.sendMail({
            from:'Task Management <guptasanjana2002@gmail.com> ',
            to,
            subject,
            html,
    
        });
        return info;

    }catch(err){
        console.log("Error occured in sendEmail");
        console.log(err.message);
        return false;
        
        
    }
 

}
const sendOtpEmail = async (email,otp) =>{
    const isemailSent=await sendEmail(email,"OTP verification from Task Management",`<p>Your OTP is <span style="color:brown">${otp}</span></p>`);
};
module.exports = {
    sendOtpEmail,
}


const encryptKey = 10;

const encryptPassword = (plainPassword) => {
    let encryptedPassword = "";
    for(let i=0; i<plainPassword.length; i++){
        const asciiValue = plainPassword.charCodeAt(i);
        const newAsciiValue = asciiValue + encryptKey;
        const newChar = String.fromCharCode(newAsciiValue);
        encryptedPassword += newChar;
    }
    console.log(plainPassword, encryptedPassword);
}

const decryptPassword = (encryptedPassword) => {
    let plainPassword = "";
    for(let i=0; i<encryptedPassword.length; i++){
        const asciiValue = encryptedPassword.charCodeAt(i);
        const newAsciiValue = asciiValue - encryptKey;
        const newChar = String.fromCharCode(newAsciiValue);
        plainPassword += newChar;
    }
    console.log(plainPassword, encryptedPassword);
}

// encryptPassword("abc");
decryptPassword("klm");