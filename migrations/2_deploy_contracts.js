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
  const [trader1, trader2, trader3, trader4, trader5, _] = accounts;
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

  const amount = web3.utils.toWei('2500');
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
  await Promise.all(
    [usdc, grt, link, mana, sand].map((token) =>
      seedTokenBalance(token, trader5)
    )
  );

  // const increaseTime = async (seconds) => {
  //   await web3.currentProvider.send(
  //     {
  //       jsonrpc: '2.0',
  //       method: 'evm_increaseTime',
  //       params: [seconds],
  //       id: 0
  //     },
  //     () => {}
  //   );
  //   await web3.currentProvider.send(
  //     {
  //       jsonrpc: '2.0',
  //       method: 'evm_mine',
  //       params: [],
  //       id: 0
  //     },
  //     () => {}
  //   );
  // };

  // create trades
  await dex.createLimitOrder(
    GRT,
    web3.utils.toWei('100'),
    web3.utils.toWei('1.1', 'kwei'),
    SIDE.BUY,
    {
      from: trader1,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(GRT, web3.utils.toWei('100'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    GRT,
    web3.utils.toWei('50'),
    web3.utils.toWei('1.2', 'kwei'),
    SIDE.BUY,
    {
      from: trader1,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(GRT, web3.utils.toWei('50'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    GRT,
    web3.utils.toWei('200'),
    web3.utils.toWei('1.22', 'kwei'),
    SIDE.BUY,
    {
      from: trader1,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(GRT, web3.utils.toWei('200'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    GRT,
    web3.utils.toWei('60'),
    web3.utils.toWei('1.15', 'kwei'),
    SIDE.BUY,
    {
      from: trader1,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(GRT, web3.utils.toWei('60'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    GRT,
    web3.utils.toWei('200'),
    web3.utils.toWei('1.38', 'kwei'),
    SIDE.BUY,
    {
      from: trader1,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(GRT, web3.utils.toWei('200'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });

  await dex.createLimitOrder(
    LINK,
    web3.utils.toWei('20'),
    web3.utils.toWei('6.38', 'kwei'),
    SIDE.BUY,
    {
      from: trader3,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(LINK, web3.utils.toWei('20'), SIDE.SELL, {
    from: trader4,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    LINK,
    web3.utils.toWei('50'),
    web3.utils.toWei('6.68', 'kwei'),
    SIDE.BUY,
    {
      from: trader4,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(LINK, web3.utils.toWei('50'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    LINK,
    web3.utils.toWei('80'),
    web3.utils.toWei('6.58', 'kwei'),
    SIDE.BUY,
    {
      from: trader4,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(LINK, web3.utils.toWei('80'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });
  await increaseTime(1);
  await dex.createLimitOrder(
    LINK,
    web3.utils.toWei('15'),
    web3.utils.toWei('6.72', 'kwei'),
    SIDE.BUY,
    {
      from: trader4,
      gas: 3000000
    }
  );
  await dex.createMarketOrder(LINK, web3.utils.toWei('15'), SIDE.SELL, {
    from: trader2,
    gas: 3000000
  });

  //   create orders
  await Promise.all([
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('1.19', 'kwei'),
      SIDE.BUY,
      {
        from: trader1,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('1.20', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('1.21', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('50'),
      web3.utils.toWei('5.97', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('50'),
      web3.utils.toWei('5.95', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('50'),
      web3.utils.toWei('5.98', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('0.82', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('0.80', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('0.85', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('1.85', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('1.95', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      GRT,
      web3.utils.toWei('50'),
      web3.utils.toWei('2.05', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('30'),
      web3.utils.toWei('7.05', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('30'),
      web3.utils.toWei('7.15', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      LINK,
      web3.utils.toWei('30'),
      web3.utils.toWei('7.25', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.25', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.35', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      MANA,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.38', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.02', 'kwei'),
      SIDE.BUY,
      {
        from: trader2,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.03', 'kwei'),
      SIDE.BUY,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.04', 'kwei'),
      SIDE.BUY,
      {
        from: trader4,
        gas: 3000000
      }
    ),

    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.55', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.65', 'kwei'),
      SIDE.SELL,
      {
        from: trader3,
        gas: 3000000
      }
    ),
    dex.createLimitOrder(
      SAND,
      web3.utils.toWei('100'),
      web3.utils.toWei('1.68', 'kwei'),
      SIDE.SELL,
      {
        from: trader4,
        gas: 3000000
      }
    )
  ]);
};
