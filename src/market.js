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
    bsc = store.state.bsc
    console.log("ctr", tokenAddr, "bsc", bsc)
    const ctr = pbwallet.erc20_contract(tokenAddr)
    console.log("balance bsc.addr", bsc.addr, ctr)
    const balance = await ctr.balanceOf(bsc.addr)
    console.log('token balance', tokenAddr, balance)
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
    console.log('redeem amount', amount)
    await bsc.ctrs.tokenredeem.redeem(tokenAddr, amount)
}
async function bindTX(pbx_id, pbt) {
    const pbtId = ethers.utils.hexZeroPad(ethers.utils.hexValue(ethers.BigNumber.from(pbt.id)), 32)
    console.log("pbtid", pbtId, "pbx", pbx_id)
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
async function burnWXCC(amount) {
    const ctr = bsc.ctrs.wcoin
    amount = ethers.utils.parseUnits(amount, await ctr.decimals())
    // TODO: check balance
    const receipt = await ctr.burn(amount)
    console.log('burn receipt', receipt)
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
        console.log("unbinding with pbxID", pbx, pbxid)
        const res = await pbconnect.retreat(pbxid)
        console.log("unbind res", res)
        return res
    } catch (e) {
        console.log("onbound error", e.message)
    }
}
//绑定取款地址
async function bindAddr(waddr, pbxId) {
    // try {
    // var xhex = '',
    if ('ChiaUtils' in window) {
        const addr = window.ChiaUtils.address_to_puzzle_hash(waddr)
        const id = parseInt(pbxId)
        console.log("id", id, addr)
        const res = await bsc.ctrs.pbx.bindWithdrawPuzzleHash(id, addr)
        console.log("bindwaddr", res)
        return res
    }
    // const addr = window.ChiaUtils.address_to_puzzle_hash(waddr)

    // } catch (e) {
    // console.log("bindaddr errrrr", e.message)
    // }
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
        console.log("allow", allow)
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

//根据币种选择decimals
async function getDecimals(coin) {
    let wAddr = ''
    if (coin == "XCC") {
        wAddr = bsc.ctrs.wxcc.address
    }
    if (coin == "XCH") {}
    if (coin == "HDD") {}
    const ctr = pbwallet.erc20_contract(wAddr)
    const decimals = await ctr.decimals()
    return decimals
}
//获取费率 
async function getfees(coin) {
    const decimals = await getDecimals(coin)
    let depfee = []
    let wdfee = []
    if (coin == "XCC") {
        depfee = await bsc.ctrs.wxcc.getDepositFee()
        wdfee = await bsc.ctrs.wxcc.getWithdrawFee()
    }
    if (coin == "XCH") {}
    if (coin == "HDD") {}
    const fee = {}
    fee.depositeFee = ethers.utils.formatUnits(depfee[1], decimals)
    fee.depositeFeeRate = depfee[0]
    fee.withdrawFee = ethers.utils.formatUnits(wdfee[1], decimals)
    fee.withdrawFeeRate = wdfee[0]
    console.log("feeeeeeeeeeeeee", fee)
    return fee

}
//获取最大值，最小值
async function getLimit() {
    let amount = await bsc.ctrs.wxcc.getCWAmount()
    const decimals = await getDecimals('XCC')
    const amountMax = ethers.utils.formatUnits(amount[1], decimals)
    const amountMin = ethers.utils.formatUnits(amount[0], decimals)
    amount = [amountMin, amountMax]
    return amount
}
export default {
    bindTX: bindTX,
    burnWXCC: burnWXCC,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
    unbind: unbind,
    mintPBT: mintPBT,
    bindAddr: bindAddr,
    waitEventDone: waitEventDone,
    retreatNFT: retreatNFT,
    buyNFT: buyNFT,
    setSellInfo: setSellInfo,
    sendToMarket: sendToMarket,
    getLimit: getLimit,
    getfees: getfees
}