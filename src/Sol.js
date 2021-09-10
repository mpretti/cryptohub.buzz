import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Wallet from "@project-serum/sol-wallet-adapter";
import {
  Connection,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  PublicKey
} from "@solana/web3.js";
import {
  createTransferBetweenSplTokenAccountsInstruction,
  getOwnedTokenAccounts
} from "./utils/tokens";
import { parseTokenAccountData } from "./utils/tokens/data";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import "./Sol.css";
const web3 = require("@solana/web3.js");
const axios = require("axios");

var splToken = require("@solana/spl-token");

// import "./styles.css";

function toHex(buffer) {
  return Array.prototype.map
    .call(buffer, x => ("00" + x.toString(16)).slice(-2))
    .join("");
}

function Sol() {
  const [logs, setLogs] = useState([]);
  function addLog(log) {
    setLogs(logs => [...logs, log]);
  }

  const Icon = mint => {
    console.log();
    console.log("Trying to get icon with :", mint);
    const token = tokenMap.get(mint);
    console.log(Array.from(tokenMap.keys()));
    if (!token || !token.logoURI) return null;
    // debugger;
    return (
      <div class="container">
        <img class="token-image" src={token.logoURI} alt={token.symbol} />
        <div class="text-block">
          <h4>{token.symbol}</h4>
          <p>{token.name}</p>
        </div>
      </div>
    );
  };

  const getAllTokenInfo = () => {
    new TokenListProvider()
      .resolve()
      .then(tokens => {
        if (tokens) {
          console.log(`Got all SPL Token info...${tokens.tokenList.length}`);
        } else {
          console.log(`No tokens.`);
        }
        const tokenList = tokens.filterByChainId(101).getList();
        setTokenMap(
          tokenList.reduce((map, item) => {
            map.set(item.address, item);
            return map;
          }, new Map())
        );
      })
      .catch(console.log);
  };

  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

  const [provider, setProvider] = useState();
  const [tokenMap, setTokenMap] = useState(new Map());
  const [count, setCount] = useState(0);
  const network = clusterApiUrl("mainnet-beta");
  const [providerUrl, setProviderUrl] = useState("https://www.sollet.io");
  const connection = useMemo(() => new Connection(network), [network]);
  const [ethAddress, setEthAddress] = useState();
  const [message, setMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [infoMessage, setInfoMessage] = useState();
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const urlWallet = useMemo(() => new Wallet(providerUrl, network), [
    providerUrl,
    network
  ]);
  const [selectedWallet, setSelectedWallet] = useState();
  const injectedWallet = useMemo(() => {
    try {
      return new Wallet(window.solana, network);
    } catch (e) {
      console.log(`Could not create injected wallet: ${e}`);
      return null;
    }
  }, [network, selectedWallet]);

  const [connected, setConnected] = useState(false);

  useEffect(async () => {
    console.log("Initializing. Connecting provider");
    if (provider && !provider.isConnected) {
      console.log("Provider no connected. Connecting now");
      let result = await provider.connect();
      console.log("Attempt to Connect result: ", result);
    }
    console.log("Get all SPL Token info...");
    getAllTokenInfo();
  }, []);

  useEffect(async () => {
    console.log("Provider changed, connecting...");
    if (provider && !provider.isConnected) {
      console.log("Provider no connected. Connecting now");
      let result = await provider.connect();
      console.log("Attempt to Connect result: ", result);
    }
  }, [provider]);

  useEffect(() => {
    setInfoMessage("selected Wallet Changed count:", count + 1);
    setCount(count + 1);
    if (selectedWallet) {
      selectedWallet.on("connect", () => {
        setConnected(true);
        if ("solana" in window) {
          if (window.solana.isPhantom) {
            setProvider(window.solana);
          }
        }
        addLog("Connected to wallet " + selectedWallet.publicKey.toBase58());
      });
      selectedWallet.on("disconnect", () => {
        setConnected(false);
        addLog("Disconnected from wallet");
      });
      selectedWallet.connect();
      return () => {
        if (selectedWallet) {
          try {
            selectedWallet.disconnect().catch(e => {
              setErrorMessage(
                "tried to disconnect a disconnected wallet. oops"
              );
            });
          } catch (e) {
            setErrorMessage("tried to disconnect a disconnected wallet. oops");
          }
        }
      };
    }
  }, [selectedWallet]);

  const sendPhantomTransaction = async () => {
    const transaction = await createTransferTransaction();
    if (transaction) {
      try {
        let signed = await provider.signTransaction(transaction);
        addLog("Got signature, submitting transaction");
        let signature = await connection.sendRawTransaction(signed.serialize());
        addLog(
          "Submitted transaction " + signature + ", awaiting confirmation"
        );
        await connection.confirmTransaction(signature);
        addLog("Transaction " + signature + " confirmed");
      } catch (err) {
        console.warn(err);
        addLog("Error: " + JSON.stringify(err));
      }
    }
  };

  async function transferTokens() {
    // Detecing and storing the phantom wallet of the user (creator in this case)
    // Referring to the payment emitter as creator
    debugger;

    // console.log("Creator's public key: ", provider.publicKey.toString());

    // I have hardcoded my secondary wallet address here. you can take this address either from user input or your DB or wherever
    var receiverWallet = "AvdiQQJ42jLHa5QWTTwz1tukwHE74efzZXAGVASVERZ5";
    var gumballWallet = "D8MsGJAimLdWKmmGdhcAD7L5MbNZyztiMpg5FyKZRsas";

    // Establishing connection
    // var connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    debugger;
    var connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
    console.log("Connection: ", connection);

    var transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "BYZ2z8Gwm2S31R3y7vzTBkSd7wrhk7dwkzmPJ2J2vSkz",
        "H5gUr7coGbGtxJhKAxt7oUeEPLg3XFUu8Gm34yMQRTN",
        selectedWallet.publicKey,
        [],
        1
      )
    );
    //
    // // fromTokenAccount is essentially the account *inside* the creator's Phantom wallet that will be able to handle the creator's own tokens
    // let fromTokenAccount = provider.publicKey;
    //
    // // toTokenAccount is essentially the account *inside* the reciever's Phantom wallet that will be able to handle the creator's own tokens
    // let toTokenAccount = gumballWallet.publicKey;

    // static createTransferInstruction(
    //   programId: PublicKey,
    //   source: PublicKey,
    //   destination: PublicKey,
    //   owner: PublicKey,
    //   multiSigners: Array<Signer>,
    //   amount: number | u64,
    // ):
    // // This is the transaction skeleton => Instruction of transfer of creator tokens from creator's phantom wallet to the destination address

    console.log(
      `From pubkey: $receiverWallet} gumballWallet: ${gumballWallet}, 1`
    );

    console.log("create transfer instruction transaction:", transaction);

    // Setting the variables for the transaction
    transaction.feePayer = selectedWallet.publicKey;

    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    // Transaction constructor initialized successfully
    if (transaction) {
      console.log("Txn created successfully");
    }

    // Request creator to sign the transaction (allow the transaction)
    let signed = await provider.signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);

    //Signature
    console.log("Signature: ", signature);
  }

  async function getProgramAccounts() {
    var connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
    console.log("Connection: ", connection);

    debugger;

    let token_accounts = [];
    if (selectedWallet) {
      console.log("Getting program accounts for ", selectedWallet.publicKey);
      token_accounts = await connection.getProgramAccounts(
        selectedWallet.publicKey
      );
    }

    let bob = {
      jsonrpc: "2.0",
      id: 1,
      method: "getProgramAccounts",
      params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          encoding: "jsonParsed",
          filters: [
            {
              dataSize: 165
            },
            {
              memcmp: {
                offset: 32,
                bytes: selectedWallet.publicKey.toBase58()
              }
            }
          ]
        }
      ]
    };
    let res = await axios.post("http://api.mainnet-beta.solana.com", bob);
    console.log("Res:", res);
    if (res.status === 200) {
      console.log("Res Ok!");
      let data = await res.data;
      console.log("Data: ", res.data);
      setTokenAccounts(res.data.result);
    } else {
      console.log("Boo");
      setTokenAccounts([]);
    }
    console.log(tokenAccounts);
    setInfoMessage(tokenAccounts.length);
  }

  const createTransferTransaction = async () => {
    if (!provider.publicKey) {
      return;
    }
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: provider.publicKey,
        lamports: 100
      })
    );
    transaction.feePayer = provider.publicKey;
    addLog("Getting recent blockhash");
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return transaction;
  };

  async function dismissMessages() {
    setErrorMessage("");
    setInfoMessage("");
  }

  async function sendTransaction() {
    debugger;
    try {
      // Destination is the Associated Token Account of the receiver.
      const destinationAddress = new PublicKey(
        "7gydJwvjn1pqmk4U3uBWpQ9riFx8YsN1ptyPgv7mZ78P"
      );
      // token address of USDT token in ^ destinationAddress account
      const mxMint = new PublicKey(
        "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
      );
      // Decimals of the token mint
      const decimals = 4;
      // Send 1 token
      const transferAmountString = "1";
      let amountFix = Math.round(
        parseFloat(transferAmountString) * 10 ** decimals
      );
      // Not sure what this is
      const memo = null;

      // We need to get the Associated Token Account of the sender (the wallet).
      // If they don't have it, this will fail and the transaction too.
      // It will also fail if they don't have enough balance, but hey, one step at a time.
      const sourceSplTokenAccount = (
        await getOwnedTokenAccounts(connection, selectedWallet.publicKey)
      )
        .map(({ publicKey, accountInfo }) => {
          console.log(publicKey);
          return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
        })
        .filter(({ parsed }) => parsed.mint.equals(mxMint))
        .sort((a, b) => {
          return b.parsed.amount - a.parsed.amount;
        })[0];

      let transaction = createTransferBetweenSplTokenAccountsInstruction({
        ownerPublicKey: selectedWallet.publicKey,
        mint: mxMint,
        decimals: 4,
        sourcePublicKey: sourceSplTokenAccount.publicKey,
        destinationPublicKey: destinationAddress,
        amount: amountFix,
        memo: memo
      });

      // let transaction = new Transaction().add(
      //   SystemProgram.transfer({
      //     fromPubkey: selectedWallet.publicKey,
      //     toPubkey: selectedWallet.publicKey,
      //     lamports: 100,
      //   })
      // );
      addLog("Getting recent blockhash");
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      addLog(
        `Sending ${transferAmountString} of ${mxMint.toString()} to recipient at: ${destinationAddress.toString()}`
      );
      addLog("Sending signature request to wallet");
      transaction.feePayer = selectedWallet.publicKey;
      let signed = await selectedWallet.signTransaction(transaction);
      addLog("Got signature, submitting transaction");
      let signature = await connection.sendRawTransaction(signed.serialize());
      addLog("Submitted transaction " + signature + ", awaiting confirmation");
      await connection.confirmTransaction(signature, "singleGossip");
      addLog("Transaction " + signature + " confirmed");
    } catch (e) {
      console.warn(e);
      addLog("Error: " + e.message);
    }
  }

  async function ethStuff() {
    await window.ethereum.enable();
    setEthAddress(window.ethereum.selectedAddress);
  }

  async function signMessage() {
    try {
      addLog("Sending message signature request to wallet");
      const data = new TextEncoder().encode(message);
      const signed = await selectedWallet.sign(data, "hex");
      addLog("Got signature: " + toHex(signed.signature));
    } catch (e) {
      console.warn(e);
      addLog("Error: " + e.message);
    }
  }

  async function connectInjectedWallet() {
    setInfoMessage("Hello");
    if (injectedWallet) {
      if (injectedWallet.isConnected) {
        setSelectedWallet(injectedWallet);
        setConnected(true);
      }

      setSelectedWallet(injectedWallet);
    }
  }

  return (
    <div className="App">
      <h1>Gumball Signing Automata Amazing 3000</h1>
      <h3 id="errors" style={{ color: "red" }}>
        {errorMessage}
      </h3>
      <h3 id="errors" style={{ color: "blue" }}>
        {infoMessage}
      </h3>
      <div>
        {tokenMap &&
          tokenAccounts.length > 2 &&
          tokenAccounts.map(ta =>
            Icon(ta["account"]["data"]["parsed"]["info"]["mint"])
          )}
      </div>
      <div>Token Map keys size: {tokenMap ? tokenMap.keys().length : "0"} </div>
      <div>
        {tokenAccounts && tokenAccounts.length} Network: {network}
      </div>
      <div>
        Waller provider:{" "}
        <input
          type="text"
          value={providerUrl}
          onChange={e => setProviderUrl(e.target.value.trim())}
        />
      </div>
      <div>
        <button onClick={() => dismissMessages()}>Clear</button>
      </div>
      {selectedWallet && selectedWallet.connected ? (
        <div>
          <div>Wallet address: {selectedWallet.publicKey.toBase58()}.</div>
          <input
            type="text"
            placeholder="Enter the message to sign here"
            value={message}
            onChange={obj => setMessage(obj.target.value)}
          />
          <button onClick={sendTransaction}>Send Token Transaction</button>
          <button onClick={transferTokens}>Transfer Tokens</button>
          <button onClick={signMessage}>Sign Message</button>
          <button onClick={getProgramAccounts}>Get Token Accounts</button>
          <button onClick={getAllTokenInfo}>Get All Token Info</button>
          <button onClick={() => selectedWallet.disconnect()}>
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <button onClick={ethStuff}>Connect to ETH Wallet</button>
          <button onClick={() => setSelectedWallet(urlWallet)}>
            Connect to Wallet
          </button>
          <button onClick={() => connectInjectedWallet()}>
            Connect to Injected Wallet
          </button>
        </div>
      )}
      <hr />
      <div className="logs">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default Sol;
