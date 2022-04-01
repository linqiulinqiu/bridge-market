import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
import store from "./store"
import keeper from "pbweb-nftkeeper"
// 全局变量设置
var bsc = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}

function coinContract(coin) {
    const wcoin = 'w' + coin.toLowerCase()
    return bsc.ctrs[wcoin]
}
async function ListenToWCoin(commit) {
    let wBalance = {
        XCC: '',
        HDD: '',
        XCH: ""
    }
    var ctr_xcc = coinContract("XCC")
    var ctr_xch = coinContract("XCH")
    var ctr_hdd = coinContract("HDD")

    async function updateXCCBalance(evt) {
        const xccbalance = await ctr_xcc.balanceOf(bsc.addr)
        wBalance.XCC = await keeper.formatToken(ctr_xcc.address, xccbalance)
        commit('setWBalance', wBalance)
    }
    async function updateHDDBalance(evt) {
        const hddbalance = await ctr_hdd.balanceOf(bsc.addr)
        wBalance.HDD = await keeper.formatToken(ctr_hdd.address, hddbalance)
        commit('setWBalance', wBalance)
    }
    async function updateXCHBalance(evt) {
        const xchbalance = await ctr_xch.balanceOf(bsc.addr)
        wBalance.XCH = await keeper.formatToken(ctr_xch.address, xchbalance)
        commit('setWBalance', wBalance)
    }
    await updateXCCBalance()
    await updateHDDBalance()
    await updateXCHBalance()
    ctr_hdd.on(ctr_hdd.filters.Transfer, updateHDDBalance)
    ctr_xcc.on(ctr_xcc.filters.Transfer, updateXCCBalance)
    ctr_xch.on(ctr_xch.filters.Transfer, updateXCHBalance)
}

const oldTokenCtrs = {}

async function listenRedeemEvt(commit) {
    //TODO: redeem list may change in a very low frequency
    const tlists = await bsc.ctrs.tokenredeem.getRedeemList()
    for (let i in tlists[0]) {
        const info = pbwallet.wcoin_info(tlists[0][i], 'address')
        if (info) {
            const symbol = info.symbol
            oldTokenCtrs[symbol] = pbwallet.erc20_contract(tlists[0][i])
            oldTokenCtrs[symbol].on(oldTokenCtrs[symbol].filters.Transfer, updateOldBalance)
            console.log('redeem-evt', symbol, oldTokenCtrs[symbol].address)
        }
    }
    async function updateOldBalance(evt) {
        let oldBalance = {}
        for (let i in oldTokenCtrs) {
            oldBalance[i] = await keeper.formatToken(oldTokenCtrs[i].address, await oldTokenCtrs[i].balanceOf(bsc.addr))
        }
        commit("setRedeemBalance", oldBalance)
        console.log("updateOldBalance", evt, oldBalance)
    }
    await updateOldBalance()
}

async function connect(commit) {
    bsc = await pbwallet.connect(true)
    if (bsc) {
        console.log(bsc)
        store.commit("setBsc", bsc)
        await ListenToWCoin(commit)
        await listenRedeemEvt(commit)
        return bsc
    }
    return false
}

async function tokenAllowance() {
    const oldAllowance = {}
    for (let symbol in oldTokenCtrs) {
        let allowance = {}
        allowance[symbol] = await oldTokenCtrs[symbol].allowance(bsc.addr, bsc.ctrs.tokenredeem.address)
        oldAllowance[symbol] = await keeper.formatToken(oldTokenCtrs[symbol].address, allowance[symbol])
    }
    console.log("oldAllowance =", oldAllowance)
    return oldAllowance
}

async function tokenApprove(bcoin, commit) {
    const ctr = oldTokenCtrs[bcoin]
    const supply = await ctr.totalSupply()
    const res = await ctr.approve(bsc.ctrs.tokenredeem.address, supply) // 1000x total supply, almost infinite
    waitEventDone(res, async function () {
        const newAllowance = await tokenAllowance()
        commit("setRedeemAllowance", newAllowance)
    })
    return res
}

