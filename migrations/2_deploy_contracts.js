const RegistryProxy = artifacts.require('RegistryProxy')

const RegistryAddresses = {
  development: '0xd1b0801BF6Bb0CF9B3Fd998c69DA7EC8FeB92b9A'
  // other networks: TODO
}

module.exports = async function(deployer, network) {
  deployer.deploy(RegistryProxy, RegistryAddresses[network])
}
