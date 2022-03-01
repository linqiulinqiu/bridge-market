import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
import allData from './getAllData'
import store from "./store"

// 全局变量设置
var bsc = {}
// var bsc = store.state.bsc
console.log("bsc111", bsc)
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
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
        // xch:""
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
        console.log('wbalance', wBalance)
        commit('setWBalance', wBalance)
    }
    async function updateHDDBalance(evt) {
        // const xchbalance = await ctr_xch.balanceOf(bsc.addr)
        const hddbalance = await ctr_hdd.balanceOf(bsc.addr)
        // wBalance.xch = ethers.utils.formatUnits(xchbalance, decimals_xch)
        wBalance.HDD = ethers.utils.formatUnits(hddbalance, decimals_hdd)
        console.log('wbalance', wBalance)
        commit('setWBalance', wBalance)
    }
    await updateXCCBalance()
    await updateHDDBalance()
    ctr_hdd.on(ctr_hdd.filters.Transfer, updateHDDBalance)
    ctr_xcc.on(ctr_xcc.filters.Transfer, updateXCCBalance)
}
// 链接钱包
async function connect(commit) {
    bsc = await pbwallet.connect(true)
    if (bsc) {
        store.commit("setBsc", bsc)
        await ListenToWCoin(commit)
        console.log("bsc111", bsc)
        return bsc
    }
    return false
}

//获取绑定的pbx类型
async function getCoinTypes(pbxid) {
    const cointype = await bsc.ctrs.pbx.getCoinTypes([pbxid])
    return cointype
}

function priceName(token) {
    token = ethers.utils.getAddress(token)
    for (var k in ptAddrs) {
        if (ethers.utils.getAddress(ptAddrs[k]) == token) {
            return k
        }
    }
    return false
}

