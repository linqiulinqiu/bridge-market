import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
import allData from './getAllData'
import store from "./store"
var bsc = store.bsc
async function listenNFTEvents(ctr, list, commit) {
    ctr.on(ctr.filters.Transfer, async function (evt) {

        if (evt.args.to == bsc.addr) {
            console.log("listen list0 =", list, evt, evt.args.tokenId)
            //mint event
            //list.owned.push(evt.args.tokenid)
            const id = evt.args.tokenId
            const info = await getNFTinfo("PBT", id)
            console.log("mint evt lisen", info)
            if ('owned' in list) {
                list['owned'].push(info)
                commit("setPBTlists", list.owned)
            }


            if (evt.args.from == bsc.ctrs.pbmarket.to) { //bind   
                console.log("listen 111 ,", list, evt)
            }
        } else if (evt.args.from == bsc.addr) {
            if (evt.args.to == bsc.ctrs.pbx.to) { // retreat tx 
                console.log("listen 222 ,", list, evt)
            }
            // else if () { }
        } else if (evt.args.to == bsc.ctrs.pbmarket.to) {
            //售卖nft，从owned到 mySale/selling 将pbt与pbx 在owned删除，添加到 selling 
            //区分selling 与 mysell   owner “”/--self
            console.log("listen onSale,list=", list, evt.args.tokenId)
            // const id = evt.args.tokenId.toNumber().toString()
            // console.log("id", id)
            // if (id in list) {
            //     delete(list.owned[evt.args.tokenId]) //owned中删除

            //     //根据变动的list去 判断 coin  list.owned[evt.args.tokenid].name
            //     //在 selling中增加
            //     if (list.owned[evt.args.tokenId].name == "PlotBridge Truck") {
            //         const coin = "PBT"
            //         const info = await getNFTinfo(coin, evt.args.tokenId)
            //         const key = info.id.toString()
            //         PBTList.selling[key] = info
            //         commit("setPBTlists", PBTList.owned)
            //         console.log("selling list", PBTList.selling, info)
            //     } else if (list.owned[evt.args.tokenId].name == "PlotBridge Xin") {
            //         const coin = "PBX"
            //         const info = await getNFTinfo(coin, evt.args.tokenId)
            //         const key = info.id.toString()
            //         PBXList.selling[key] = info
            //         commit("setPBXlists", PBXList.owned)
            //         console.log("selling list", PBXList.selling, info)
            //     }
            // }
        } else if (evt.args.from == bsc.addr) { // transfer out PBXBind
            commit("setPBXlists", list)
            console.log("listen list1 =", list, evt, evt.args.tokenId)

        } else if (evt.args.from == bsc.addr && evt.args.to == bsc.ctrs.pbmarket.to) { // on sale
            commit("setPBXlists", list)
            console.log("listen list2 =", list, evt, evt.args.tokenId)

        } else if (evt.args.from == bsc.ctrs.pbmarket.to) { // bought or offsale
            commit("setPBXlists", list)
            console.log("listen list3 =", list, evt, evt.args.tokenId)
        }
    })
}
// 在 PBlist.owned 查询 id,key 的信息
// function pbInList(key, list) {
//     console.log("list", list)
//     const arr = Object.keys(list)
//     console.log("arr1", arr)
//     const k = key.toString()
//     const index = arr.includes(k)
//     console.log("arr", arr, k, typeof k, index)
//     return index
// }
// 根据nftid 获取 nftinfo
// async function getNFTinfo(coin, nftid) {
//     let nftlist = {}
//     const pb = coin2pb(coin)
//     const uri = await pb.tokenURI(nftid)
//     const meta = await (await fetch(uri)).json()
//     const key = nftid.toString()
//     const info = {
//         id: nftid.toNumber(),
//         uri: uri,
//         meta: meta,
//     }
//     nftlist[key] = info
//     return nftlist
// }
//获取绑定的 pbx 信息 
// async function getPBXInfo(pbtId, pbxId) {
//     const xAddress = await bsc.ctrs.pbconnect.XAddressList(pbtId)
//     console.log("getPBXinfo", xAddress, xAddress[0].toString())
//     const depAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[1].toString(), "xcc")
//     const withAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[2].toString(), "xcc")
//     const info = {
//         id: pbxId,
//         coinTypes: xAddress[0].toString(),
//         depositAddr: depAddress.toString(),
//         withdrawAddr: withAddress.toString()
//     }
//     console.log("add bind pbx info", info);
//     return info
// }

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


