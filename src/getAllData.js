import market from "./market";
import {
    ethers
} from 'ethers'
import pbwallet from 'pbwallet'
import store from "./store"


//  获取所有的页面数据
// 全局变量设置
console.log("store", store.state)
const state = store.state
var bsc = {}
var PBTList = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}
const coinMap = {
    "XCC": '3',
    "XCH": '1',
    "HDD": "2"
}
const coinTyMap = {
    3: "XCC",
    2: "HDD",
    1: "XCH"
}
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
//监听 PBT list 以及 事件evt的发生
async function listenEvents(commit) {

    if (bsc.ctrs.pbx.filters.WithdrawPuzzleHashChanged) { //bind withdraw addr
        bsc.ctrs.pbx.on(bsc.ctrs.pbx.filters.WithdrawPuzzleHashChanged, async function (evt) {
            if (evt.event == 'WithdrawPuzzleHashChanged') {
                console.log("PBx.WithdrawPuzzleHashChangedr", evt)
                const key = parseInt(evt.args.tokenId).toString()
                const addrinfo = await getPBXInfo(evt.args.tokenId)
                PBTList.owned[key].pbxs.withdrawAddr = addrinfo.withdrawAddr
                console.log("stasssss", PBTList.owned)
                store.commit("setPBTlist", PBTList.owned)
            }
        })
    }
    if (bsc.ctrs.pbmarket.filters.OffSale) { //下架商品
        bsc.ctrs.pbmarket.on(bsc.ctrs.pbmarket.filters.OffSale, async function (evt) {
            if (evt.event == "OffSale") {
                console.log("OFF sale start", evt)
                //减少
                const slist = PBTList.selling
                const key = parseInt(evt.args.tokenId).toString()
                delete slist[key]
                PBTList.selling = slist
                store.commit("setPBTSellingLists", slist)
                //减少
                const mslist = getMySaleList("PBT")
                PBTList.mysale = mslist
                store.commit("setPBTMySaleLists", mslist)
                //增加
                const mylist = PBTList.owned
                const info = await getNFTinfo("PBT", evt.args.tokenId)
                mylist[key] = info
                PBTList.owned = mylist
                const pbxinfo = await getPBXInfo(evt.args.tokenId)
                info['pbxs'].depositeAddr = pbxinfo.depositeAddr
                info['pbxs'].withdrawAddr = pbxinfo.withdrawAddr
                mylist[key] = info
                PBTList.owned = mylist
                store.commit("setPBTlists", mylist)
            }
        })
    }
    if (bsc.ctrs.pbmarket.filters.Sold) { //购买NFT
        bsc.ctrs.pbmarket.on(bsc.ctrs.pbmarket.filters.Sold, async function (evt) {
            if (evt.event == 'Sold') {
                //增加
                const mylist = PBTList.owned
                const key = parseInt(evt.args.tokenId).toString()
                //根据id 获取详细信息
                const info = await getNFTinfo("PBT", evt.args.tokenId)
                PBTList.owned[key] = info
                const pbxinfo = await getPBXInfo(evt.args.tokenId)
                console.log('infoo', info, pbxinfo, PBTList.owned[key])
                info['pbxs'].depositeAddr = pbxinfo.depositeAddr
                info['pbxs'].withdrawAddr = pbxinfo.withdrawAddr
                mylist[key] = info
                PBTList.owned = mylist
                store.commit("setPBTlists", mylist)
                //减少
                const slist = PBTList.selling
                delete slist[key]
                PBTList.selling = slist
                store.commit("setPBTSellingLists", slist)
                //不变
                const mslist = getMySaleList("PBT")
                PBTList.mysale = mslist
                store.commit("setPBTMySaleLists", mslist)

            }
        })
    }
    if (bsc.ctrs.pbmarket.filters.OnSale) { // 更改价格
        bsc.ctrs.pbmarket.on(bsc.ctrs.pbmarket.filters.OnSale, async function (evt) {
            if (evt.event == 'OnSale') {
                console.log("On sale start", evt)
                const key = parseInt(evt.args.tokenId).toString()
                //减少                    
                const mylist = PBTList.owned
                if (Object.keys(mylist).includes(key)) { //售卖nft 
                    delete mylist[key]
                }
                //更改价格
                //增加    
                const slist = PBTList.selling
                let info = {}
                if (!(Object.keys(slist).includes(key))) {
                    info = await getNFTinfo("PBT", evt.args.tokenId)
                } else {
                    info = slist[key]
                }
                slist[key] = info
                PBTList.selling = slist
                const marketInfo = await getMarketNFT("PBT", evt.args.tokenId)
                console.log("market", marketInfo)
                info = slist[key]
                info.market = marketInfo
                slist[key] = info
                PBTList.selling = slist
                console.log("infooo", slist, slist[key])
                store.commit("setPBTSellingLists", slist)
                //增加 或者 更改价格
                const mslist = getMySaleList("PBT")
                PBTList.mysale = mslist
                store.commit("setPBTMySaleLists", mslist)
            }
        })
    }

}
//获取绑定的pbx类型
async function getCoinTypes(pbxid) {
    const cointype = await bsc.ctrs.pbx.getCoinTypes([pbxid])
    return cointype
}

