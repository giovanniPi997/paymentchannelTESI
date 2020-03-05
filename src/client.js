/*const Web3 = require('web3');
const WiFiTokenContract = require('../build/contracts/WiFiToken');
const WiFiTokenAddr = '0x40B36F251e2C4cAcd56f6DA5B98386bC98179ACe';
const PaymentChannelContract = require('../build/contracts/PaymentChannel');
const PaymentChannelAddr = '0x162B6f64475F64A13B3d9bb208ecdecA2f10c711';

var socket = require('socket.io-client')('http://127.0.0.1:7546');
const web3Provider = 'ws://127.0.0.1:7545';
const WiFiTokenOwnerAccountNr = 0;

const costPerHour=100;
let wantedHours=2
const deposit=costPerHour*wantedHours;

let web3;
let accounts;
let myAccount;
let otherAccount;
let WiFiToken;
let PaymentChannel;
let myAccountOptions;
let WiFiTokenOwnerAccountOptions;
let blockNumber;
var balance = 0;
let myBalance;
let accountNr=0;
let otherBalance = 0;
let stop = false;
let permission=false;
var wifi = require("node-wifi");
var s1=-100;
var s2=-100;
var server1;
var server2;
var ii=0;
var jj=0;
var number;
// Initialize wifi module
// Absolutely necessary even to set interface to null

const scanner  =  () => {
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});
 
// Scan networks
 wifi.scan(function(err, networks) {
  if (err) {
    console.log(err);
  } else {
    for(var i=1;i<networks.length;i++){
         number = parseInt(networks[i].signal_level, 10);
        
        if (number > s1)  
        {  
            s2 = s1;  
            s1 = number;  
            jj=ii;
            ii=i;
        }else if (number > s2 && number != s1) {
          s2 = number;   
          jj=i;
        } 
    }
    server1=networks[ii].ssid;
    server2=networks[jj].ssid;
    console.log("SERVER 1 :"+ server1 +"\n"+"SERVER 2 :"+ server2);
        
  }
});
}
const initWeb3AndContracts = async () => {
  
  var web3 = new Web3( web3Provider
);
  accounts = await web3.eth.getAccounts();
  myAccount = accounts[accountNr];
  web3.defaultAccount = myAccount;
  console.log('Web3 started');
  console.log('Client address:'+ myAccount);

  myAccountOptions = {
    from: myAccount,
    gas: 6000000
  };

  WiFiTokenOwnerAccountOptions = {
    from: accounts[WiFiTokenOwnerAccountNr],
    gas: 6000000
  };
  WiFiToken = new web3.eth.Contract(WiFiTokenContract.abi, WiFiTokenAddr);

  PaymentChannel = new web3.eth.Contract(
    PaymentChannelContract.abi,
    PaymentChannelAddr
  );
};

const openPaymentChannel = async () => {
  
  myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Deploy contract rewards: ' + myBalance);
const deposit=10000;
const acc=await WiFiToken.methods.isOwner(myAccount).call();
const xxx=await WiFiToken.methods.isMinter(myAccount).call();
console.log(acc);
console.log(xxx);


 await WiFiToken.methods.mint(myAccount, deposit).send(WiFiTokenOwnerAccountOptions);
 
// await WiFiToken.methods.transfer(otherAccount, value).send({from: myAccount});
 //await WiFiToken.methods.transferFrom(myAccount,otherAccount, value);

 myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
  from: myAccount
});
console.log('Final Balance2: ' + myBalance);

  await WiFiToken.methods
    .approve(PaymentChannelAddr, 2000)
    .send(myAccountOptions);

  const receipt = await PaymentChannel.methods
    .createChannel(otherAccount, 2000)
    .send(myAccountOptions);


  blockNumber = receipt.blockNumber;
  console.log(
    'Opened Payment Channel with deposit: ' +
    2000 +
      ' and block number: ' +
      blockNumber
  );
   myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Final Balance2: ' + myBalance);
    
    var obj = {
      deposit:2000,
      blockNumber: blockNumber,
      senderAddr: myAccount}

      // Send State Channel info to the server via sockets
      socket.emit('info', obj);
};





const senderHash="";
const sendMessage = async () => {
  balance=1500;
  wantedHours--;
  const senderSign = await signBalance();
  console.log("SENDER SIGN :"+senderSign);
  var message = {
  type: 'balance',
  message: '',
  balance: balance,
  signature: senderSign
}
myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
  from: myAccount
});
console.log('Final Balance: ' + myBalance);
// Send Signed message to the server via sockets
socket.emit('messageSC', message);
};

const signBalance = async () => {
  const senderHash = web3.utils.soliditySha3(
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
  console.log("SENDER HASH :"+senderHash);
  console.log("SENDER sign :"+web3.eth.sign(senderHash, myAccount));
  return await web3.eth.sign(senderHash, myAccount);
 
};

 
    // Add a connect listener
    const connection = async () => {
    socket.on('connect',function() {
      console.log('Client has connected to the server!');
    });
    // Add a connect listener for server address
    socket.on('message',function(data) {
      console.log('received the server address!',data);
      otherAccount=data;
      sendAddressToServer(myAccount);
    });
    // Add a disconnect listener
    socket.on('disconnect',function() {
      console.log('The client has disconnected!');
    });

    //listener for password sended by server
    socket.on('password',function(password){
      console.log("MY PASSWORD:"+password);
    })
 
    socket.on("closing",function(close){
      if(close=="STOP"){
        socket.emit("closingConfirmed","STOP")
      }
    })
    // Sends a client address to the server via sockets
    function sendAddressToServer(message) {
      socket.send(message);
    };
  }

  
 // Add a connect listener
 const connection2 = async () => {
  socket2.on('connect',function() {
    console.log('Client has connected to the server!');
  });
  // Add a connect listener for server address
  socket2.on('message',function(data) {
    console.log('received the server address!',data);
    otherAccount=data;
    sendAddressToServer(myAccount);
  });
  // Add a disconnect listener
  socket2.on('disconnect',function() {
    console.log('The client has disconnected!');
  });

  //listener for password sended by server
  socket2.on('password',function(password){
    console.log("MY PASSWORD:"+password);
  })

  socket2.on("closing",function(close){
    if(close=="STOP"){
      socket.emit("closingConfirmed","STOP")
    }
  })
  // Sends a client address to the server via sockets
  function sendAddressToServer(message) {
    socket.send(message);
  };
}

const main = async () => {
  await scanner();
  await connection();
  await initWeb3AndContracts();

  await openPaymentChannel();  
 
  await sendMessage();

};

main();*/

