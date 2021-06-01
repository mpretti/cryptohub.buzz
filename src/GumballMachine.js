import React, { useEffect, useState, useRef } from "react";
import { setupWallet, submitPayment, requestAirdrop } from "./lib";

import Matter from "matter-js";
const STATIC_DENSITY = 15;
const PARTICLE_SIZE = 36;
const PARTICLE_BOUNCYNESS = 0.9;

const MASTER_PUBLIC_KEY = "Ej5Jes3HkwBHDPT6MRoBB6d1afiVck9sUi6dsQccaFCQ";

const GumballMachine = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [constraints, setContraints] = useState();
  const [scene, setScene] = useState();
  const [kinWallet, setKinWallet] = useState(null);
  const [assetSelected, setAssetSelected] = useState("KIN");
  const [gumballCount, setGumballCount] = useState(0);
  const [someStateValue, setSomeStateValue] = useState(false);
  const [created, setCreated] = useState();
  const [sending, setSending] = useState(false);
  const [productionEvironment, setProductionEnvironment] = useState(false);

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect());
  };
  const onPaymentSubmitCallback = bert => {
    console.log("Clicked");
  };
  const onPaymentEndCallback = async resp => {
    console.log(resp);
    if (resp.success) {
      await onAccountUpdate({
        wallet: resp.wallet,
        tokenAccounts: resp.tokenAccounts
      });
    }
  };
  const handleClick = () => {
    // if (kinWallet.tokenAccounts[0].balance > 0) {
    submitPayment(
      kinWallet.wallet,
      MASTER_PUBLIC_KEY,
      "1",
      "Anything",
      onPaymentSubmitCallback,
      onPaymentEndCallback,
      false
    );
    setSomeStateValue(!someStateValue);
    // } else {
    //   alert("GET SOME KIN");
    // }
  };
  const onAccountUpdate = wallets_and_accounts => {
    console.log(wallets_and_accounts);
    setKinWallet(wallets_and_accounts);
  };
  const createKinWallet = () => {
    // submitPayment(
    //   wallet,
    //   props.destinationAddress,
    //   props.kinAmount,
    //   props.memo,
    //   props.onPaymentSubmitCallback,
    //   props.onPaymentEndCallback,
    //   productionEvironment
    // );
  };

  const initWallet = () => {
    const localSetupWallet = async () => {
      let wallet = null;
      let walletDetails = window.localStorage.getItem("wallet");
      if (walletDetails) {
        wallet = JSON.parse(walletDetails);
      }

      let wallet_and_accounts = await setupWallet(wallet);

      if (wallet_and_accounts) {
        setKinWallet(wallet_and_accounts);
        window.localStorage.setItem(
          "wallet",
          JSON.stringify(wallet_and_accounts.wallet)
        );
        onAccountUpdate(wallet_and_accounts);
        setCreated(true);
      }
    };
    return localSetupWallet();
  };

  useEffect(() => {
    initWallet();
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let Composite = Matter.Composite;
    let Composites = Matter.Composites;

    let engine = Engine.create({});
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        background: "transparent",
        wireframes: false
      }
    });
    const floor = Bodies.rectangle(0, 0, 0, STATIC_DENSITY, {
      isStatic: true,
      render: {
        fillStyle: "blue"
      }
    });

    let offset = 64;
    let options = {
      isStatic: true
    };

    // Composite.add(engine.world, [
    //   Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
    //   Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
    //   Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
    //   Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)
    // ]);

    var stack = Composites.stack(20, 20, 10, 4, 0, 0, function(x, y) {
      console.log("x:", x, " y:", y);
    });

    World.add(engine.world, [floor]);
    Engine.run(engine);
    Render.run(render);
    setContraints(boxRef.current.getBoundingClientRect());
    setScene(render);
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints;
      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];
      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2
      });
      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY }
      ]);
    }
  }, [scene, constraints]);
  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene) {
      let { width } = constraints;
      let randomX = Math.floor(Math.random() * -width) + width;
      console.log("RANDOM X:", randomX);
      if (randomX % 2 == 1) {
        Matter.World.add(
          scene.engine.world,
          Matter.Bodies.circle(randomX, -PARTICLE_SIZE, PARTICLE_SIZE, {
            restitution: PARTICLE_BOUNCYNESS,
            render: {
              sprite: {
                texture: `./img/${assetSelected}.png`
              }
            }
          })
        );
      } else {
        Matter.World.add(
          scene.engine.world,
          Matter.Bodies.rectangle(
            randomX,
            -PARTICLE_SIZE,
            PARTICLE_SIZE,
            PARTICLE_SIZE,
            {
              restitution: PARTICLE_BOUNCYNESS,
              render: {
                strokeStyle: "#ffffff"
              }
            }
          )
        );
      }
      setGumballCount(gumballCount + 1);
    }
  }, [someStateValue]);

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid white",
        paddingBottom: "512px",
        borderBottom: "8px solid black",
        padding: "64px"
      }}
    >
      <div style={{ textAlign: "center" }}>Crypto Gumball Machine</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: "16px",
          marginBottom: "32px"
        }}
      >
        <div>Gumballs</div>
        <div>{gumballCount}</div>
        <div>Users</div>
        <div>0</div>
        <div>Unique Balls</div>
        <div>1</div>
        <div>
          <select
            onChange={obj => {
              console.log(obj.target.value);
              setAssetSelected(obj.target.value);
            }}
            name="assets"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="KIN">KIN</option>
            <option value="ADA">ADA</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
      </div>
      {!kinWallet && (
        <button
          style={{
            cursor: "pointer",
            display: "block",
            textAlign: "center",
            marginBottom: "16px",
            width: "100%"
          }}
          onClick={() => createKinWallet()}
        >
          Create KIN Wallet
        </button>
      )}
      <button
        variant="contained"
        onClick={async () => {
          await requestAirdrop(kinWallet.wallet, "200", onAccountUpdate);
        }}
      >
        Airdrop
      </button>
      {created &&
        kinWallet &&
        kinWallet.tokenAccounts &&
        kinWallet.tokenAccounts.length > 0 && (
          <>
            <p>{kinWallet.tokenAccounts[0].balance}</p>
          </>
        )}
      <button
        style={{
          cursor: "pointer",
          display: "block",
          textAlign: "center",
          marginBottom: "16px",
          width: "100%"
        }}
        onClick={() => handleClick()}
      >
        HAVE a crypto, LEAVE a crypto. NEED a crypto, TAKE a crypto.
      </button>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default GumballMachine;
