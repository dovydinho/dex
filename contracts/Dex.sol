// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/*
* @author Dovydas Lapinskas - https://dovydas.io
*/
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Dex {

    enum Side {
        BUY,
        SELL
    }

    /*
    *   Storage
    */

    address public admin;
    uint public nextOrderId;
    uint public nextTradeId;
    bytes32[] public tokenList;
    bytes32 constant USDC = bytes32('USDC');
    mapping(bytes32 => Token) public tokens;
    mapping(address => mapping(bytes32 => uint)) public traderBalances;
    mapping(bytes32 => mapping(uint => Order[])) public orderBook;

    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    struct Order {
        uint id;
        address trader;
        Side side;
        bytes32 ticker;
        uint amount;
        uint filled;
        uint price;
        uint date;
    }

    /*
    * Events
    */

    event NewTrade(uint tradeId, uint orderId, bytes32 indexed ticker, address indexed trader1, address indexed trader2, uint amount, uint price, uint date);
    
    /*
    * Construct
    */

    // @notice Contract deployer is admin.
    constructor() {
        admin = msg.sender;
    }

    /*
    *  Functions
    */

    // @return Array of orders by side (BUY or SELL).
    function getOrders(
        bytes32 ticker,
        Side side)
        external 
        view
        returns(Order[] memory) {
        return orderBook[ticker][uint(side)];
    }

    // @return Array of deployed tokens.
    function getTokens() 
        external 
        view 
        returns(Token[] memory) {
        Token[] memory _tokens = new Token[](tokenList.length);
        for (uint i = 0; i < tokenList.length; i++) {
          _tokens[i] = Token(
            tokens[tokenList[i]].ticker,
            tokens[tokenList[i]].tokenAddress
          );
        }
        return _tokens;
    }

    // @notice Function for admin to add token to exchange.
    function addToken(bytes32 ticker, address tokenAddress) onlyAdmin() external {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokenList.push(ticker);
    }

    // @notice Transfer existing token from wallet to exchange.
    function deposit(uint amount, bytes32 ticker) tokenExist(ticker) external {
        IERC20(tokens[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
        traderBalances[msg.sender][ticker] += amount;
    }

    // @notice Transfer existing token from exchange to wallet.
    function withdraw(uint amount, bytes32 ticker) tokenExist(ticker) external {
        require(traderBalances[msg.sender][ticker] >= amount, 'balance too low');
        traderBalances[msg.sender][ticker] -= amount;
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount);
    }

    // @notice Create the order (BUY or SELL) for selected token.
    function createLimitOrder(bytes32 ticker, uint amount, uint price, Side side) tokenExist(ticker) tokenIsNotUsdc(ticker) external {
        if(side == Side.SELL) {
            // @notice Validate that seller has enough tokens to finalize order.
            require(traderBalances[msg.sender][ticker] >= amount, 'token balance too low');
        } else {
            // @notice Validate that buyer has enough stablecoin to finalize order.
            require(traderBalances[msg.sender][USDC] >= amount * price / 1000, 'usdc balance too low');
        }
        // @notice Fetch both side orders (SELL and BUY).
        Order[] storage orders = orderBook[ticker][uint(side)];
        Order[] storage opositeOrders = orderBook[ticker][uint(side == Side.BUY ? Side.SELL : Side.BUY)];
        uint remaining = amount;
        uint tradesFulfilled = 0;
        uint i = 0;
        // @notice Proceed only if oposite side orders are available.
        if(opositeOrders.length > 0) {
            // @notice Check if matching price orders are available.
            while(side == Side.SELL ? (opositeOrders[i].price >= price) : (opositeOrders[i].price <= price) && remaining > 0) {
                // @notice Check if creator of matched order is not the same as limnit order creator.
                if(opositeOrders[i].trader != msg.sender) {
                    uint available = opositeOrders[i].amount - opositeOrders[i].filled;
                    uint matched = (remaining > available) ? available : remaining;
                    remaining -= matched;
                    opositeOrders[i].filled += matched;
                    // @notice Execute trade and distribute matched amounts.
                    emit NewTrade(nextTradeId, opositeOrders[i].id, ticker, opositeOrders[i].trader, msg.sender, matched, opositeOrders[i].price, block.timestamp);
                    if(side == Side.SELL) {
                        traderBalances[msg.sender][ticker] -= matched;
                        traderBalances[msg.sender][USDC] += matched * opositeOrders[i].price / 1000;
                        traderBalances[opositeOrders[i].trader][ticker] += matched;
                    }
                    if(side == Side.BUY) {
                        require(traderBalances[msg.sender][USDC] >= matched * opositeOrders[i].price / 1000, 'usdc balance too low');
                        traderBalances[msg.sender][ticker] += matched;
                        traderBalances[msg.sender][USDC] -= matched * opositeOrders[i].price / 1000;
                        traderBalances[opositeOrders[i].trader][USDC] += matched * opositeOrders[i].price / 1000;
                    }
                    // @notice Increment fulfilled trades count.
                    if(opositeOrders[i].filled == opositeOrders[i].amount) {
                        tradesFulfilled++;
                    }
                    nextTradeId++;
                }
                i++;
                if(i >= opositeOrders.length) {break;}
            }
        }

        // @notice Remove fulfilled orders from orders array.
        if (tradesFulfilled > 0) {
            do {
                for (uint k = 0; k < opositeOrders.length; k++) {
                    if(opositeOrders[k].filled == opositeOrders[k].amount) {
                        for(uint j = k; j < opositeOrders.length - 1; j++ ) {
                            opositeOrders[j] = opositeOrders[j + 1];
                        }
                        opositeOrders.pop();
                        tradesFulfilled--;
                    }
                }
            } while (tradesFulfilled > 0);
        }
        // @notice Proceed if remaining amount is not exhausted.
        if(remaining > 0) {
            bool priceExist = false;
            i = 0;
            // @notice Check if the order creator has same price order already available (append existing order if true).
            while(i < orders.length) {
                if(orders[i].price == price && orders[i].trader == msg.sender) {
                    orders[i].amount += remaining;
                    priceExist = true;
                    break;
                }
                i++;
            } 
            // @notice Push the new order to orders array.
            if(!priceExist) {
                orders.push(Order(
                    nextOrderId,
                    msg.sender,
                    side,
                    ticker,
                    remaining,
                    0,
                    price,
                    block.timestamp
                ));
                // @notice Allocate order values.
                if(side == Side.SELL) {
                    traderBalances[msg.sender][ticker] -= remaining;
                } else {
                    traderBalances[msg.sender][USDC] -= remaining * price / 1000;
                }
                // @notice Sort orders by best price.
                uint k = orders.length > 0 ? orders.length - 1 : 0;
                while(k > 0) {
                    if(side == Side.BUY && orders[k - 1].price > orders[k].price) {
                        break;
                    }
                    if(side == Side.SELL && orders[k - 1].price < orders[k].price) {
                        break;
                    }
                    Order memory order = orders[k - 1];
                    orders[k - 1] = orders[k];
                    orders[k] = order;
                    k--;
                }
                nextOrderId++;
            }
        }
    }

    // @notice Create instant order for best available price.
    function createMarketOrder(bytes32 ticker, uint amount, Side side) tokenExist(ticker) tokenIsNotUsdc(ticker) external {
        if(side == Side.SELL) {
            // @notice Validate that seller has enough tokens to finalize order.
            require(traderBalances[msg.sender][ticker] >= amount, 'token balance too low');
        }
        Order[] storage orders = orderBook[ticker][uint(side == Side.BUY ? Side.SELL : Side.BUY)];
        uint remaining = amount;
        uint tradesFulfilled = 0;
        uint i = 0;

        while(i < orders.length && remaining > 0) {
            uint available = orders[i].amount - orders[i].filled;
            uint matched = (remaining > available) ? available : remaining;
            remaining -= matched;
            orders[i].filled += matched;
            
            // @notice Execute trade and distribute amounts.
            emit NewTrade(nextTradeId, orders[i].id, ticker, orders[i].trader, msg.sender, matched, orders[i].price, block.timestamp);
            if(side == Side.SELL) {
                traderBalances[msg.sender][ticker] -= matched;
                traderBalances[msg.sender][USDC] += matched * orders[i].price / 1000;
                traderBalances[orders[i].trader][ticker] += matched;
            }
            if(side == Side.BUY) {
                require(traderBalances[msg.sender][USDC] >= matched * orders[i].price / 1000, 'usdc balance too low');
                traderBalances[msg.sender][ticker] += matched;
                traderBalances[msg.sender][USDC] -= matched * orders[i].price / 1000;
                traderBalances[orders[i].trader][USDC] += matched * orders[i].price / 1000;
            }
            if(orders[i].filled == orders[i].amount) {
                tradesFulfilled++;
            }
            nextTradeId++;
            i++;
        }

        // @notice Sort orders by best price.
        if (tradesFulfilled > 0) {
            do {
                for (uint k = 0; k < orders.length; k++) {
                    if(orders[k].filled == orders[k].amount) {
                        for(uint j = k; j < orders.length - 1; j++ ) {
                            orders[j] = orders[j + 1];
                        }
                        orders.pop();
                        tradesFulfilled--;
                    }
                }
            } while (tradesFulfilled > 0);
        }
    }

    // @notice Delete open order.
    function deleteOrder(bytes32 _ticker, Side _side, uint _id) external {
        Order[] storage orders = orderBook[_ticker][uint(_side)];

        for (uint i = 0; i < orders.length; i++) {
            // @notice Validate that function is called by the creator of order.
            if (orders[i].id == _id && orders[i].trader == msg.sender) {
                // @notice Return booked amount to the order creator.
                if(orders[i].side == Side.BUY) {
                    traderBalances[msg.sender][USDC] += orders[i].amount * orders[i].price / 1000;
                } else {
                    traderBalances[msg.sender][_ticker] += orders[i].amount;
                }
                // @notice Remove order from orders array.
                orders[i].amount = 0;
                removeZeroAmountOrder(
                    orders[i].ticker,
                    orders[i].side,
                    i
                );
            }
        }
    }

    // @notice Helper function to remove 0 amount order from the orders array.
    function removeZeroAmountOrder(bytes32 _ticker, Side _side, uint _id) internal {
        if (orderBook[_ticker][uint (_side)][_id].amount == 0) {
            uint lastElement = orderBook[_ticker][uint (_side)].length - 1;
            orderBook[_ticker][uint (_side)][_id] = orderBook[_ticker][uint (_side)][lastElement];
            orderBook[_ticker][uint (_side)].pop();
        }
    }

    /*
    *   Modifiers
    */

    modifier tokenIsNotUsdc(bytes32 ticker) {
        require(ticker != USDC, 'cannot trade USDC');
        _;
    }

    modifier tokenExist(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), 'this token does not exist');
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'only admin');
        _;
    }
}