async function connectW(commit) {
    bsc = await market.connect(commit)
    console.log("bsc", bsc)
    PBTList = {
        owned: {}, //setPBTlists 
        selling: {}, //setPBTSellingLists
        mysale: {}
    }
    if (bsc) {
        store.commit("setBsc", bsc)
        console.log("bsc", bsc)
        await listenEvents(commit)
        return bsc
    }
    console.log("bsc", bsc)
    // await listenEvents(commit)

    return false
}
// 在 PBlist.owned 查询 id,key 的信息
function pbInList(key, list) {
    const arr = Object.keys(list)
    const k = key.toString()
    const index = arr.includes(k)
    return index
}
// 点击nft 获取单个nft的所有信息
async function nftAllinfo(nft) {
    console.log("this.curnft info,now", nft)
    const bcoin = store.state.bcoin
    if (bcoin in coinMap) {
        const key = coinMap[bcoin]
        const info = await getPBXInfo(nft.id)
        console.log("nftAllinfo", key, info)
        nft.pbxs[key].depositeAddr = info.depositeAddr
        nft.pbxs[key].withdrawAddr = info.withdrawAddr
        console.log("this NFT", nft)
        return nft
    }
}
// 根据nftid 获取 nftinfo
async function getNFTinfo(coin, nftid) {
    const pb = coin2pb(coin)
    const uri = await pb.tokenURI(nftid.toNumber())
    const meta = await (await fetch(uri)).json()
    const pbxs = {}
    const pbx = await bsc.ctrs.pbconnect.PBXList(nftid)
    const coinType = await getCoinTypes(Number(pbx))
    const pbxsInfo = {
        id: pbx[0],
        coinType: coinType[0].toString()
    }
    pbxs[coinType[0].toString()] = pbxsInfo
    const info = {
        id: nftid.toNumber(),
        uri: uri,
        meta: meta,
        pbxs: pbxs
    }
    console.log("get simple info", info)

    return info
}
//获取绑定的 pbx 信息 
async function getPBXInfo(pbtId) {
    console.log("PBTlist", PBTList.owned)
    const list = PBTList.owned[pbtId.toString()]
    console.log("list", list)
    const coinArr = Object.keys(list.pbxs)
    let coin = ""
    if (coinArr.includes('1')) {
        coin = 'XCH'
    } else if (coinArr.includes('2')) {
        coin = "HDD"
    } else if (coinArr.includes('3')) {
        coin = "XCC"
    } else {
        return false
    }
    console.log("coin", coin, list, coinArr)
    // const prefix = getprefix(coin)
    const xAddress = await bsc.ctrs.pbconnect.XAddressList(pbtId)
    const depAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[1].toString(), coin.toLowerCase())
    const withAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[2].toString(), coin.toLowerCase())
    const info = {
        depositeAddr: depAddress.toString(),
        withdrawAddr: withAddress.toString()
    }
    return info
}
// 获取商城里的NFT信息
async function getMarketNFT(coin, nftid) {
    const pb = coin2pb(coin)
    const sinfo = await bsc.ctrs.pbmarket.getSaleInfo(pb.address, Number(nftid))
    const info = {}
    info.priceToken = sinfo[0]
    info.ptName = priceName(sinfo[0])
    info.price = ethers.utils.formatEther(sinfo[1])
    info.desc = sinfo[2]
    info.seller = sinfo[3]
    info.owner = 'market'
    return info
}

//获取绑定的pbx类型
// async function getCoinTypes(pbxid) {
//     const cointype = await bsc.ctrs.pbx.getCoinTypes([pbxid])
//     return cointype
// }

