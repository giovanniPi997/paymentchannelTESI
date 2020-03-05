const WiFiToken = artifacts.require('WiFiToken');
const PaymentChannel = artifacts.require('PaymentChannel');

let blockNumber;
const balance=0;
contract('PaymentsChannel', async accounts => {
    it("puts 10000 WiFiToken in the first account", async () => {
        const receiverHash = web3.utils.soliditySha3({
            type: 'address',
            value: "0x40C9383f7eBaE99d5A2D7173cb32661556194827"
        }, {
            type: 'uint32',
            value: 7453442
        }, {
            type: 'uint192',
            value: 1000000
        }, {
            type: 'address',
            value: "0x169f8A5C4dFd4A8c7e4B074Acf1C3Ac483faE6F1"
        });
        const receiverSign = await web3.eth.sign(receiverHash, "0x0df64dD4744bc4436bD5c656815531E7149CFf46");
        //console.log('\n Receiver: ' + accounts[1]);
        //console.log(receiverHash);
        //console.log(receiverSign);

        const senderHash = web3.utils.soliditySha3({
            type: 'address',
            value: "0x0df64dD4744bc4436bD5c656815531E7149CFf46"
        }, {
            type: 'uint32',
            value: 7453442
        }, {
            type: 'uint192',
            value: 1000000
        }, {
            type: 'address',
            value: "0x169f8A5C4dFd4A8c7e4B074Acf1C3Ac483faE6F1"
        });
        const senderSign = await web3.eth.sign(senderHash, "0x40C9383f7eBaE99d5A2D7173cb32661556194827");
 console.log(receiverSign);
 console.log(senderSign);
         });

    it("opens a channel from first account to second", async () => {
    });

    it("closes a channel", async () => {
       
});
})

/*
        const receiverHash = web3.utils.soliditySha3({
            type: 'address',
            value: "0x40C9383f7eBaE99d5A2D7173cb32661556194827"
        }, {
            type: 'uint32',
            value: 7449494
        }, {
            type: 'uint192',
            value: 1000000
        }, {
            type: 'address',
            value: "0x00Aff0F1B13F88e0212E8bF90676edA4f9652827"
        });
        const receiverSign = await web3.eth.sign(receiverHash, "0x0df64dD4744bc4436bD5c656815531E7149CFf46");
        //console.log('\n Receiver: ' + accounts[1]);
        //console.log(receiverHash);
        //console.log(receiverSign);

        const senderHash = web3.utils.soliditySha3({
            type: 'address',
            value: "0x0df64dD4744bc4436bD5c656815531E7149CFf46"
        }, {
            type: 'uint32',
            value: 7449494
        }, {
            type: 'uint192',
            value: 1000000
        }, {
            type: 'address',
            value: "0x00Aff0F1B13F88e0212E8bF90676edA4f9652827"
        });
        const senderSign = await web3.eth.sign(senderHash, "0x40C9383f7eBaE99d5A2D7173cb32661556194827");
 console.log(receiverSign);
 console.log(senderSign);
    */ 