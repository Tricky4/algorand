/* global AlgoSigner */
import './App.css';
import {Button, Container, Header} from "semantic-ui-react";
import {useState, useCallback} from "react";

//const appId = 13793863;
/**
 * React Component displaying a title, a button doing some (AlgoSigner-related) actions
 * and a message with the result.
 *
 * @param buttonAction is a (potentially async) function called when clicking on the button
 *   and returning the result to be displayed
 */
const ExampleAlgoSigner = ({title, buttonText, buttonAction}) => {
  const [result, setResult] = useState("");

  const onClick = useCallback(async () => {
    const r = await buttonAction();
    setResult(r);
  }, [buttonAction]);

  return (
    <><br />
      <Header as="h2" dividing>{title}</Header><br />
      <Button primary={true} onClick={onClick}>{buttonText}</Button><br />
      {/* <Message>
        <code>
          {result}
        </code>
      </Message> */}
    </>
  );
};

// The following components are all demonstrating some features of AlgoSigner

// const CheckAlgoSigner = () => {
//   const action = useCallback(() => {
//     if (typeof AlgoSigner !== 'undefined') {
//       return "AlgoSigner is installed.";
//     } else {
//       return "AlgoSigner is NOT installed.";
//     }
//   }, []);

//   return <ExampleAlgoSigner title="CheckAlgoSigner" buttonText="Check" buttonAction={action}/>
// };

// const GetAccounts = () => {
//   const action = useCallback(async () => {
//     await AlgoSigner.connect({
//       ledger: 'TestNet'
//     });
//     const accts = await AlgoSigner.accounts({
//       ledger: 'TestNet'
//     });
//     return JSON.stringify(accts, null, 2);
//   }, []);

//   return <ExampleAlgoSigner title="Get Accounts" buttonText="Get Accounts" buttonAction={action}/>
// };

// const GetParams = () => {
//   const action = useCallback(async () => {
//     try {
//       const r = await AlgoSigner.algod({
//         ledger: 'TestNet',
//         path: `/v2/transactions/params`
//       });
//       return JSON.stringify(r, null, 2);
//     } catch (e) {
//       console.error(e);
//       return JSON.stringify(e, null, 2);
//     }
//   }, []);

//   return <ExampleAlgoSigner title="Get Transaction Params" buttonText="Get Transaction Params" buttonAction={action}/>
// };

// const GetAppGlobalState = () => {
//   const action = useCallback(async () => {
//     try {
//       const r = await AlgoSigner.indexer({
//         ledger: 'TestNet',
//         path: `/v2/applications/${appId}`
//       });
//       return JSON.stringify(r, null, 2);
//     } catch (e) {
//       console.error(e);
//       return JSON.stringify(e, null, 2);
//     }
//   }, []);

//   return <ExampleAlgoSigner title="Get Global State" buttonText="Get Global State" buttonAction={action}/>
// };
let signedTxs = null;

