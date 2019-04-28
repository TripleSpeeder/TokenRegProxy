const Registry = artifacts.require("TokenReg")
const RegistryProxy = artifacts.require("RegistryProxy")
const truffleAssert = require('truffle-assertions');

contract("RegistryProxy with empty registry", function(accounts) {

    let registry
    let proxy

    before("Getting contract instances", async function() {
        registry = await Registry.deployed()
        proxy = await RegistryProxy.deployed()
    })

    it("has correct tokenCount", async function() {
        let tokenCount = await proxy.tokenCount()
        assert.strictEqual(tokenCount.toNumber(), 0)
    })

    it("returns 0-length array of token structs using allTokensAsStructs()", async function() {
        const allTokens = await proxy.allTokensAsStructs()
        assert.lengthOf(allTokens, 0)
    })

    it("returns 0-length arrays using allTokensAsArrays()", async function() {
        const result = await proxy.allTokensAsArrays()
        assert.lengthOf(result.ids, 0, "Ids length does not match")
        assert.lengthOf(result.addresses, 0, "Addresses length does not match")
        assert.lengthOf(result.tlas, 0, "Tlas length does not match")
        assert.lengthOf(result.bases, 0, "Bases length does not match")
        assert.lengthOf(result.names, 0, "Names length does not match")
        assert.lengthOf(result.owners, 0, "Owners length does not match")
    })

    it("Can't get token by id", async function() {
        const id=0
        await truffleAssert.reverts(proxy.getToken(id));
    })
})
