import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
import allData from './getAllData'
import store from "./store"
var bsc = store.bsc
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