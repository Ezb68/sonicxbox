# SonicXBox
Simple development framework
**SonicXBox is a fork of [tronbox](https://github.com/TRON-US/tronbox) [code](https://github.com/TRON-US/tronbox/commit/9b219c03b519b868da10e729b3beca40f53d13ab)** 

[SonicXBox Documentation](https://developers.sonicx.network/docs/sonicx-box-user-guide)

## Installation
`npm install sonicxbox`
## OS requirement
- NodeJS 8.0+
- Windows, Linux, or Mac OS X

## Features
Initialize a Customer SonicXBox Project<br>
`npx sonicxbox init`
<br>

Download a dApp, ex: metacoin-box<br>
`npx sonicxbox unbox metacoin`
<br>

Contract Compiler<br>
`npx sonicxbox compile`

<br>
To compile for all contracts, select --compile-all.

Optionally, you can select: <br>
--compile-all: Force compile all contracts. <br>
--network save results to a specific host network<br>
<br>

## Configuration
To use SonicXBox, your dApp has to have a file `sonicxbox.js` in the source root. This special files, tells SonicXBox how to connect to nodes and event server, and passes some special parameters, like the default private key. This is an example of `sonicxbox.js`:
```
module.exports = {
  networks: {
    development: {
// For sonicxtools/quickstart docker image
      privateKey: 'D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C',
      userFeePercentage: 30, // or consume_user_resource_percent
      feeLimit: 100000000, // or fee_limit
      originEnergyLimit: 1e8, // or origin_energy_limit
      callValue: 0, // or call_value
      fullNode: "http://127.0.0.1:8190",
      solidityNode: "http://127.0.0.1:8191",
      eventServer: "http://127.0.0.1:8080",
      fullHost: "http://127.0.0.1:8190",
      network_id: "*"
    },
    mainnet: {
// Don't put your private key here, pass it using an env variable, like:
// PK=D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C npx sonicxbox migrate --network mainnet
      privateKey: process.env.PK,
      userFeePercentage: 30,
      feeLimit: 100000000,
      fullNode: "https://fullnode.sonicxhub.com",
      solidityNode: "https://solnode.sonicxhub.com",
      eventServer: "https://event.sonicxhub.com/",
      fullHost: "https://fullnode.sonicxhub.com",
      network_id: "*"
    }
  }
};
```

## Contract Migration<br>
`npx sonicxbox migrate`
<br>

This command will invoke all migration scripts within the migrations directory. If your previous migration was successful, `sonicxbox migrate` will invoke a newly created migration. If there is no new migration script, this command will have no operational effect. Instead, you can use the option `--reset` to restart the migration script.<br> 

`npx sonicxbox migrate --reset`
<br>

## Parameters by contract (introduced in v2.2.2)

It is very important to set the deploying parameters for any contract. In SonicXBox 2.2.2+ you can do it modifying the file
```
migrations/2_deploy_contracts.js
```
and specifying the parameters you need like in the following example:
```
var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin, 10000, {
    fee_limit: 1.1e8,
    userFeePercentage: 31,
    originEnergyLimit: 1.1e8
  });
};
```

## Start Console<br>
This will use the default network to start a console. It will automatically connect to a TVM client. You can use `--network` to change this. <br>

`npx sonicxbox console`<br>

The console supports the `sonicxbox` command. For example, you can invoke `migrate --reset` in the console. The result is the same as invoking `sonicxbox migrate --reset` in the command. 
<br>

## Extra Features in SonicXBox console:<br>

1. All the compiled contracts can be used, just like in development & test, front-end code, or during script migration. <br>

2. After each command, your contract will be re-loaded. After invoking the `migrate --reset` command, you can immediately use the new address and binary.<br>

3. Every returned command's promise will automatically be logged. There is no need to use `then()`, which simplifies the command.<br>

## Testing<br>

To carry out the test, run the following command:<br>

`npx sonicxbox test`<br>

You can also run the test for a specific file：<br>

`npx sonicxbox test ./path/to/test/file.js`<br>

Testing in SonicXBox is a bit different than in Truffle.
Let's say we want to test the contract Metacoin (from the Metacoin Box that you can download with `sonicxbox unbox metacoin`):

```
contract MetaCoin {
	mapping (address => uint) balances;

	event Transfer(address _from, address _to, uint256 _value);
	event Log(string s);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
```

Now, take a look at the first test in `test/metacoin.js`:
```
var MetaCoin = artifacts.require("./MetaCoin.sol");
contract('MetaCoin', function(accounts) {
  it("should put 10000 MetaCoin in the first account", function() {

    return MetaCoin.deployed().then(function(instance) {
      return instance.call('getBalance',[accounts[0]]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 10000, "10000 wasn't in the first account");
    });
  });
  // ...
```
Starting from version 2.0.5, in SonicXBox artifacts () the following commands are equivalent:
```
instance.call('getBalance', accounts[0]);
instance.getBalance(accounts[0]);
instance.getBalance.call(accounts[0]);
```
and you can pass the `address` and `amount` for the method in both the following ways:
```
instance.sendCoin(address, amount, {from: account[1]});
```
and
```
instance.sendCoin([address, amount], {from: account[1]});
```

## How to contribute

1. Fork this repo.

2. Clone your forked repo recursively, to include submodules, for example:
```
git clone --recurse-submodules -j8 git@github.com:sullof/sonicxbox.git
```
3. If you use nvm for Node, please install Node 8, and install lerna globally:
```
nvm install v8.16.0
nvm use v8.16.0
npm i -g lerna
```
4. Bootstrap the project:
```
lerna bootstrap
```
5. During the development, for better debugging, you can run the unbuilt version of SonicXBox, for example
```
./sonicxbox.dev migrate --reset
```

## Solc versions

SonicXBox does not supports all the Solidity compilers.  
Supported versions:
```
0.4.24
0.4.25
0.5.4
0.5.8
0.5.9
``` 

-----

For more historic data, check the original repo at
[https://github.com/SonicXChain/sonicxbox](https://github.com/SonicXChain/sonicxbox)
