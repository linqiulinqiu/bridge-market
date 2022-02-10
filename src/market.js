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

//监听事件发生

// async function listenNFTEvents(ctr, list, commit) {
//     ctr.on(ctr.filters.Transfer, async function (evt) {

//         if (evt.args.to == bsc.addr) {
//             console.log("listen list0 =", list, evt, evt.args.tokenId)
//             //mint event
//             //list.owned.push(evt.args.tokenid)
//             const id = evt.args.tokenId
//             const info = await getNFTinfo("PBT", id)
//             console.log("mint evt lisen", info)
//             if ('owned' in list) {
//                 list['owned'].push(info)
//                 commit("setPBTlists", list.owned)
//             }


//             if (evt.args.from == bsc.ctrs.pbmarket.to) { //bind   
//                 console.log("listen 111 ,", list, evt)
//             }
//         } else if (evt.args.from == bsc.addr) {
//             if (evt.args.to == bsc.ctrs.pbx.to) { // retreat tx 
//                 console.log("listen 222 ,", list, evt)
//             }
//             // else if () { }
//         } else if (evt.args.to == bsc.ctrs.pbmarket.to) {
//             //售卖nft，从owned到 mySale/selling 将pbt与pbx 在owned删除，添加到 selling 
//             //区分selling 与 mysell   owner “”/--self
//             console.log("listen onSale,list=", list, evt.args.tokenId)
//             // const id = evt.args.tokenId.toNumber().toString()
//             // console.log("id", id)
//             // if (id in list) {
//             //     delete(list.owned[evt.args.tokenId]) //owned中删除

//             //     //根据变动的list去 判断 coin  list.owned[evt.args.tokenid].name
//             //     //在 selling中增加
//             //     if (list.owned[evt.args.tokenId].name == "PlotBridge Truck") {
//             //         const coin = "PBT"
//             //         const info = await getNFTinfo(coin, evt.args.tokenId)
//             //         const key = info.id.toString()
//             //         PBTList.selling[key] = info
//             //         commit("setPBTlists", PBTList.owned)
//             //         console.log("selling list", PBTList.selling, info)
//             //     } else if (list.owned[evt.args.tokenId].name == "PlotBridge Xin") {
//             //         const coin = "PBX"
//             //         const info = await getNFTinfo(coin, evt.args.tokenId)
//             //         const key = info.id.toString()
//             //         PBXList.selling[key] = info
//             //         commit("setPBXlists", PBXList.owned)
//             //         console.log("selling list", PBXList.selling, info)
//             //     }
//             // }
//         } else if (evt.args.from == bsc.addr) { // transfer out PBXBind
//             commit("setPBXlists", list)
//             console.log("listen list1 =", list, evt, evt.args.tokenId)

//         } else if (evt.args.from == bsc.addr && evt.args.to == bsc.ctrs.pbmarket.to) { // on sale
//             commit("setPBXlists", list)
//             console.log("listen list2 =", list, evt, evt.args.tokenId)

//         } else if (evt.args.from == bsc.ctrs.pbmarket.to) { // bought or offsale
//             commit("setPBXlists", list)
//             console.log("listen list3 =", list, evt, evt.args.tokenId)
//         }
//     })
// }
// // 在 PBlist.owned 查询 id,key 的信息
// // function pbInList(key, list) {
// //     console.log("list", list)
// //     const arr = Object.keys(list)
// //     console.log("arr1", arr)
// //     const k = key.toString()
// //     const index = arr.includes(k)
// //     console.log("arr", arr, k, typeof k, index)
// //     return index
// // }
// // 根据nftid 获取 nftinfo
// // async function getNFTinfo(coin, nftid) {
// //     let nftlist = {}
// //     const pb = coin2pb(coin)
// //     const uri = await pb.tokenURI(nftid)
// //     const meta = await (await fetch(uri)).json()
// //     const key = nftid.toString()
// //     const info = {
// //         id: nftid.toNumber(),
// //         uri: uri,
// //         meta: meta,
// //     }
// //     nftlist[key] = info
// //     return nftlist
// // }
// //获取绑定的 pbx 信息 
// // async function getPBXInfo(pbtId, pbxId) {
// //     const xAddress = await bsc.ctrs.pbconnect.XAddressList(pbtId)
// //     console.log("getPBXinfo", xAddress, xAddress[0].toString())
// //     const depAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[1].toString(), "xcc")
// //     const withAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[2].toString(), "xcc")
// //     const info = {
// //         id: pbxId,
// //         coinTypes: xAddress[0].toString(),
// //         depositAddr: depAddress.toString(),
// //         withdrawAddr: withAddress.toString()
// //     }
// //     console.log("add bind pbx info", info);
// //     return info
// // }