function coin2pb(coin) {
    if (coin == 'PBT') return bsc.ctrs.pbt
    if (coin == 'PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:' + coin)
}
async function tokenBalance(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const balance = await ctr.balanceOf(bsc.addr)
    const decimals = await ctr.decimals()
    return ethers.utils.formatUnits(balance, decimals)
}
async function tokenAllowance(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const allowance = await ctr.allowance(bsc.addr, bsc.ctrs.tokenredeem.address)
    const decimals = await ctr.decimals()
    console.log('token allowance', tokenAddr, allowance)
    return ethers.utils.formatUnits(allowance, decimals)
}
async function tokenApprove(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const supply = await ctr.totalSupply()
    await ctr.approve(bsc.ctrs.tokenredeem.address, supply.mul(1000)) // 1000x total supply, almost infinite
}
async function tokenRedeem(tokenAddr, amount) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const decimals = await ctr.decimals()
    amount = ethers.utils.parseUnits(amount, decimals)
    await bsc.ctrs.tokenredeem.redeem(tokenAddr, amount)
}
async function bindTX(pbx_id, pbt) {
    const pbtId = ethers.utils.hexZeroPad(ethers.utils.hexValue(ethers.BigNumber.from(pbt.id)), 32)
    try {
        const res = await bsc.ctrs.pbx["safeTransferFrom(address,address,uint256,bytes)"](bsc.addr, bsc.ctrs.pbconnect.address, pbx_id, pbtId)
        console.log('bindTX receive', res)
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
async function getmintfee() {
    const options = {}
    const fee = await bsc.ctrs.pbt.mintFee();
    if (fee[0] == ethers.constants.AddressZero) {
        options.price = ethers.utils.formatUnits(fee[1])
        options.ptName = "BNB"
    } else if (fee[0] == ptAddrs.BUSD) {
        options.price = ethers.utils.formatUnits(fee[1])
        options.ptName = "BUSD"
    }
    console.log("options", options)
    return options
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
            console.log(" approve statrt", mintfee[1].gt(allow))
            if (mintfee[1].gt(allow)) {
                const reciept = await ctr.approve(bsc.ctrs.pbt.address, mintfee[1].mul(10000))
                console.log("mint approve", reciept)
            }
        }
        const res = await bsc.ctrs.pbt.mint(options)

        console.log("mint res", res)
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
//TODO: this can be a more versatile function, supports multiple wcoins
async function burnWcoin(amount, coin) {
    const ctr = coinContract(coin)
    const decimals = await getDecimals(coin)
    amount = ethers.utils.parseUnits(amount, decimals)
    console.log("amount burn", amount, ethers.utils.formatUnits(amount, decimals))
    const wBalance = ethers.utils.parseUnits(store.state.WBalance[coin], decimals)
    if (amount.gt(wBalance)) {
        return false
    }
    const receipt = await ctr.burn(amount)
    console.log("receipt", receipt)
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
// 解除绑定
async function unbind(pbx) {
    const pbconnect = bsc.ctrs.pbconnect
    try {
        const pbxid = parseInt(pbx.id)
        const res = await pbconnect.retreat(pbxid)
        return res
    } catch (e) {
        console.log("onbound error", e.message)
    }
}
//绑定取款地址
async function bindAddr(waddr, pbxId) {
    try {
        if ('ChiaUtils' in window) {
            if (waddr.substr(0, 3) != (store.state.bcoin).toLowerCase()) return false
            console.log("this.xaddr", store.state.bcoin)
            const addr = window.ChiaUtils.address_to_puzzle_hash(waddr)
            const id = parseInt(pbxId)
            const res = await bsc.ctrs.pbconnect.bindWithdrawPuzzleHash(id, addr)
            return res
        }
    } catch (e) {
        console.log("bindaddr errrrr", e.message)
    }
}
async function clearAddr(pbxid) {
    const id = parseInt(pbxid)
    const addr1 = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const res = await bsc.ctrs.pbconnect.bindWithdrawPuzzleHash(id, addr1)
    console.log("clearAddr", res)
}
async function sendToMarket(coin, id) {
    const pb = coin2pb(coin)
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bsc.ctrs.pbmarket.address, id)
    console.log('transfer receipt', res)
    return res
}
async function setSellInfo(coin, id, ptName, price, desc) {
    const pb = coin2pb(coin)
    var ptAddr = ptAddrs[ptName]
    if (!ptAddr) {
        ptAddr = ethers.constants.AddressZero
    }
    console.log('onSale', pb.address, id, ptAddr, ethers.utils.parseEther(price), desc)
    const res = await bsc.ctrs.pbmarket.onSale(pb.address, id, ptAddr, ethers.utils.parseEther(price), desc)
    console.log('set sell info receipt', res)
}
async function checkAllowance(nft) {
    console.log('checkAllowce', nft)
    const priceToken = nft.market.priceToken
    const price = ethers.utils.parseEther(nft.market.price)

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
            console.log("checkallowance", options, price, ctr, allow, allow.lt(price))
            return allow
        } catch (e) {
            console.log("eee", e.message)
        }
    }
}
async function approveAllow(nft) {
    const priceToken = nft.priceToken
    const price = ethers.utils.parseEther(nft.price)
    const ctr = pbwallet.erc20_contract(priceToken)
    // uint256_MAX, priceToken_ctr.totalSupply()
    const res = await ctr.approve(bsc.ctrs.pbmarket.address, price.mul(1000000))
    res.fn = 'approve'
    return res


}
async function buyNFT(coin, nft) {
    const pb = coin2pb(coin)
    const price = ethers.utils.parseEther(nft.market.price)
    const priceToken = nft.market.priceToken
    const id = ethers.BigNumber.from(nft.id)
    console.log('buy', pb, "id", id, priceToken, price)
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    } else {
        // check allowance
        const allow = await checkAllowance(nft)
        if (allow.lt(price)) { // not enough allowance, approve first
            const res = await approveAllow(nft)
            console.log("res", res) // TODO: approve can use MAX_UINT256 for infinity
            res.fn = 'approve'
            // we need to wait for approve confirmed by BSC network, so return and let user buy again
            // TODO: show "Approve" in button when allowance not enough, then show "Buy" when allowance enough
            // TODO: check ERC20 balance then buy
            return res
        }
    }
    const res = await bsc.ctrs.pbmarket.buy(pb.address, id, options)
    res.fn = 'buy'
    return res
}
async function retreatNFT(coin, id) {
    const pb = coin2pb(coin)
    const res = await bsc.ctrs.pbmarket.offSale(pb.address, id)
    console.log('retreat receipt', res)
}


const coinDecimals = {}

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
//获取费率 
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
//获取最大值，最小值
async function getLimit(coin) {
    const ctr = coinContract(coin)
    let amount = await ctr.getCWAmount()
    const decimals = await getDecimals(coin)
    const amountMax = ethers.utils.formatUnits(amount[1], decimals)
    const amountMin = ethers.utils.formatUnits(amount[0], decimals)
    amount = [amountMin, amountMax]
    return amount
}
//添加代币
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
    afterFee: afterFee,
    watchToken: watchToken,
    bindTX: bindTX,
    burnWcoin: burnWcoin,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
    unbind: unbind,
    mintPBT: mintPBT,
    bindAddr: bindAddr,
    clearAddr: clearAddr,
    waitEventDone: waitEventDone,
    retreatNFT: retreatNFT,
    buyNFT: buyNFT,
    setSellInfo: setSellInfo,
    sendToMarket: sendToMarket,
    getLimit: getLimit,
    getfees: getfees,
    getmintfee: getmintfee,
}