//监听 PBT/PBX list 以及 事件evt的发生
async function listenEvents(commit) {
    ListenToWCoin(commit)
    listenNFTEvents(bsc.ctrs.pbt, PBTList, function (newlist) {
        // newlist = PBTList.owned
        console.log("pbt=list", PBTList, newlist, bsc.ctrs.pbt)
        // console.log("pbtlist,evt", )
        // commit('setPBTlists', newlist)
    })
    listenNFTEvents(bsc.ctrs.pbx, PBXList, function (newlist) {
        // newlist = PBXList.owned
        console.log("pbx=list", newlist)

        // commit('setPBXlists', newlist)
    })
    if (bsc.ctrs.pbconnect.filters.PBXBind) {
        bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXBind, async function (evt) {

            // if PBTid in PBTList, update my PBT info
            let pbtnft = PBTList.owned[evt.args.pbtId]
            console.log("bind evt 1", evt, "PBTid--info = ", PBTList.owned[evt.args.pbtId], pbtnft)

            const index = pbInList(evt.args.pbtId.toString(), PBTList.owned) // id or false
            const coinTy = await getCoinTypes(evt.args.pbxId) // pbx cointypes
            console.log("coinTy-index 1", index, coinTy)
            //如果 pbtid in pbtlist
            if (index) {

                // 获取 evt.pbtId 的详细信息  PBTList.owned[evt.pbtId]
                console.log(" bind 2 pbtnft-info", pbtnft)
                //遍历pbtnft上有没有pbxs
                // const pbxsk = pbInList("pbxs", pbtnft)
                if ("pbxs" in PBTList.owned[evt.args.pbtId]) { // 如果nft上已经有了pbxs属性
                    const type = pbInList(coinTy[0], pbtnft.pbxs)
                    // const type = (Object.keys(PBTList.owned[evt.args.pbtId].pbxs)).includes(coinTy[0]) // 查找pbxs上是否已经有相同属性 查找Key值
                    console.log("bind3 type", type, typeof coinTy[0], )

                    // 如果不存在该coinTy
                    if (!type) {
                        // 添加key值  
                        const pbxinfo = await getPBXInfo(evt.args.pbtId, evt.args.pbxId)
                        const key = coinTy[0]
                        pbtnft['pbxs'][key.toString()] = pbxinfo
                        console.log("bind 4 pntnft ", PBTList.owned)
                        commit("setPBTlists", PBTList.owned)

                    }
                } else {
                    // 不存在pbxs，添加 pbxs
                    const key = 'pbxs'
                    const pbxinfo = await getPBXInfo(evt.args.pbtId, evt.args.pbxId)
                    if (pbxinfo.coinTypes != "") {
                        const xkey = pbxinfo.coinTypes.toString()
                        let pbxsInfo = {}
                        pbxsInfo[xkey] = pbxinfo
                        PBTList.owned[evt.args.pbtId][key] = pbxsInfo
                        console.log("bind 5", PBTList.owned)
                    }

                }
                console.log("bind 6 pbt nf", PBTList.owned)
                commit("setPBTlists", PBTList.owned)

            }
            //在 PBXlist.owned 中查询 evt.args.pbxID
            const xIndex = pbInList(evt.args.pbxId.toNumber(), PBXList.owned) //id or false
            console.log("pbx bind 7", xIndex)
            if (xIndex) {
                // 删除 pbxnft
                delete(PBXList.owned[evt.args.pbxId])
                console.log("bind 7 pbx nft", xIndex, PBXList.owned)
                commit("setPBXlists", PBXList.owned)
            }
            bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXBind)
        })
    }
    if (bsc.ctrs.pbconnect.filters.PBXRetreat) {
        bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXRetreat, async function (evt) {
            // if PBTid in PBTList, update my PBT info

            const index = pbInList(evt.args.pbtId.toString(), PBTList.owned)
            // const coinTy = await getCoinTypes(evt.args.pbxId)
            const coinTy = await getCoinTypes(evt.args.pbxId) // pbx cointypes
            console.log("re 1 index", index, coinTy)

            if (index != false) {
                let pbtnft = PBTList.owned[evt.args.pbtId]
                // if ('pbxs' in PBTList.owned[(evt.args.pbtId).toString()]) { // 如果nft上已经有了pbxs属性
                if ("pbxs" in pbtnft) {
                    //cointypes or false
                    if (coinTy[0] in pbtnft['pbxs']) { // 查看pbtnft.pbxs上是否有该type
                        // if (type) {
                        //如果pbx.length >1,删除该type,否则，删除pbxs
                        if (Object.keys(pbtnft['pbxs']).length > 1) {
                            delete(pbtnft.pbxs[coinTy[0].toString()])
                            console.log("re2 delete in pbtnft", PBTList.owned)
                        } else {
                            delete pbtnft.pbxs['id']
                            delete pbtnft['pbxs']
                            console.log("re2222 delete in pbtnft", PBTList.owned)
                        }
                        commit("setPBTlists", PBTList.owned)
                        console.log("re3 pbtnft", PBTList.owned)
                    }
                }
            }
            const xIndex = pbInList(evt.args.pbxId.toNumber(), PBXList.owned)
            console.log("re 4 xIndex", xIndex)

            if (!xIndex) {
                const pb = bsc.ctrs.pbx
                const id = evt.args.pbxId
                console.log("retreat 5 pbx id", id, evt.args.pbxId)
                const uri = await pb.tokenURI(id)
                const meta = await (await fetch(uri)).json()
                const item = {
                    id: id.toNumber(),
                    meta: meta,
                    uri: uri,
                }
                console.log("item", item)
                PBXList.owned[id.toString()] = item
                console.log("pbx retreat 6 list push", PBXList.owned)
                commit("setPBXlists", PBXList.owned)

            }
            console.log("retreat evt done,nftlists =", PBXList.owned)
            bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXRetreat)
        })
    }
}
//获取绑定的pbx类型
async function getCoinTypes(pbxid) {
    const cointype = await bsc.ctrs.pbx.getCoinTypes([pbxid])
    return cointype
}