import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
import store from "./store"
import keeper from "pbweb-nftkeeper"
// 全局变量设置
var bsc = {}
const coinDecimals = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}

const coinMap = {
    "XCC": '3',
    "XCH": '1',
    "HDD": "2"
}
//根据币种选择decimals
async function getDecimals(coin) {
    if (coin in coinDecimals) {
        return coinDecimals[coin]
    }
    const decimals = await coinContract(coin).decimals()
    return decimals
}

function coinContract(coin) {
    const wcoin = 'w' + coin.toLowerCase()
    return bsc.ctrs[wcoin]
}
async function ListenToWCoin(commit) {
    let wBalance = {
        XCC: '',
        HDD: '',
        // XCH:""
    }
    var ctr_xcc = coinContract("XCC")
    // var ctr_xch = coinContract("XCH")
    var ctr_hdd = coinContract("HDD")
    const decimals_xcc = await ctr_xcc.decimals()
    // const decimals_xch = await ctr_xch.decimals()
    const decimals_hdd = await ctr_hdd.decimals()

    async function updateXCCBalance(evt) {
        const xccbalance = await ctr_xcc.balanceOf(bsc.addr)
        wBalance.XCC = ethers.utils.formatUnits(xccbalance, decimals_xcc)
        commit('setWBalance', wBalance)
    }
    async function updateHDDBalance(evt) {
        // const xchbalance = await ctr_xch.balanceOf(bsc.addr)
        const hddbalance = await ctr_hdd.balanceOf(bsc.addr)
        // wBalance.xch = ethers.utils.formatUnits(xchbalance, decimals_xch)
        wBalance.HDD = ethers.utils.formatUnits(hddbalance, decimals_hdd)
        commit('setWBalance', wBalance)
    }
    await updateXCCBalance()
    await updateHDDBalance()
    ctr_hdd.on(ctr_hdd.filters.Transfer, updateHDDBalance)
    ctr_xcc.on(ctr_xcc.filters.Transfer, updateXCCBalance)
}
async function connect(commit) {
    bsc = await pbwallet.connect(true)
    if (bsc) {
        store.commit("setBsc", bsc)
        await ListenToWCoin(commit)
        return bsc
    }
    return false
}
const oldTokenAddr = {
    "XCC": "0x1B4bB84f3DCAc9899C41726838CdEC291DB52d25",
    // "XCH": "0xFdF2F0995663a993A16929CeC5c39B039AB18Ef6",
    // "HDD": "0xFfB8F22732e7fC4550a8Cda5DB03cCcCF082b357",
    "HDD": "0xC8877338a418C659cD86A3dd769D66B069bC996A",
}
async function tokenBalance() {
    let oldBalance = {}
    let info = {}
    let ctr = {}
    for (let i in oldTokenAddr) {
        info[i] = await keeper.tokenInfo(oldTokenAddr[i])
        ctr[i] = pbwallet.erc20_contract(oldTokenAddr[i])
        oldBalance[i] = ethers.utils.formatUnits(await ctr[i].balanceOf(bsc.addr), info[i].decimals)
    }
    console.log('token info=', info, "token ctr=", ctr, "token Balance =", oldBalance)
    return oldBalance
}
async function tokenAllowance() {
    const oldAllowance = {}
    for (let i in oldTokenAddr) {
        let ctr = {}
        let allowance = {}
        let decimals = {}
        ctr[i] = pbwallet.erc20_contract(oldTokenAddr[i])
        allowance[i] = await ctr[i].allowance(bsc.addr, bsc.ctrs.tokenredeem.address)
        oldAllowance[i] = ethers.utils.formatUnits(allowance[i], decimals[i])
    }
    console.log("oldAllowance =", oldAllowance)
    return oldAllowance
}
async function tokenApprove(bcoin) {
    const ctr = pbwallet.erc20_contract(oldTokenAddr[bcoin])
    const supply = await ctr.totalSupply()
    cons
    const res = await ctr.approve(bsc.ctrs.tokenredeem.address, supply.mul(1000)) // 1000x total supply, almost infinite
    return res
}
async function tokenRedeem(bcoin, amount) {
    const ctr = pbwallet.erc20_contract(oldTokenAddr[bcoin])
    const decimals = await ctr.decimals()
    amount = ethers.utils.parseUnits(amount, decimals)
    const res = bsc.ctrs.tokenredeem.redeem(oldTokenAddr[bcoin], amount)
    await res
}
async function getmintfee() {
    const options = {}
    const fee = await bsc.ctrs.pbt.mintFee();
    const info = await keeper.tokenInfo(fee[0])
    options.price = ethers.utils.formatUnits(fee[1], info.decimals)
    options.ptName = info.symbol
    console.log("options", options)
    return options
}
async function getMintAbles() {
    const mintAbles = await bsc.ctrs.pbt.mintables()
    console.log("mintAbles", mintAbles)
    return mintAbles
}
async function mintPBT() {
    try {
        const mintfee = await bsc.ctrs.pbt.mintFee()
        console.log("mint fee", mintfee)
        const options = {}
        if (mintfee[0] == ethers.constants.AddressZero) {
            options.value = mintfee[1]
        } else {
            const ctr = pbwallet.erc20_contract(mintfee[0])
            const allow = await ctr.allowance(bsc.addr, bsc.ctrs.pbt.address)
            if (mintfee[1].gt(allow)) {
                const reciept = await ctr.approve(bsc.ctrs.pbt.address, mintfee[1].mul(10000))
                console.log("mint approve", reciept)
            }
        }
        const res = await bsc.ctrs.pbt.mint(options)
        console.log("mint res", res)
        return res
    } catch (e) {
        let text = e.message
        if ('data' in e) {
            if ('message' in e.data) {
                text = e.data.message
            }
        }
        return text
    }
}
async function burnWcoin(amount, coin) {
    const ctr = coinContract(coin)
    const decimals = await getDecimals(coin)
    amount = ethers.utils.parseUnits(amount, decimals)
    const wBalance = ethers.utils.parseUnits(store.state.WBalance[coin], decimals)
    if (amount.gt(wBalance)) {
        return false
    }
    const receipt = await ctr.burn(amount)
    console.log("burncoin receipt", receipt)
    return receipt
}
async function waitEventDone(tx, done) {
    const ctr = pbwallet.erc721_contract(tx.to)
    ctr.on(ctr.filters.Transfer, function (evt) {
        if (evt.transactionHash == tx.hash) {
            done(tx, evt)
            ctr.off(ctr.filters.Transfer)
        }
    })
}

