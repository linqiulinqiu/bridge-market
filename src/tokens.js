const pbw = require('pbwallet')
const ethers = require('ethers')
const lp_abi = require('./lp-abi.json')
const tokenInfoList = {}

tokenInfoList[ethers.constants.AddressZero] = {
    symbol: "BNB",
    decimals: 18,
    ctr: {
        address: ethers.constants.AddressZero
    }
}
// TODO: add ERC20 event listening, then we can keep token balance always updated without reload frequently

let bsc = {}

async function tokenInfo(ctraddr) {
    if (ctraddr == "") {
        ctraddr = ethers.constants.AddressZero
    }
    if (typeof (ctraddr) == 'object' && 'address' in ctraddr) {
        ctraddr = ctraddr.address
    }
    ctraddr = ethers.utils.getAddress(ctraddr)
    if (!(ctraddr in tokenInfoList)) {
        console.log('create erc20 for', ctraddr)
        const ctr = pbw.erc20_contract(ctraddr)
        let info = {
            symbol: "invalid",
            decimals: -1
        }
        try {
            info.symbol = await ctr.symbol()
            if(info.symbol=='Cake-LP'){
                info.symbol = await lpSymbol(ctraddr)
            }
            info.decimals = await ctr.decimals()
            info.ctr = ctr
            tokenInfoList[ctraddr] = info
        } catch (e) {
            console.log("read ctr", ctraddr, "err,maybe not ERC20")
            console.log('exception', e)
        }
    }
    return tokenInfoList[ctraddr]
}

async function lpSymbol(ctraddr){
    const ctr = new ethers.Contract(ctraddr, lp_abi, bsc.signer)
    const s0 = await tokenSymbol(await ctr.token0())
    const s1 = await tokenSymbol(await ctr.token1())
    return `Cake-LP(${s0} - ${s1})`
}

async function tokenSymbol(ctraddr) {
    const info = await tokenInfo(ctraddr)
    console.log('tokenSymbol', ctraddr, info.symbol)
    return info.symbol
}

async function formatToken(ctraddr, val) {
    const info = await tokenInfo(ctraddr)
    return ethers.utils.formatUnits(val, await info.decimals)
}

async function parseToken(ctraddr, val) {
    if (!val) {
        val = 0
    }
    if (typeof (val) != 'string') {
        val = val.toString()
    }
    const info = await tokenInfo(ctraddr)
    return ethers.utils.parseUnits(val, info.decimals)
}

async function balance(ctraddr, owner) {
    const info = await tokenInfo(ctraddr)
    if (!owner) {
        owner = bsc.addr
    }
    if (info.ctr.address == ethers.constants.AddressZero) {
        return await bsc.provider.getBalance(owner)
    }
    return await info.ctr.balanceOf(owner)
}

async function allowance(ctraddr, spender) {
    const info = await tokenInfo(ctraddr)
    if (info.ctr.address == ethers.constants.AddressZero) {
        return ethers.constants.MaxUint256
    }
    return await info.ctr.allowance(bsc.addr, spender)
}

async function supply(ctraddr){
    const info = await tokenInfo(ctraddr)
    if (info.ctr.address == ethers.constants.AddressZero) {
        return ethers.constants.MaxUint256
    }
    return await info.ctr.totalSupply()
}

async function approve(ctraddr, spender) {
    const info = await tokenInfo(ctraddr)
    if (info.ctr.address != ethers.constants.AddressZero) {
        const receipt = await info.ctr.approve(spender, await info.ctr.totalSupply())
        console.log('approve receipt', receipt)
        if ('hash' in receipt) {
            await bsc.provider.waitForTransaction(receipt.hash)
            return true
        }
        return false
    }
    return true
}

function setbsc(b) {
    bsc = b
}

exports.allowance = allowance
exports.approve = approve
exports.balance = balance
exports.format = formatToken
exports.parse = parseToken
exports.setbsc = setbsc
exports.symbol = tokenSymbol
exports.supply = supply
