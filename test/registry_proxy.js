const Registry = artifacts.require("TokenReg")
const RegistryProxy = artifacts.require("RegistryProxy")
const truffleAssert = require('truffle-assertions');

contract("RegistryProxy", function(accounts) {

    let registry
    let proxy

    const tokens = [
        {
            id: 0,
            addr: '0xadB97926e25E54eC22F3083657C86E60Efa6377f',
            name: 'first',
            tla: "1st",
            base: 10,
        },
        {
            id: 1,
            addr: '0xa431051FEcc80f1151C2914c8e198C3Ccf25CaD9',
            name: 'second',
            tla: "2nd",
            base: 5,
        },
        {
            id: 2,
            addr: '0xa8C37b72663620938eB2852cEb1D8eC98B27936E',
            name: 'third',
            tla: "3rd",
            base: 0,
        },
        {
            id: 3,
            addr: '0xac6a2aaDc9c5C90A347f15A3D33075114895aF55',
            name: 'fourth',
            tla: "4th",
            base: 2,
        },
        {
            id: 4,
            addr: '0xad3443D38bB72a281821c337259107B56c2A4E2a',
            name: 'fifth',
            tla: "5th",
            base: 10,
        },
    ]

    before("Getting contract instances", async function() {
        registry = await Registry.deployed()
        proxy = await RegistryProxy.deployed()
    })

    before("Setting up test tokens in registry", async function() {
        // TODO: Only do this when testing on local DEV network!
        let fee = web3.utils.toWei("1", "ether")
        let gas = 300000
        tokens.forEach(async token => {
            await registry.register(
                token.addr,
                token.tla,
                token.base,
                token.name,
                {
                    from: accounts[0],
                    value: fee,
                    gas: gas,
                }
            )
        })
    })

    it("has correct tokenCount", async function() {
        let tokenCount = await proxy.tokenCount()
        assert.strictEqual(tokenCount.toNumber(), tokens.length)
    })

    it("can get all tokens in batch mode using allTokensAsStructs()", async function() {
        const allTokens = await proxy.allTokensAsStructs()
        assert.lengthOf(allTokens, tokens.length, "Length does not match")
        for (let i=0; i<tokens.length; i++) {
            assert.containsAllKeys(allTokens[i], ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            assert.strictEqual(parseInt(allTokens[i].id), tokens[i].id, "id does not match")
            assert.strictEqual(allTokens[i].name, tokens[i].name, "name does not match")
            assert.strictEqual(allTokens[i].addr, tokens[i].addr, "address does not match")
            assert.strictEqual(allTokens[i].tla, tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(allTokens[i].base), tokens[i].base, "base does not match")
            assert.strictEqual(allTokens[i].owner, accounts[0], "owner does not match")
        }
    })

    it("can get all tokens in batch mode using allTokensAsArrays()", async function() {
        // var [ids, addresses, tlas, bases, names, owners] = await proxy.allTokensAsArrays()
        const result = await proxy.allTokensAsArrays()
        assert.lengthOf(result.ids, tokens.length, "Ids length does not match")
        assert.lengthOf(result.addresses, tokens.length, "Addresses length does not match")
        assert.lengthOf(result.tlas, tokens.length, "Tlas length does not match")
        assert.lengthOf(result.bases, tokens.length, "Bases length does not match")
        assert.lengthOf(result.names, tokens.length, "Names length does not match")
        assert.lengthOf(result.owners, tokens.length, "Owners length does not match")
        for (let i=0; i<tokens.length; i++) {
            assert.strictEqual(parseInt(result.ids[i]), tokens[i].id, "id does not match")
            assert.strictEqual(result.names[i], tokens[i].name, "name does not match")
            assert.strictEqual(result.addresses[i], tokens[i].addr, "address does not match")
            assert.strictEqual(result.tlas[i], tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(result.bases[i]), tokens[i].base, "base does not match")
            assert.strictEqual(result.owners[i], accounts[0], "owner does not match")
        }
    })

    it("can get all tokens one by one by id", async function() {
        let tokenCount = await proxy.tokenCount()
        for (let i=0; i<tokenCount.toNumber(); i++) {
            const token = await proxy.getToken(i);
            assert.containsAllKeys(token, ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            assert.strictEqual(parseInt(token.id), tokens[i].id, "id does not match")
            assert.strictEqual(token.name, tokens[i].name, "name does not match")
            assert.strictEqual(token.addr, tokens[i].addr, "address does not match")
            assert.strictEqual(token.tla, tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(token.base), tokens[i].base, "base does not match")
            assert.strictEqual(token.owner, accounts[0], "owner does not match")
        }
    })

    it("can get all tokens one by one by address", async function() {
        let tokenCount = await proxy.tokenCount()
        assert.lengthOf(tokens, tokenCount.toNumber())
        for (let i=0; i<tokenCount.toNumber(); i++) {
            const token = await proxy.fromAddress(tokens[i].addr);
            assert.containsAllKeys(token, ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            assert.strictEqual(parseInt(token.id), tokens[i].id, "id does not match")
            assert.strictEqual(token.name, tokens[i].name, "name does not match")
            assert.strictEqual(token.addr, tokens[i].addr, "address does not match")
            assert.strictEqual(token.tla, tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(token.base), tokens[i].base, "base does not match")
            assert.strictEqual(token.owner, accounts[0], "owner does not match")
        }
    })

    it("can get all tokens one by one by TLA", async function() {
        let tokenCount = await proxy.tokenCount()
        assert.lengthOf(tokens, tokenCount.toNumber())
        for (let i=0; i<tokenCount.toNumber(); i++) {
            const token = await proxy.fromTLA(tokens[i].tla);
            assert.containsAllKeys(token, ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            assert.strictEqual(parseInt(token.id), tokens[i].id, "id does not match")
            assert.strictEqual(token.name, tokens[i].name, "name does not match")
            assert.strictEqual(token.addr, tokens[i].addr, "address does not match")
            assert.strictEqual(token.tla, tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(token.base), tokens[i].base, "base does not match")
            assert.strictEqual(token.owner, accounts[0], "owner does not match")
        }
    })

    it("reduces tokencount when unregistering", async function() {
        const id=1  // unregister second token
        let gas = 300000
        await registry.unregister(
            id,
            {
                from: accounts[0],
                gas: gas,
            })
        const newCount = await proxy.tokenCount()
        assert.strictEqual(newCount.toNumber(),tokens.length-1)
    })

    it("Can't get unregistered token by id", async function() {
        const id=1 // has been unregistered before
        await truffleAssert.reverts(proxy.getToken(id));
    })

    it("Can't get unregistered token by address", async function() {
        const id=1 // has been unregistered before
        // TODO: Extend truffleAssert with error type "invalid address"
        await truffleAssert.fails(proxy.fromAddress(tokens[id].addr));
    })

    it("Can't get unregistered token by TLA", async function() {
        const id=1 // has been unregistered before
        await truffleAssert.reverts(proxy.fromTLA(tokens[id].tla));
    })

    it("Still can get remaining tokens in batch mode", async function() {
        const allTokens = await proxy.allTokensAsStructs()
        assert.lengthOf(allTokens, tokens.length-1, "Length does not match")
        for (let i=0; i<allTokens.length; i++) {
            assert.containsAllKeys(allTokens[i], ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            const id = allTokens[i].id
            assert.strictEqual(allTokens[i].name, tokens[id].name, "name does not match")
            assert.strictEqual(allTokens[i].addr, tokens[id].addr, "address does not match")
            assert.strictEqual(allTokens[i].tla, tokens[id].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(allTokens[i].base), tokens[id].base, "base does not match")
            assert.strictEqual(allTokens[i].owner, accounts[0], "owner does not match")
        }
    })

    it("Still can get remaining tokens one by one", async function() {
        // Check all IDs except 1, which has been unregistered before
        [0,2,3,4,5].forEach(async i => {
            const token = await proxy.getToken(i);
            assert.containsAllKeys(token, ['id', 'name', 'addr', 'tla', 'base', 'owner'])
            assert.strictEqual(token.id, tokens[i].id, "id does not match")
            assert.strictEqual(token.name, tokens[i].name, "name does not match")
            assert.strictEqual(token.addr, tokens[i].addr, "address does not match")
            assert.strictEqual(token.tla, tokens[i].tla, "tla does not match")
            // TODO: Doublecheck why base is a string and not a BN?
            assert.strictEqual(parseInt(token.base), tokens[i].base, "base does not match")
            assert.strictEqual(token.owner, accounts[0], "owner does not match")
        })
    })

})

