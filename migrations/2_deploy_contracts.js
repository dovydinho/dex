const Usdc = artifacts.require('mocks/Usdc.sol');
const Grt = artifacts.require('mocks/Grt.sol');
const Link = artifacts.require('mocks/Link.sol');
const Mana = artifacts.require('mocks/Mana.sol');
const Sand = artifacts.require('mocks/Sand.sol');
const Dex = artifacts.require('Dex.sol');

const [USDC, GRT, LINK, MANA, SAND] = [
  'USDC',
  'GRT',
  'LINK',
  'MANA',
  'SAND'
].map((ticker) => web3.utils.fromAscii(ticker));

const SIDE = {
  BUY: 0,
  SELL: 1
};

module.exports = async function (deployer, _network, accounts) {
  const [trader1, trader2, trader3, trader4, _] = accounts;
  await Promise.all(
    [Usdc, Grt, Link, Mana, Sand, Dex].map((contract) =>
      deployer.deploy(contract)
    )
  );
  const [usdc, grt, link, mana, sand, dex] = await Promise.all(
    [Usdc, Grt, Link, Mana, Sand, Dex].map((contract) => contract.deployed())
  );

  await Promise.all([
    dex.addToken(USDC, usdc.address),
    dex.addToken(GRT, grt.address),
    dex.addToken(LINK, link.address),
    dex.addToken(MANA, mana.address),
    dex.addToken(SAND, sand.address)
  ]);

  const amount = web3.utils.toWei('50000');
  const seedTokenBalance = async (token, trader) => {
    await token.faucet(trader, amount);
    await token.approve(dex.address, amount, { from: trader });
    const ticker = await token.symbol();
    await dex.deposit(amount, web3.utils.fromAscii(ticker), { from: trader });
  };

  await Promise.all(
    [usdc, grt, link, mana, sand].map((token) =>
      seedTokenBalance(token, trader1)
    )
  );
  await Promise.all(
    [usdc, grt, link, mana, sand].map((token) =>
      seedTokenBalance(token, trader2)
    )
  );
  await Promise.all(
    [usdc, grt, link, mana, sand].map((token) =>
      seedTokenBalance(token, trader3)
    )
  );
  await Promise.all(
    [usdc, grt, link, mana, sand].map((token) =>
      seedTokenBalance(token, trader4)
    )
  );

  // Create TRADES with initial contract deployment.

  // Dummy GRT TRADE execution during smart contract deployment.

  // GRT Pair #1
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.11', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #1

  // GRT Pair #2
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.28', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #2

  // GRT Pair #3
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.22', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #3

  // GRT Pair #4
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.32', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #4

  // GRT Pair #5
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.16', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #5

  // GRT Pair #6
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.30', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(GRT, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of GRT Pair #6

  // Dummy LINK TRADE execution during smart contract deployment.

  // LINK Pair #1
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.30', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader4,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #1

  // LINK Pair #2
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.16', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #2

  // LINK Pair #3
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.32', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #3

  // LINK Pair #4
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.22', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #4

  // LINK Pair #5
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.28', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #5

  // LINK Pair #6
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('10'),
      web3.utils.toWei('6.11', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(LINK, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of LINK Pair #6

  // Dummy MANA TRADE execution during smart contract deployment.

  // MANA Pair #1
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.81', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader4,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #1

  // MANA Pair #2
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.84', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #2

  // MANA Pair #3
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.74', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #3

  // MANA Pair #4
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.76', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #4

  // MANA Pair #5
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.86', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #5

  // MANA Pair #6
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.92', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(MANA, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of MANA Pair #6

  // Dummy SAND TRADE execution during smart contract deployment.

  // SAND Pair #1
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.92', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader4,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #1

  // SAND Pair #2
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.86', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #2

  // SAND Pair #3
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.76', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #3

  // SAND Pair #4
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.70', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #4

  // SAND Pair #5
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.88', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #5

  // SAND Pair #6
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('10'),
      web3.utils.toWei('0.85', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createMarketOrder(SAND, web3.utils.toWei('10'), SIDE.SELL, {
      from: trader2,
      gas: 3000000
    })
  ]);
  // End of SAND Pair #6

  // End of Create TRADES with initial contract deployment.

  // Create ORDERS with initial contract deployment.

  // GRT Orders BUY
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('300'),
      web3.utils.toWei('0.28', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('300'),
      web3.utils.toWei('0.29', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('300'),
      web3.utils.toWei('0.27', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    )
  ]);
  // End of GRT Orders BUY

  // GRT Orders SELL
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.38', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('600'),
      web3.utils.toWei('0.42', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('800'),
      web3.utils.toWei('0.44', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    )
  ]);
  // End of GRT Orders SELL

  // LINK Orders BUY
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('400'),
      web3.utils.toWei('5.80', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('400'),
      web3.utils.toWei('5.78', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('400'),
      web3.utils.toWei('5.82', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    )
  ]);
  // End of LINK Orders BUY

  // LINK Orders SELL
  await Promise.all([
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('500'),
      web3.utils.toWei('7.02', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('500'),
      web3.utils.toWei('7.08', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('500'),
      web3.utils.toWei('7.06', 'kwei'),
      SIDE.SELL,
      {
        from: trader2,
        gas: 3000000
      }
    )
  ]);
  // End of LINK Orders SELL

  // MANA Orders BUY
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.80', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.78', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.82', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    )
  ]);
  // End of MANA Orders BUY

  // MANA Orders SELL
  await Promise.all([
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.02', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.08', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.06', 'kwei'),
      SIDE.SELL,
      {
        from: trader2,
        gas: 3000000
      }
    )
  ]);
  // End of MANA Orders SELL

  // SAND Orders BUY
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.90', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.98', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('500'),
      web3.utils.toWei('0.92', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    )
  ]);
  // End of SAND Orders BUY

  // SAND Orders SELL
  await Promise.all([
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.12', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.18', 'kwei'),
      SIDE.SELL,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('200'),
      web3.utils.toWei('1.16', 'kwei'),
      SIDE.SELL,
      {
        from: trader2,
        gas: 3000000
      }
    )
    // End of SAND Orders SELL
  ]);

  // End of Create ORDERS with initial contract deployment.
};
