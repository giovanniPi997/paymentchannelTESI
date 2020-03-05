const Web3 = require('web3');
const WiFiTokenContract = require('../build/contracts/WiFiToken');
const WiFiTokenAddr = '0x40B36F251e2C4cAcd56f6DA5B98386bC98179ACe';
const PaymentChannelContract = require('../build/contracts/PaymentChannel');
const PaymentChannelAddr = '0x162B6f64475F64A13B3d9bb208ecdecA2f10c711';


const web3Provider = 'ws://127.0.0.1:7545';
const iotaProvider = 'https://nodes.devnet.iota.org';
const accountNr = 1;

const costPerHour = 100;

// Must be equal to client and different for each test
let senderSign;
let web3;
let accounts;
let myAccount;
let otherAccount;
let PaymentChannel;
let myAccountOptions;
let blockNumber;
var balance=0;
let otherBalance = 0;
let mam;
let stop = false;
let open=false;
var interval;
var message;
const myBalance=0;
var http = require('http');
var io = require('socket.io');
var port = 7546;
// Start the server at port 7546
var server = http.createServer(function(req, res){ 
});
server.listen(port);
// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

const initWeb3AndContracts = async () => {
  web3 = new Web3(web3Provider);
    accounts = await web3.eth.getAccounts();
    myAccount = accounts[accountNr];
    web3.defaultAccount = myAccount;
    console.log('Web3 started');
    console.log('Server address:'+myAccount);
    myAccountOptions = {
      from: myAccount,
      gas: 6000000
    };
  
    WiFiToken = new web3.eth.Contract(WiFiTokenContract.abi, WiFiTokenAddr);
    PaymentChannel = new web3.eth.Contract(
      PaymentChannelContract.abi,
      PaymentChannelAddr
    );
       

  };
  
  const listenPaymentChannelEvent = () => {
    PaymentChannel.events
      .ChannelCreated({
        filter: {
          receiverAddr: myAccount
        }
      })
  };
  
const connection = async () => {
  var x;
// Add a connect listener
socket.on('connection', function(client){ 

    console.log('Connection to client established');
    sendAddressToClient(myAccount);

    // Success!  Now listen to messages to be received
    client.on('message',function(event){ 
        console.log('received the client address',event);
        otherAccount=event;
    });





    client.on('disconnect',function(){
        clearInterval(interval);
        console.log('Server has disconnected');
    });
    //listener to receive info of the channel opened by the client
    client.on('info',function(obj){
      console.log('Received object:',obj.deposit,obj.blockNumber,obj.senderAddr)
      if(obj.deposit!=0 && obj.blockNumber!=0 && obj.senderAddr==otherAccount){
        console.log("CHANNEL OPENED");
        blockNumber=obj.blockNumber;
        interval= setInterval(function(){console.log("HAI 3 SECONDI")}, 10000); 

      }
     });

     //listener to receive signed message by the client
     client.on('messageSC',function(message){
      console.log('Received message:'+message.balance)
      message={
        type: 'balance',
        message: '',
        balance: message.balance,
        signature: message.signature
      }
      balance=balance+message.balance;
      console.log(balance);
      console.log(balance+1);
      checkSignature(message);
     });

     client.on('closingConfirmed',function(close){
      console.log('Received message:'+close)
      if(close=="STOP"){
        gang=true;
      }
      
     });

});
 function sendAddressToClient(message1) {
      socket.send(message1);
    };
  function sendCostToClient(cost){
    socket.send(cost);
  }
};

const checkSignature =async message => { 
 console.log("//////////CHECKING SIGNATURE/////////////");    
   const balanceHash = web3.utils.soliditySha3(
      {
        type: 'address',
        value: myAccount
      },
      {
        type: 'uint32',
        value: blockNumber
      },
      {
        type: 'uint192',
        value: balance
      },
      {
        type: 'address',
        value: PaymentChannelAddr
      }
    );
    console.log(balanceHash);
    
    const accountRecovered = await web3.eth.accounts.recover(
      balanceHash,
      message.signature
    );
    if(accountRecovered==otherAccount){
      var password={
        type: 'password',
        password: "Password123",
        validation: true
      }
      socket.emit("password",password);
      
  const myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Final Balance: ' + myBalance);
      }
  
  console.log(accountRecovered);
    console.log("////////////////////////////");
    senderSign=message.signature;
    
    console.log(senderSign);
    close(senderSign);
    
  return accountRecovered === otherAccount;
  
};



const signBalance = async () => {
  const receiverHash = web3.utils.soliditySha3(
    {
      type: 'address',
      value: otherAccount
    },
    {
      type: 'uint32',
      value: blockNumber
    },
    {
      type: 'uint192',
      value: balance
    },
    {
      type: 'address',
      value: PaymentChannelAddr
    }
  );
  console.log(receiverHash);
  socket.emit("closing","STOP");
  return await web3.eth.sign(receiverHash, myAccount);
 
};

const close = async senderSign => {
  const receiverSign = await signBalance();
  console.log("//////////////////////////////");
  console.log("BLOCK NUMBER:"+blockNumber);
  console.log('SENDER SIGN'+senderSign);
  console.log('RECEIVER SIGN'+receiverSign);
  console.log("BALANCE:"+balance);
  console.log("//////////////////////////////");
  try {
   const FinalBalance = await WiFiToken.methods.balanceOf(myAccount).call({
      from: myAccount
    });
    const balanceGANG=100;
    console.log('Final Balance1: ' + FinalBalance);
    const test1=await PaymentChannel.methods
      .closeChannel(
        myAccount,
        blockNumber,
        balance,
        senderSign,
        receiverSign
      ).send(myAccountOptions);
      
  } catch (e) {
    console.log(e);
  }
};


const test = async () => {
  const FinalBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Balance: ' + FinalBalance);
}




const main = async () => {
    await connection();
    await initWeb3AndContracts();
     listenPaymentChannelEvent();
     
     
    await test();
    
  };

  
  
   main();
  
