const generateOTP = ()=>{
    const x = Math.random();
    const fourDigitDeciNumber = x*9000+1000;
    const fourDigitNumber = Math.floor(fourDigitDeciNumber);
    return fourDigitNumber
};

module.exports = {
    generateOTP
};