async function ListenToWCoin(commit) {
    const ctr = bsc.ctrs.wxcc
    const decimals = await ctr.decimals()
    async function updateBalance(evt) {
        const balance = await ctr.balanceOf(bsc.addr)
        console.log('wbalance', balance)
        commit('setWBalance', ethers.utils.formatUnits(balance, decimals))
    }
    await updateBalance()
    ctr.on(ctr.filters.Transfer, updateBalance)
}


// //监听 PBT/PBX list 以及 事件evt的发生
// async function listenEvents(commit) {
//     ListenToWCoin(commit)
//     listenNFTEvents(bsc.ctrs.pbt, PBTList, function (newlist) {
//         // newlist = PBTList.owned
//         console.log("pbt=list", PBTList, newlist, bsc.ctrs.pbt)
//         // console.log("pbtlist,evt", )
//         // commit('setPBTlists', newlist)
//     })
//     listenNFTEvents(bsc.ctrs.pbx, PBXList, function (newlist) {
//         // newlist = PBXList.owned
//         console.log("pbx=list", newlist)

//         // commit('setPBXlists', newlist)
//     })
//     if (bsc.ctrs.pbconnect.filters.PBXBind) {
//         bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXBind, async function (evt) {

//             // if PBTid in PBTList, update my PBT info
//             let pbtnft = PBTList.owned[evt.args.pbtId]
//             console.log("bind evt 1", evt, "PBTid--info = ", PBTList.owned[evt.args.pbtId], pbtnft)

//             const index = pbInList(evt.args.pbtId.toString(), PBTList.owned) // id or false
//             const coinTy = await getCoinTypes(evt.args.pbxId) // pbx cointypes
//             console.log("coinTy-index 1", index, coinTy)
//             //如果 pbtid in pbtlist
//             if (index) {

//                 // 获取 evt.pbtId 的详细信息  PBTList.owned[evt.pbtId]
//                 console.log(" bind 2 pbtnft-info", pbtnft)
//                 //遍历pbtnft上有没有pbxs
//                 // const pbxsk = pbInList("pbxs", pbtnft)
//                 if ("pbxs" in PBTList.owned[evt.args.pbtId]) { // 如果nft上已经有了pbxs属性
//                     const type = pbInList(coinTy[0], pbtnft.pbxs)
//                     // const type = (Object.keys(PBTList.owned[evt.args.pbtId].pbxs)).includes(coinTy[0]) // 查找pbxs上是否已经有相同属性 查找Key值
//                     console.log("bind3 type", type, typeof coinTy[0], )

//                     // 如果不存在该coinTy
//                     if (!type) {
//                         // 添加key值  
//                         const pbxinfo = await getPBXInfo(evt.args.pbtId, evt.args.pbxId)
//                         const key = coinTy[0]
//                         pbtnft['pbxs'][key.toString()] = pbxinfo
//                         console.log("bind 4 pntnft ", PBTList.owned)
//                         commit("setPBTlists", PBTList.owned)