const Web3 = require('web3');
const WiFiTokenContract = require('../build/contracts/WiFiToken');
const WiFiTokenAddr = '0x40B36F251e2C4cAcd56f6DA5B98386bC98179ACe';
const PaymentChannelContract = require('../build/contracts/PaymentChannel');
const PaymentChannelAddr = '0x162B6f64475F64A13B3d9bb208ecdecA2f10c711';

var socket = require('socket.io-client')('http://127.0.0.1:7546');

const web3Provider = 'ws://127.0.0.1:7545';
const WiFiTokenOwnerAccountNr = 0;

const costPerHour=100;
let wantedHours=2
const deposit=costPerHour*wantedHours;

let web3;
let accounts;
let myAccount;
let otherAccount;
let WiFiToken;
let PaymentChannel;
let myAccountOptions;
let WiFiTokenOwnerAccountOptions;
let blockNumber;
let balance = 0;
let myBalance;
let accountNr=0;
let otherBalance = 0;
let stop = false;
let permission=false;


const initWeb3AndContracts = async () => {
  
  web3 = new Web3(web3Provider);

  accounts = await web3.eth.getAccounts();
  myAccount = accounts[accountNr];
  web3.defaultAccount = myAccount;
  console.log('Web3 started');
  console.log('Client address:'+ myAccount);

  myAccountOptions = {
    from: myAccount,
    gas: 6000000
  };

  WiFiTokenOwnerAccountOptions = {
    from: accounts[WiFiTokenOwnerAccountNr],
    gas: 6000000
  };
  WiFiToken = new web3.eth.Contract(WiFiTokenContract.abi, WiFiTokenAddr);

  PaymentChannel = new web3.eth.Contract(
    PaymentChannelContract.abi,
    PaymentChannelAddr
  );
};