async function tokenRedeem(bcoin, amount) {
    const ctr = oldTokenCtrs[bcoin]
    amount = await keeper.parseToken(ctr.address, amount)
    const res = await bsc.ctrs.tokenredeem.redeem(ctr.address, amount)
    console.log("redeem res", res.hash)
    return res
}
async function getmintfee() {
    const options = {}
    const fee = await bsc.ctrs.pbt.mintFee();
    const symbol = await keeper.tokenSymbol(fee[0])
    options.price = await keeper.formatToken(fee[0], fee[1])
    options.ptName = symbol
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
    amount = await keeper.parseToken(ctr.address, amount)
    const wBalance = await keeper.parseToken(ctr.address, store.state.WBalance[coin])
    if (amount.gt(wBalance)) {
        return false
    }
    const receipt = await ctr.burn(amount)
    console.log("burncoin receipt", receipt)
    return receipt
}
async function waitEventDone(tx, done) {
    bsc.provider.once(tx.hash, function (evt) {
        console.log("evt", evt, evt.transactionHash)
        done(tx, evt)
    })
}
async function reBindFee() {
    const rebindFee = await bsc.ctrs.pbpuzzlehash.rebindFee()
    const refee = {}
    refee.symbol = await keeper.tokenSymbol(rebindFee[0])
    refee.amount = await keeper.formatToken(rebindFee[0], rebindFee[1])
    console.log("rebindfee", rebindFee, refee)
    return refee
}
async function bindAddr(waddr, pbtId, cointy, rebind) {
    const pbtid = ethers.BigNumber.from(pbtId)
    const prefix = pbwallet.wcoin_info(cointy).prefix
    try {
        if ('ChiaUtils' in window) {
            if (waddr.substr(0, 3) != prefix) return false
            const addr = window.ChiaUtils.address_to_puzzle_hash(waddr)
            let res = {}
            if (rebind) {
                const fee = await bsc.ctrs.pbpuzzlehash.rebindFee()
                if (fee[0] == ethers.constants.AddressZero) { // fee in BNB
                    res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, addr, {
                        value: fee[1]
                    })
                } else { // erc20 token
                    const allow = await checkAllowance(fee[0], bsc.ctrs.pbpuzzlehash.address)
                    console.log("checkAllowance", allow, allow.lt(fee[1]))
                    if (allow.lt(fee[1])) {
                        const res = await approveAllow(fee[0], bsc.ctrs.pbpuzzlehash.address)
                        console.log("approveAllowance", res)
                        res.fn = 'approve'
                        await waitEventDone(res, async function (evt) {
                            console.log("approveAllowance evt done,evt=", evt)
                            const bind = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, addr)
                            console.log("rebind addr ", bind)
                            return bind
                        })
                        // return res
                    }
                    res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, addr, {
                        value: fee[1]
                    })
                    return res
                }
            } else {
                console.log('withdraw-bind', pbtId, cointy, addr);
                res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, addr)
                return res
            }
        }
    } catch (e) {
        console.log("bindaddr errrrr", e.message)
    }
}
async function getBindables(cointy) {
    const ables = await bsc.ctrs.pbpuzzlehash.bindables(cointy)
    return ables
}
async function getDepAddr(pbtId, cointy) {
    const ables = await getBindables(cointy)
    if (parseInt(ables) == 0) {
        console.log("ables", ables)
        return false
    } else {
        const id = ethers.BigNumber.from(pbtId)
        const res = await bsc.ctrs.pbpuzzlehash.bindDepositPuzzleHash(id, cointy)
        console.log("obtain  addr", res)
        return res
    }
}
async function clearAddr(pbtid, cointy) {
    const fee = await bsc.ctrs.pbpuzzlehash.rebindFee()
    let res = {}
    if (fee[0] == ethers.constants.AddressZero) { // fee in BNB
        res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, fee[0], {
            value: fee[1]
        })
    } else { // erc20 token
        const allow = await checkAllowance(fee[0], bsc.ctrs.pbpuzzlehash.address)
        console.log("checkAllowance", allow, allow.lt(fee[1]))
        if (allow.lt(fee[1])) {
            const approveRes = await approveAllow(fee[0], bsc.ctrs.pbpuzzlehash.address)
            console.log("approveAllowance", approveRes)
            approveRes.fn = 'approve'
            await waitEventDone(approveRes, async function (evt) {
                console.log("approveAllowance evt done,evt=", evt)
                const bind = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, ethers.constants.AddressZero)
                console.log("rebind addr ", bind)
                return bind
            })
            // return approveRes
        }
        res = await bsc.ctrs.pbpuzzlehash.bindWithdrawPuzzleHash(pbtid, cointy, addrZero, {
            value: fee[1]
        })
    }
    return res
}
async function sendToMarket(id) {
    const pb = bsc.ctrs.pbt
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bsc.ctrs.pbmarket.address, id)
    return res
}
async function setSellInfo(id, ptName, price, desc) {
    let ptAddr = ptAddrs[ptName]
    if (!ptAddr) {
        ptAddr = ethers.constants.AddressZero
    }
    const nftPrice = await keeper.parseToken(ptAddr, price)
    const res = await bsc.ctrs.pbmarket.onSale(bsc.ctrs.pbt.address, id, ptAddr, nftPrice, desc)
    return res
}
async function checkAllowance(priceToken, spender) {
    const ctr = pbwallet.erc20_contract(priceToken)
    const amount = await ctr.totalSupply()
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = amount
    } else {
        try {
            const allow = await ctr.allowance(bsc.addr, spender)
            console.log("checkAllowance", allow, allow.lt(amount))
            if (allow.gt(amount)) {
                return false
            }
            return allow
        } catch (e) {
            console.log("checkAllowance eee", e.message)
        }
    }
}
async function approveAllow(token, spender) {
    const ctr = pbwallet.erc20_contract(token)
    const amount = await ctr.totalSupply()
    const total = await keeper.formatToken(token, amount)
    console.log("totalsupply", total)
    const res = await ctr.approve(spender, amount)
    res.fn = 'approve'
    return res
}
async function buyNFT(nft) {
    const priceToken = nft.market.priceToken
    const price = await keeper.parseToken(priceToken, nft.market.price)
    const id = ethers.BigNumber.from(nft.id)
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    } else {
        // check allowance
        const allow = await checkAllowance(priceToken, bsc.ctrs.pbpuzzlehash.address)
        if (allow.lt(price)) { // not enough allowance, approve first
            const res = await approveAllow(priceToken, bsc.ctrs.pbmarket.address) // TODO: approve can use MAX_UINT256 for infinity
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
    const ctr = coinContract(coin)
    const fees = await getfees(coin)
    const nowfee = {}
    amount = await keeper.parseToken(ctr.address, amount)
    if (mode == 'deposit') {
        nowfee.min = await keeper.parseToken(ctr.address, fees.depositFee)
        nowfee.rate = fees.depositFeeRate
    } else if (mode == 'withdraw') {
        nowfee.min = await keeper.parseToken(ctr.address, fees.withdrawFee)
        nowfee.rate = fees.withdrawFeeRate
        console.log("after fee", nowfee)
        if (amount.gt(await keeper.parseToken(ctr.address, store.state.WBalance[coin]))) {
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
    return await keeper.formatToken(ctr.address, amount.sub(fee))
}
async function getfees(coin) {
    const ctr = coinContract(coin)
    let fee = {}
    const depfee = await ctr.depositFee()
    const wdfee = await ctr.withdrawFee()
    console.log("fee", depfee, wdfee)
    fee.depositFee = await keeper.formatToken(ctr.address, depfee[1])
    fee.depositFeeRate = depfee[0]
    fee.withdrawFee = await keeper.formatToken(ctr.address, wdfee[1])
    fee.withdrawFeeRate = wdfee[0]
    console.log("getfees", fee)
    return fee

}
async function getLimit(coin) {
    const ctr = coinContract(coin)
    let amount = await ctr.cWAmount()
    const amountMax = await keeper.formatToken(ctr.address, amount[1])
    const amountMin = await keeper.formatToken(ctr.address, amount[0])
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
async function burnNFT(id) {
    const pbtId = ethers.BigNumber.from(id)
    const res = await bsc.ctrs.pbt.burn(pbtId)
    return res
}
export default {
    connect: connect,
    checkAllowance: checkAllowance,
    approveAllow: approveAllow,
    afterFee: afterFee,
    burnNFT: burnNFT,
    watchToken: watchToken,
    burnWcoin: burnWcoin,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
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