//                     }
//                 } else {
//                     // 不存在pbxs，添加 pbxs
//                     const key = 'pbxs'
//                     const pbxinfo = await getPBXInfo(evt.args.pbtId, evt.args.pbxId)
//                     if (pbxinfo.coinTypes != "") {
//                         const xkey = pbxinfo.coinTypes.toString()
//                         let pbxsInfo = {}
//                         pbxsInfo[xkey] = pbxinfo
//                         PBTList.owned[evt.args.pbtId][key] = pbxsInfo
//                         console.log("bind 5", PBTList.owned)
//                     }

//                 }
//                 console.log("bind 6 pbt nf", PBTList.owned)
//                 commit("setPBTlists", PBTList.owned)

//             }
//             //在 PBXlist.owned 中查询 evt.args.pbxID
//             const xIndex = pbInList(evt.args.pbxId.toNumber(), PBXList.owned) //id or false
//             console.log("pbx bind 7", xIndex)
//             if (xIndex) {
//                 // 删除 pbxnft
//                 delete(PBXList.owned[evt.args.pbxId])
//                 console.log("bind 7 pbx nft", xIndex, PBXList.owned)
//                 commit("setPBXlists", PBXList.owned)
//             }
//             bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXBind)
//         })
//     }
//     if (bsc.ctrs.pbconnect.filters.PBXRetreat) {
//         bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXRetreat, async function (evt) {
//             // if PBTid in PBTList, update my PBT info

//             const index = pbInList(evt.args.pbtId.toString(), PBTList.owned)
//             // const coinTy = await getCoinTypes(evt.args.pbxId)
//             const coinTy = await getCoinTypes(evt.args.pbxId) // pbx cointypes
//             console.log("re 1 index", index, coinTy)

//             if (index != false) {
//                 let pbtnft = PBTList.owned[evt.args.pbtId]
//                 // if ('pbxs' in PBTList.owned[(evt.args.pbtId).toString()]) { // 如果nft上已经有了pbxs属性
//                 if ("pbxs" in pbtnft) {
//                     //cointypes or false
//                     if (coinTy[0] in pbtnft['pbxs']) { // 查看pbtnft.pbxs上是否有该type
//                         // if (type) {
//                         //如果pbx.length >1,删除该type,否则，删除pbxs
//                         if (Object.keys(pbtnft['pbxs']).length > 1) {
//                             delete(pbtnft.pbxs[coinTy[0].toString()])
//                             console.log("re2 delete in pbtnft", PBTList.owned)
//                         } else {
//                             delete pbtnft.pbxs['id']
//                             delete pbtnft['pbxs']
//                             console.log("re2222 delete in pbtnft", PBTList.owned)
//                         }
//                         commit("setPBTlists", PBTList.owned)
//                         console.log("re3 pbtnft", PBTList.owned)
//                     }
//                 }
//             }
//             const xIndex = pbInList(evt.args.pbxId.toNumber(), PBXList.owned)
//             console.log("re 4 xIndex", xIndex)

//             if (!xIndex) {
//                 const pb = bsc.ctrs.pbx
//                 const id = evt.args.pbxId
//                 console.log("retreat 5 pbx id", id, evt.args.pbxId)
//                 const uri = await pb.tokenURI(id)
//                 const meta = await (await fetch(uri)).json()
//                 const item = {
//                     id: id.toNumber(),
//                     meta: meta,
//                     uri: uri,
//                 }
//                 console.log("item", item)
//                 PBXList.owned[id.toString()] = item
//                 console.log("pbx retreat 6 list push", PBXList.owned)
//                 commit("setPBXlists", PBXList.owned)

//             }
//             console.log("retreat evt done,nftlists =", PBXList.owned)
//             bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXRetreat)
//         })
//     }
// }
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
//查询绑定关系 PBT--PBX 
async function sesrchlist() {

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
export default {
    // connect: connect,
    bindTX: bindTX,
    burnWXCC: burnWXCC,
    // getMyTokenList: getMyTokenList,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
    unbind: unbind,
    mintPBT: mintPBT,
    bindAddr: bindAddr,
    waitEventDone: waitEventDone,
}