const openPaymentChannel = async () => {
  
  myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Deploy contract rewards: ' + myBalance);
const deposit=10000;
const acc=await WiFiToken.methods.isOwner(myAccount).call();
const xxx=await WiFiToken.methods.isMinter(myAccount).call();
console.log(acc);
console.log(xxx);


 await WiFiToken.methods.mint(myAccount, 1000000000000000).send(WiFiTokenOwnerAccountOptions);
 
// await WiFiToken.methods.transfer(otherAccount, value).send({from: myAccount});
 //await WiFiToken.methods.transferFrom(myAccount,otherAccount, value);

 myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
  from: myAccount
});
console.log('Final Balance2: ' + myBalance);

  await WiFiToken.methods
    .approve(PaymentChannelAddr, 2000)
    .send(myAccountOptions);

  const receipt = await PaymentChannel.methods
    .createChannel(otherAccount, 2000)
    .send(myAccountOptions);


  blockNumber = receipt.blockNumber;
  console.log(
    'Opened Payment Channel with deposit: ' +
    2000 +
      ' and block number: ' +
      blockNumber
  );
   myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
    from: myAccount
  });
  console.log('Final Balance2: ' + myBalance);
    
    var obj = {
      deposit:2000,
      blockNumber: blockNumber,
      senderAddr: myAccount}

      // Send State Channel info to the server via sockets
      socket.emit('info', obj);
};





const senderHash="";
const sendMessage = async () => {
  
  wantedHours--;
  const senderSign = await signBalance();
  console.log("SENDER SIGN :"+senderSign);
  var message = {
  type: 'balance',
  message: '',
  balance: 1500,
  signature: senderSign
}
myBalance = await WiFiToken.methods.balanceOf(myAccount).call({
  from: myAccount
});
console.log('Final Balance: ' + myBalance);
// Send Signed message to the server via sockets
socket.emit('messageSC', message);
};

const signBalance = async () => {
  const senderHash = web3.utils.soliditySha3(
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
      value: 1500
    },
    {
      type: 'address',
      value: PaymentChannelAddr
    }
  );
  console.log("SENDER HASH :"+senderHash);
  console.log(web3.eth.sign(senderHash, myAccount));
  return await web3.eth.sign(senderHash, myAccount);
 
};

 
    // Add a connect listener
    const connection = async () => {
    socket.on('connect',function() {
      console.log('Client has connected to the server!');
    });
    // Add a connect listener for server address
    socket.on('message',function(data) {
      console.log('received the server address!',data);
      otherAccount=data;
      sendAddressToServer(myAccount);
    });
    // Add a disconnect listener
    socket.on('disconnect',function() {
      console.log('The client has disconnected!');
    });

    //listener for password sended by server
    socket.on('password',function(password){
      console.log("MY PASSWORD:"+password);
    })
 
    socket.on("closing",function(close){
      if(close=="STOP"){
        socket.emit("closingConfirmed","STOP")
      }
    })
    // Sends a client address to the server via sockets
    function sendAddressToServer(message) {
      socket.send(message);
    };
  }

  


const main = async () => {
  await connection();
  await initWeb3AndContracts();
  await openPaymentChannel();  
  await sendMessage();
 
};

main();