function priceName(token) {
    token = ethers.utils.getAddress(token)
    for (var k in ptAddrs) {
        if (ethers.utils.getAddress(ptAddrs[k]) == token) {
            return k
        }
    }
    return false
}
//获取所有的nft 简单信息
async function getBriefInfo(coin, addr) {
    const pb = coin2pb(coin)
    const cnt = await pb.balanceOf(addr)
    const BriefList = {}
    for (let i = 0; i < cnt; i++) {
        const idx = await pb.tokenOfOwnerByIndex(addr, i)
        const info = await getNFTinfo(coin, idx)
        const key = idx.toString()
        BriefList[key] = info
    }
    return BriefList
}
//获取mylist
async function getMyList(coin) {
    if (coin == "PBT") PBTList.owned = await getBriefInfo(coin, bsc.addr)
    // if (coin == "PBX") PBXList.owned = await getBriefInfo(coin, bsc.addr)
    console.log("PBT/PBX list =", PBTList.owned)
    return await getBriefInfo(coin, bsc.addr)
}
//获取market list
async function getMarketList(coin) {
    if (coin == "PBT") PBTList.selling = await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
    // if (coin == "PBX") PBXList.selling = await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
    return await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
}

//获取所有 list 信息
async function getUserTokenList(coin, addr) {
    const pb = coin2pb(coin)
    // 获取 NFT 基础信息 object--key为nftID，value 为 nftInfo
    //获取商城里的NFT 详细信息
    let list = {}
    if (addr == bsc.ctrs.pbmarket.address) {
        list = PBTList.selling
        const arrKeys = Object.keys(list)
        for (let i = 0; i < arrKeys.length; i++) {
            const idx = arrKeys[i] //key值 string
            const info = list[idx]
            if (!('market' in list)) {
                const minfo = await getMarketNFT(coin, idx)
                info.market = minfo
            }
            PBTList.selling = list
            store.commit('setPBTSellingLists', list)
        }
    }
    //获取 PBT 与 PBX 的绑定信息 pbxs{coinTypes：{id：”“，coinTypes:"",depositAddr:"",withdrawAddr:""}}
    if (addr == bsc.addr) {
        list = PBTList.owned
        const arrmKeys = Object.keys(list)
        for (let i = 0; i < arrmKeys[i]; i++) {
            const idx = arrmKeys[i]
            const minfo = list[idx]
            const pbxs = await bsc.ctrs.pbconnect.PBXList(idx)
            if (pbxs.length > 0) {
                const cointype = await getCoinTypes(pbxs.toString())
                const coinTy = cointype[0].toString()
                const bindXinfo = await getPBXInfo(Number(idx))
                if (!('depositeAddr' in minfo.pbxs[coinTy])) {
                    minfo.pbxs[coinTy].depositeAddr = bindXinfo.depositeAddr
                }
                if (!('withdrawAddr' in minfo.pbxs[coinTy])) {
                    minfo.pbxs[coinTy].withdrawAddr = bindXinfo.withdrawAddr
                }
                PBTList.owned = list
                store.commit("setPBTlists", list)
            }
        }
    }
    console.log("down", list)
    return list
}

function coin2pb(coin) {
    if (coin == 'PBT') return bsc.ctrs.pbt
    if (coin == 'PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:' + coin)
}
async function getMyTokenList(coin) {
    if (coin == "PBT") PBTList.owned = await getUserTokenList(coin, bsc.addr)
    // if (coin == "PBX") PBXList.owned = await getUserTokenList(coin, bsc.addr)
    console.log("PBT/PBX list detail info=", PBTList.owned)
    return await getUserTokenList(coin, bsc.addr)
}
async function getSaleList(coin) {
    if (coin == "PBT") PBTList.selling = await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
    // if (coin == "PBX") PBXList.selling = await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
    return await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
}

function getMySaleList(coin) {
    let msList = {}
    if (coin == "PBT") {
        const slist = PBTList.selling
        const slistKeys = Object.keys(slist)
        console.log("sssss", slist, slistKeys)
        for (let i = 0; i < slistKeys.length; i++) {
            if (slist[slistKeys[i]].market.seller == "-self") {
                const key = slist[slistKeys[i]].id.toString()
                console.log("ooooo", key, slistKeys[i])
                msList[key] = slist[slistKeys[i]]
                console.log("mmmmm", msList)
                store.commit("setPBTMySaleLists", msList)
                PBTList.mysale = msList
                console.log("mySale list", msList)
            }
        }
        return msList
    }
}
export default {
    getBriefInfo: getBriefInfo,
    connectW: connectW,
    getMyList: getMyList,
    getMarketList: getMarketList,
    getMyTokenList: getMyTokenList,
    getSaleList: getSaleList,
    getMySaleList: getMySaleList,
    pbInList: pbInList,
    getNFTinfo: getNFTinfo,
    nftAllinfo: nftAllinfo,
    getMarketNFT: getMarketNFT,
    listenEvents: listenEvents
}