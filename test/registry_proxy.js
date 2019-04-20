const RegistryProxy = artifacts.require("RegistryProxy")
const fs = require('fs');
const RegistryABI = JSON.parse(fs.readFileSync('./abis/TokenReg.json', 'utf8'))
const RegistryAddress = '0xd1b0801BF6Bb0CF9B3Fd998c69DA7EC8FeB92b9A'

contract("RegistryProxy", function(accounts) {

    const tokens = [
        {
            id: 0,
            address: '0xadB97926e25E54eC22F3083657C86E60Efa6377f',
            name: 'first',
            tla: "1st",
            decimals: 10,
        },
        {
            id: 1,
            address: '0xa431051FEcc80f1151C2914c8e198C3Ccf25CaD9',
            name: 'second',
            tla: "2nd",
            decimals: 5,
        },
        {
            id: 2,
            address: '0xa8C37b72663620938eB2852cEb1D8eC98B27936E',
            name: 'third',
            tla: "3rd",
            decimals: 0,
        },
        {
            id: 3,
            address: '0xac6a2aaDc9c5C90A347f15A3D33075114895aF55',
            name: 'fourth',
            tla: "4th",
            decimals: 2,
        },
        {
            id: 4,
            address: '0xad3443D38bB72a281821c337259107B56c2A4E2a',
            name: 'fifth',
            tla: "5th",
            decimals: 10,
        },
    ]

    before("Setting up test tokens in registry", async function() {
        let fee = web3.utils.toWei("1", "ether")
        let gas = 300000
        // get instance of registry contract
        const Registry = new web3.eth.Contract(RegistryABI, RegistryAddress)
        /*tokens.forEach(async token => {
            await Registry.methods.register(token.address, token.tla, token.decimals, token.name)
            .send({
                from: accounts[0],
                value: fee,
                gas: gas,
            })
        })*/
    })

    it("has token count of 5", async function() {
        const proxy = await RegistryProxy.deployed()
        let result = await proxy.tokenCount()
        assert.equal(tokens.length, result)
    })
})

