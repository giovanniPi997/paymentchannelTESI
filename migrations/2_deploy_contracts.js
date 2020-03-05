const WiFiToken = artifacts.require("WiFiToken");
const PaymentChannel = artifacts.require("PaymentChannel");

module.exports = function (deployer) {

    return deployer
        .deploy(WiFiToken)
       
        .then(() => {
            return deployer.deploy(
                PaymentChannel,
                WiFiToken.address
            );
        })

};