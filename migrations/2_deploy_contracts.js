const Registry = artifacts.require('TokenReg')
const RegistryProxy = artifacts.require('RegistryProxy')

const RegistryAddresses = {
  development: '0xd1b0801BF6Bb0CF9B3Fd998c69DA7EC8FeB92b9A'
  // other networks: TODO
}

module.exports = function(deployer, network) {
  // TODO: Only deploy TokenReg on DEV network!
  // TODO: Use harcoded registry address for non-dev networks!
  deployer.deploy(Registry).then(function() {
    return deployer.deploy(RegistryProxy, Registry.address);
  });
}