async function tokenSymbol(ctraddr) {
    ctraddr = ethers.utils.getAddress(ctraddr)
    for (var k in ptAddrs) {
        if (ethers.utils.getAddress(ptAddrs[k]) == ctraddr) {
            return k
        }
    }
    const symbol = await pbwallet.erc20_contract(ctraddr).symbol()
    ptAddrs[symbol] = ctraddr
    return symbol
}
const tokenDecimals = {}

async function formatToken(ctraddr, val) {
    ctraddr = ethers.utils.getAddress(ctraddr)
    if (ctraddr == ethers.constants.AddressZero) {
        return ethers.utils.formatUnits(val)
    }
    if (!(ctraddr in tokenDecimals)) {
        tokenDecimals[ctraddr] = await pbwallet.erc20_contract(ctraddr).decimals()
    }
    return ethers.utils.formatUnits(val, tokenDecimals[ctraddr])
}
async function reBindFee() {
    const rebindFee = await bsc.ctrs.pbpuzzlehash.rebindFee()
    const refee = {}
    refee.symbol = await tokenSymbol(rebindFee[0])
    refee.amount = await formatToken(rebindFee[0], rebindFee[1])
    console.log("rebindfee", rebindFee, refee)
    return refee
}
//绑定取款地址
async function bindAddr(waddr, pbtId, cointy, rebind) {
    try {
        if ('ChiaUtils' in window) {
            if (waddr.substr(0, 3) != (store.state.bcoin).toLowerCase()) return false
            const addr = window.ChiaUtils.address_to_puzzle_hash(waddr)
            let res = {}
            if (rebind) {
                const fee = await bsc.ctrs.pbpuzzlehash.rebindFee()
                console.log('fee=', fee)
                if (fee[0] == ethers.constants.AddressZero) { // fee in BNB
                    res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtId, cointy, addr, {
                        value: fee[1]
                    })
                } else { // erc20 token
                    console.log('12')
                    const allow = await checkAllowance(fee[0], fee[1])
                    console.log("checkallow", allow, allow.lt(fee[1]))
                    if (allow.lt(fee[1])) {
                        const res = await approveAllow(fee[0])
                        console.log("res", res)
                        res.fn = 'approve'
                        return res
                    }
                    res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtId, cointy, addr, {
                        value: fee[1]
                    })
                }
            } else {
                res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtId, cointy, addr)
                return res
            }
        }
    } catch (e) {
        console.log("bindaddr errrrr", e.message)
    }
}
async function getBindables(coin) {
    const coinTy = coinMap[coin]
    const ables = await bsc.ctrs.pbpuzzlehash.bindables(coinTy)
    return ables
}
async function getDepAddr(pbtId, coin) {
    const ables = await getBindables(coin)
    if (parseInt(ables) == 0) {
        console.log("ables", ables)
        return false
    } else {
        const id = ethers.BigNumber.from(pbtId)
        const coinType = parseInt(coinMap[coin])
        const res = await bsc.ctrs.pbpuzzlehash.bindDepositPuzzleHash(id, coinType)
        console.log("obtain deposite addr", res)
        return res
    }
}
async function clearAddr(pbtid, cointy) {
    const id = parseInt(pbtid)
    const addr1 = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(id, cointy, addr1)
    return res
}
async function sendToMarket(id) {
    const pb = bsc.ctrs.pbt
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bsc.ctrs.pbmarket.address, id)
    return res
}
async function setSellInfo(id, ptName, price, desc) {
    var ptAddr = ptAddrs[ptName]
    if (!ptAddr) {
        ptAddr = ethers.constants.AddressZero
    }
    const res = await bsc.ctrs.pbmarket.onSale(bsc.ctrs.pbt.address, id, ptAddr, ethers.utils.parseEther(price), desc)
    return res
}
async function checkAllowance(priceToken, price) {
    // token, amount
    // const priceToken = nft.market.priceToken
    // const amount = ethers.utils.parseEther(price)
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    } else {
        try {
            const ctr = pbwallet.erc20_contract(priceToken)
            const allow = await ctr.allowance(bsc.addr, bsc.ctrs.pbmarket.address)
            if (allow.lt(price)) {
                return false
            }
            return allow
        } catch (e) {
            console.log("checkAllowance eee", e.message)
        }
    }
}
async function approveAllow(token) {
    const ctr = pbwallet.erc20_contract(token)
    const amount = await ctr.totalSupply()
    const res = await ctr.approve(bsc.ctrs.pbmarket.address, amount.mul(10))
    res.fn = 'approve'
    return res


}

