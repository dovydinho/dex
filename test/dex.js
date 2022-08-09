const { expectRevert } = require("@openzeppelin/test-helpers");
const Usdc = artifacts.require("mocks/Usdc.sol");
const Grt = artifacts.require("mocks/Grt.sol");
const Link = artifacts.require("mocks/Link.sol");
const Mana = artifacts.require("mocks/Mana.sol");
const Sand = artifacts.require("mocks/Sand.sol");
const Dex = artifacts.require("Dex.sol");

const SIDE = {
  BUY: 0,
  SELL: 1,
};

contract("Dex", (accounts) => {
  let usdc, grt, link, mana, sand, dex;
  const [trader1, trader2] = [accounts[1], accounts[2]];
  const [USDC, GRT, LINK, MANA, SAND] = [
    "USDC",
    "GRT",
    "LINK",
    "MANA",
    "SAND",
  ].map((ticker) => web3.utils.fromAscii(ticker));

  beforeEach(async () => {
    [usdc, grt, link, mana, sand] = await Promise.all([
      Usdc.new(),
      Grt.new(),
      Link.new(),
      Mana.new(),
      Sand.new(),
    ]);
    dex = await Dex.new();
    await Promise.all([
      dex.addToken(USDC, usdc.address),
      dex.addToken(GRT, grt.address),
      dex.addToken(LINK, link.address),
      dex.addToken(MANA, mana.address),
      dex.addToken(SAND, sand.address),
    ]);

    const amount = web3.utils.toWei("1000");
    const seedTokenBalance = async (token, trader) => {
      await token.faucet(trader, amount);
      await token.approve(dex.address, amount, { from: trader });
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
  });

  it("should deposit tokens", async () => {
    const amount = web3.utils.toWei("100");

    await dex.deposit(amount, USDC, { from: trader1 });

    const balance = await dex.traderBalances(trader1, USDC);
    assert(balance.toString() === amount);
  });

  it("should NOT deposit tokens if token does not exist", async () => {
    await expectRevert(
      dex.deposit(
        web3.utils.toWei("100"),
        web3.utils.fromAscii("TOKEN-DOES-NOT-EXIST"),
        { from: trader1 }
      ),
      "this token does not exist"
    );
  });

  it("should withdraw tokens", async () => {
    const amount = web3.utils.toWei("100");

    await dex.deposit(amount, USDC, { from: trader1 });

    await dex.withdraw(amount, USDC, { from: trader1 });

    const [balanceDex, balanceUsdc] = await Promise.all([
      dex.traderBalances(trader1, USDC),
      usdc.balanceOf(trader1),
    ]);
    assert(balanceDex.isZero());
    assert(balanceUsdc.toString() === web3.utils.toWei("1000"));
  });

  it("should NOT withdraw tokens if token does not exist", async () => {
    await expectRevert(
      dex.withdraw(
        web3.utils.toWei("1000"),
        web3.utils.fromAscii("TOKEN-DOES-NOT-EXIST"),
        { from: trader1 }
      ),
      "this token does not exist"
    );
  });

  it("should NOT withdraw tokens if balance too low", async () => {
    await dex.deposit(web3.utils.toWei("100"), USDC, { from: trader1 });

    await expectRevert(
      dex.withdraw(web3.utils.toWei("1000"), USDC, { from: trader1 }),
      "balance too low"
    );
  });

  it("should create limit order", async () => {
    await dex.deposit(web3.utils.toWei("100"), USDC, { from: trader1 });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 10, SIDE.BUY, {
      from: trader1,
    });

    let buyOrders = await dex.getOrders(GRT, SIDE.BUY);
    let sellOrders = await dex.getOrders(GRT, SIDE.SELL);
    assert(buyOrders.length === 1);
    assert(buyOrders[0].trader === trader1);
    assert(buyOrders[0].ticker === web3.utils.padRight(GRT, 64));
    assert(buyOrders[0].price === "10");
    assert(buyOrders[0].amount === web3.utils.toWei("10"));
    assert(sellOrders.length === 0);

    await dex.deposit(web3.utils.toWei("200"), USDC, { from: trader2 });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 11, SIDE.BUY, {
      from: trader2,
    });

    buyOrders = await dex.getOrders(GRT, SIDE.BUY);
    sellOrders = await dex.getOrders(GRT, SIDE.SELL);
    assert(buyOrders.length === 2);
    assert(buyOrders[0].trader === trader2);
    assert(buyOrders[1].trader === trader1);
    assert(sellOrders.length === 0);

    await dex.deposit(web3.utils.toWei("200"), USDC, { from: trader2 });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 9, SIDE.BUY, {
      from: trader2,
    });

    buyOrders = await dex.getOrders(GRT, SIDE.BUY);
    sellOrders = await dex.getOrders(GRT, SIDE.SELL);
    assert(buyOrders.length === 3);
    assert(buyOrders[0].trader === trader2);
    assert(buyOrders[1].trader === trader1);
    assert(buyOrders[2].trader === trader2);
    assert(sellOrders.length === 0);
  });

  it("should NOT create limit order if token balance too low", async () => {
    await dex.deposit(web3.utils.toWei("99"), GRT, { from: trader1 });

    await expectRevert(
      dex.createLimitOrder(GRT, web3.utils.toWei("100"), 10, SIDE.SELL, {
        from: trader1,
      }),
      "token balance too low"
    );
  });

  it("should NOT create limit order if usdc balance too low", async () => {
    await dex.deposit(web3.utils.toWei("99"), USDC, { from: trader1 });

    await expectRevert(
      dex.createLimitOrder(GRT, web3.utils.toWei("10"), 10 * 1000, SIDE.BUY, {
        from: trader1,
      }),
      "usdc balance too low"
    );
  });

  it("should NOT create limit order if token is USDC", async () => {
    await expectRevert(
      dex.createLimitOrder(USDC, web3.utils.toWei("1000"), 10, SIDE.BUY, {
        from: trader1,
      }),
      "cannot trade USDC"
    );
  });

  it("should NOT create limit order if token does not not exist", async () => {
    await expectRevert(
      dex.createLimitOrder(
        web3.utils.fromAscii("TOKEN-DOES-NOT-EXIST"),
        web3.utils.toWei("1000"),
        10,
        SIDE.BUY,
        { from: trader1 }
      ),
      "this token does not exist"
    );
  });

  it("should create market order & match", async () => {
    await dex.deposit(web3.utils.toWei("100"), USDC, { from: trader1 });

    await dex.createLimitOrder(
      GRT,
      web3.utils.toWei("10"),
      10 * 1000,
      SIDE.BUY,
      {
        from: trader1,
      }
    );

    await dex.deposit(web3.utils.toWei("100"), GRT, { from: trader2 });

    await dex.createMarketOrder(GRT, web3.utils.toWei("5"), SIDE.SELL, {
      from: trader2,
    });

    const balances = await Promise.all([
      dex.traderBalances(trader1, USDC),
      dex.traderBalances(trader1, GRT),
      dex.traderBalances(trader2, USDC),
      dex.traderBalances(trader2, GRT),
    ]);
    const orders = await dex.getOrders(GRT, SIDE.BUY);
    assert(orders.length === 1);
    assert((orders[0].filled = web3.utils.toWei("5")));
    assert(balances[0].toString() === web3.utils.toWei("50"));
    assert(balances[1].toString() === web3.utils.toWei("5"));
    assert(balances[2].toString() === web3.utils.toWei("50"));
    assert(balances[3].toString() === web3.utils.toWei("95"));
  });

  it("should NOT create market order if token balance too low", async () => {
    await expectRevert(
      dex.createMarketOrder(GRT, web3.utils.toWei("101"), SIDE.SELL, {
        from: trader2,
      }),
      "token balance too low"
    );
  });

  it("should NOT create market order if usdc balance too low", async () => {
    await dex.deposit(web3.utils.toWei("100"), GRT, { from: trader1 });

    await dex.createLimitOrder(GRT, web3.utils.toWei("100"), 10, SIDE.SELL, {
      from: trader1,
    });

    await expectRevert(
      dex.createMarketOrder(GRT, web3.utils.toWei("101"), SIDE.BUY, {
        from: trader2,
      }),
      "usdc balance too low"
    );
  });

  it("should NOT create market order if token is USDC", async () => {
    await expectRevert(
      dex.createMarketOrder(USDC, web3.utils.toWei("1000"), SIDE.BUY, {
        from: trader1,
      }),
      "cannot trade USDC"
    );
  });

  it("should NOT create market order if token does not not exist", async () => {
    await expectRevert(
      dex.createMarketOrder(
        web3.utils.fromAscii("TOKEN-DOES-NOT-EXIST"),
        web3.utils.toWei("1000"),
        SIDE.BUY,
        { from: trader1 }
      ),
      "this token does not exist"
    );
  });

  it("should delete order", async () => {
    await dex.deposit(web3.utils.toWei("100"), USDC, { from: trader1 });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 1, SIDE.BUY, {
      from: trader1,
    });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 2, SIDE.BUY, {
      from: trader1,
    });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 3, SIDE.BUY, {
      from: trader1,
    });

    await dex.createLimitOrder(GRT, web3.utils.toWei("10"), 4, SIDE.BUY, {
      from: trader1,
    });

    let buyOrders = await dex.getOrders(GRT, SIDE.BUY);

    assert(buyOrders.length === 4);

    await dex.deleteOrder(GRT, SIDE.BUY, 1, { from: trader1, gas: 3000000 });

    let buyOrders2 = await dex.getOrders(GRT, SIDE.BUY);

    assert(buyOrders2.length === 3);
  });
});