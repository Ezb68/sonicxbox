module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      // privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C

Then, run the migration with:

  source .env && sonicxbox migrate --network mainnet

*/
      userFeePercentage: 100,
      feeLimit: 1e8,
	    fullNode: "https://fullnode.sonicxhub.com",
      solidityNode: "https://solnode.sonicxhub.com",
      eventServer: "https://event.sonicxhub.com/",
	    fullHost: "https://fullnode.sonicxhub.com",
      network_id: "1"
    },
    testnet: {
      privateKey: 'D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C',

      userFeePercentage: 100,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullNode: "https://fullnode-testnet.sonicxhub.com",
      solidityNode: "https://solnode-testnet.sonicxhub.com",
      eventServer: "https://event-testnet.sonicxhub.com",
      fullHost: "https://fullnode-testnet.sonicxhub.com",
      network_id: "2"
    },
  	useZeroFourCompiler: true
  }
}