async function buyNFT(nft) {
    const price = ethers.utils.parseEther(nft.market.price)
    const priceToken = nft.market.priceToken
    const id = ethers.BigNumber.from(nft.id)
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    } else {
        // check allowance
        const allow = await checkAllowance(priceToken, price)
        if (allow.lt(price)) { // not enough allowance, approve first
            const res = await approveAllow(priceToken) // TODO: approve can use MAX_UINT256 for infinity
            res.fn = 'approve'
            // we need to wait for approve confirmed by BSC network, so return and let user buy again
            // TODO: show "Approve" in button when allowance not enough, then show "Buy" when allowance enough
            // TODO: check ERC20 balance then buy
            return res
        }
    }
    const res = await bsc.ctrs.pbmarket.buy(bsc.ctrs.pbt.address, id, options) // TODO: approve can use MAX_UINT256 for infinity
    res.fn = 'buy'
    return res
}
async function retreatNFT(id) {
    const res = await bsc.ctrs.pbmarket.offSale(bsc.ctrs.pbt.address, id)
    return res
}
async function afterFee(coin, mode, amount) {
    const fees = await getfees(coin)
    const nowfee = {}
    const decimals = await getDecimals(coin)
    amount = ethers.utils.parseUnits(amount.toString(), decimals)
    if (mode == 'deposite') {
        nowfee.min = ethers.utils.parseUnits(fees.depositeFee, decimals)
        nowfee.rate = fees.depositeFeeRate
    } else if (mode == 'withdraw') {
        nowfee.min = ethers.utils.parseUnits(fees.withdrawFee, decimals)
        nowfee.rate = fees.withdrawFeeRate
        console.log("after fee", nowfee)
        if (amount.gt(ethers.utils.parseUnits(store.state.WBalance[coin], decimals))) {
            return "fund"
        }
    } else {
        return "mode"
    }
    var fee = amount.mul(nowfee.rate).div(10000)
    if (fee.lt(nowfee.min)) {
        fee = nowfee.min
    }
    if (amount.lte(fee)) {
        return false
    }
    return ethers.utils.formatUnits(amount.sub(fee), decimals)
}
async function getfees(coin) {
    const decimals = await getDecimals(coin)
    const ctr = coinContract(coin)
    const depfee = await ctr.getDepositFee()
    const wdfee = await ctr.getWithdrawFee()
    const fee = {}
    fee.depositeFee = ethers.utils.formatUnits(depfee[1], decimals)
    fee.depositeFeeRate = depfee[0]
    fee.withdrawFee = ethers.utils.formatUnits(wdfee[1], decimals)
    fee.withdrawFeeRate = wdfee[0]
    console.log("getfees", fee)
    return fee

}
async function getLimit(coin) {
    const ctr = coinContract(coin)
    let amount = await ctr.getCWAmount()
    const decimals = await getDecimals(coin)
    const amountMax = ethers.utils.formatUnits(amount[1], decimals)
    const amountMin = ethers.utils.formatUnits(amount[0], decimals)
    amount = [amountMin, amountMax]
    return amount
}
async function watchToken(coin) {
    const ctr = coinContract(coin)
    if (!bsc.provider) return false
    var img_name = 'w' + coin.toLowerCase() + '-logo.svg'
    const options = {
        address: ctr.address,
        symbol: "w" + coin,
        decimals: await ctr.decimals(),
        image: "https://www.plotbridge.net/img/" + img_name,
    }
    const added = await bsc.provider.send(
        'wallet_watchAsset', {
            type: 'ERC20',
            options: options
        }
    )
    return added
}
export default {
    connect: connect,
    checkAllowance: checkAllowance,
    approveAllow: approveAllow,
    afterFee: afterFee,
    watchToken: watchToken,
    burnWcoin: burnWcoin,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
    mintPBT: mintPBT,
    getMintAbles: getMintAbles,
    bindAddr: bindAddr,
    getDepAddr: getDepAddr,
    getBindables: getBindables,
    clearAddr: clearAddr,
    reBindFee: reBindFee,
    waitEventDone: waitEventDone,
    retreatNFT: retreatNFT,
    buyNFT: buyNFT,
    setSellInfo: setSellInfo,
    sendToMarket: sendToMarket,
    getLimit: getLimit,
    getfees: getfees,
    getmintfee: getmintfee,
}