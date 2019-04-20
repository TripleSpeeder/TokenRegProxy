const Registry = artifacts.request("Registry")
const RegistryProxy = artifacts.require("RegistryProxy")

module.exports = async function(deployer, network) {
  switch (network) {
    case "development":
      // For local dev deploy both Registry and Registryproxy
      const Registry = await deployer.deploy(Registry)
      deployer.deploy(RegistryProxy, Registry.address)
      break
    case "Kovan":
      // TODO: Find token registry address
      deployer.deploy(RegistryProxy, "0xFindMe")
    case "Ropsten":
      // TODO: Find token registry address
      deployer.deploy(RegistryProxy, "0xFindMe")
    case "Rinkeby":
      // TODO: Find token registry address
      deployer.deploy(RegistryProxy, "0xFindMe")
    case "Main":
      // TODO: Find token registry address
      deployer.deploy(RegistryProxy, "0xFindMe")
  }
}
