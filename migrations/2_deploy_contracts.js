const RegistryProxy = artifacts.require("RegistryProxy")

const devRegistryAddress = "0x854cC49b75803206Dd0739AC245DdD1f30e4BEE8"

module.exports = function(deployer, network) {
  switch (network) {
    case "development":
      deployer.deploy(RegistryProxy, devRegistryAddress)
      break
    case "Kovan":
    case "Ropsten":
    case "Rinkeby":
    case "Main":
      // TODO
  }
}