const SignTrans = (recv,amt) => {
  //const action = useCallback(() => {
  //var account2 = prompt("Enter receiver address");
  //var algo = prompt("Enter Algo in microAlgos");
  //   if (account2 == null) {
  //     alert("Address is empty");
  // }
  //   else{
    let amt1 = amt.toString();
    document.getElementById("transParams").innerHTML = "Transaction Params : " + amt1;
    AlgoSigner.connect()
  .then((d) => {
    const server = 'https://testnet-algorand.api.purestake.io/ps2'
    //const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'
    const token = {
      'X-API-Key': 'pOD5BAUCxq7InVPjo0sO01B0Vq4d7pD1ask5Ix43'
     }
    const port = '';

    const algosdk = require('algosdk');
    
    let algodClient = new algosdk.Algodv2(token, server, port);
    //let indexerClient = new algosdk.Indexer(token, indexerServer, port);
    
    algodClient.healthCheck().do()
    .then(d => { 
      AlgoSigner.accounts({
        ledger: 'TestNet'
      })
      .then((d) => {
        let accounts = d;
        let acc1 = accounts[0].address;
        let acc2 = recv;
        document.getElementById("acc").innerHTML = "Account Address 1 : " + acc1 + "<br>Account Address 2 : " + acc2;
        console.log("Address of 1st Account : ",accounts[0].address);
        console.log("Address of 2nd Account : ",recv);
        algodClient.getTransactionParams().do()
.then((d) => {
  let txParamsJS = d;
  document.getElementById("transParams").innerHTML = "Transaction Params : " + JSON.stringify(txParamsJS);
  console.log("Tx params : ",txParamsJS);
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accounts[0].address,
    to: recv,
    amount: parseFloat(amt1) * 1000000,
    note: undefined,
    suggestedParams: {...txParamsJS}
  });

  
  // Use the AlgoSigner encoding library to make the transactions base64
  let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
  
  
  AlgoSigner.signTxn([{txn: txn_b64}])

  .then((d) => {
    signedTxs = d;
    // AlgoSigner.send({
    //   ledger: 'TestNet',
    //   tx: signedTxs[0].blob
    // })
    // .then((d) => {
    //   let txID = d;
    //   document.getElementById("txid").innerHTML = "Transaction ID : " + JSON.stringify(txID);
    //   console.log(txID);
    // })
    
    // .catch((e) => {
    //   console.error(e);
    // });
  })
   
   .catch((e) => {
       console.error(e);
   });
 })
.catch((e) => {
  console.error(e);
});

      })
      .catch((e) => {
        console.error(e);
      });
    })
    .catch(e => { 
      console.error(e); 
    });
  })
 
  .catch((e) => {
    console.error(e);
  });
  // }
//}, []);
// return <ExampleAlgoSigner title="Sign Transaction" buttonText="Sign" buttonAction={action}/>
};



const SendTrans = () => {
  //const action = useCallback(async () => {
    AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTxs[0].blob
    })
    .then((d) => {
      let txID = d;
      document.getElementById("txid").innerHTML = "Transaction ID : " + JSON.stringify(txID);
      console.log(txID);
    })
    .catch((e) => {
      console.error(e);
    });
  //}, []);
   
    // return <ExampleAlgoSigner title="Send Transaction" buttonText="Send" buttonAction={action}/>
};

const App = () => {
   const [toaddress,setToaddress] = useState("");
   const [algos,setToalgos] = useState("");
   console.log(toaddress);
   console.log(algos);
  return (
    // <Container className="App">
    <div>
      <br />
      <br />
      <center><Header as="h1" dividing>Send Algos from Account 1 to Receiver</Header></center> <br/><br />
      {/* <p>
        The Pure Stake Team provide many examples using AlgoSigner.
        See <a
        href="https://purestake.github.io/algosigner-dapp-example">https://purestake.github.io/algosigner-dapp-example</a> for
        more examples.
      </p> */}

      {/* <CheckAlgoSigner/>

      <GetAccounts/>

      <GetParams/>

      <GetAppGlobalState/> */}
  <center>  <label>Receiver Address : </label> <input
id="addressid"
  type='text'
  name="toaddress"
  placeholder='Enter the Address'
  required
  onChange={event => setToaddress( event.target.value)}
  
/>
<br />
<br />
<label> microAlgos : </label> <input
id="addressid"
  type='text'
  placeholder='Enter Algos in microAlgos'
  name="toaddress"
  required
  onChange={event => setToalgos( event.target.value)}
  
/>
      {/* <center><SignTrans onSub={toaddress} onSubs={algos} /></center> */}
       {/* <center><SendTrans /></center> */}
      <br /><br />
      <button class="button button2" onClick={() => SignTrans(toaddress, algos)} >sign </button>
      <br /><br />
      <button class="button button2" onClick={() => SendTrans()} >send </button></center><br />
      {/* <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <center> <p>Made With Love By Thiru</p></center> */}
      </div>
    // </Container>
  );
};

export default App;
