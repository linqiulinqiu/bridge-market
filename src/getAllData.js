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
//监听 PBT list 以及 事件evt的发生
async function listenEvents(commit) {
    if (bsc.ctrs.pbt.filters.MinterTransferred) { //mint PBT
        bsc.ctrs.pbt.on(bsc.ctrs.pbt.filters.MinterTransferred, async function (evt) {
            console.log("pbt MinterTransferred", evt)
        })
    }
    if (bsc.ctrs.pbpuzzlehash.filters.WithdrawPuzzleHashChanged) { //bind withdraw addr
        bsc.ctrs.pbpuzzlehash.on(bsc.ctrs.pbpuzzlehash.filters.WithdrawPuzzleHashChanged, async function (evt) {
            if (evt.event == 'WithdrawPuzzleHashChanged') {
                console.log("PBx.WithdrawPuzzleHashChangedr", evt)
                const key = parseInt(evt.args.tokenId).toString() //pbt id
                console.log("cointy evt", coinTy)
                const mlist = PBTList.owned
                const bindinfo = await getBindInfo(evt.args.tokenId)
                mlist[key].pbxs = bindinfo
                PBTList.owned = mlist
                store.commit("setPBTlists", PBTList.owned)
            }
        })
    }
    if (bsc.ctrs.pbpuzzlehash.filters.DepositPuzzleHashChanged) { //bind withdraw addr
        bsc.ctrs.pbpuzzlehash.on(bsc.ctrs.pbpuzzlehash.filters.DepositPuzzleHashChanged, async function (evt) {
            if (evt.event == 'DepositPuzzleHashChanged') {
                console.log("PBT DepositPuzzleHashChanged", evt)
                const key = parseInt(evt.args.tokenId).toString() //pbt id
                console.log("cointy evt", coinTy)
                const mlist = PBTList.owned
                const bindinfo = await getBindInfo(evt.args.tokenId)
                mlist[key].pbxs = bindinfo
                PBTList.owned = mlist
                store.commit("setPBTlists", PBTList.owned)
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
                const pbxinfo = await getBindInfo(evt.args.tokenId)
                info['pbxs'] = pbxinfo
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
                const pbxinfo = await getBindInfo(evt.args.tokenId)
                console.log('infoo', info, pbxinfo, PBTList.owned[key])

                info['pbxs'] = pbxinfo
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
                info = slist[key]
                info.market = marketInfo
                slist[key] = info
                PBTList.selling = slist
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
async function getCoinTypes(pbtid) {
    const cointype = await bsc.ctrs.pbpuzzlehash.pbtCoinTypes([pbtid])
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
        const info = await getBindInfo(nft.id)
        console.log("nftAllinfo", key, info)
        nft['pbxs'] = info
        PBTList.owned[nft.id.toString()]['pbxs'] = info
        console.log("this NFT", nft)
        return nft
    }
}

function fix_uri(uri) {
    if (uri.startsWith('ipfs:')) {
        console.log('ipfs uri', uri)
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else {
        return uri
    }
}
// 根据nftid 获取 nftinfo
async function getNFTinfo(coin, nftid) {
    const pb = coin2pb(coin)
    const uri = await pb.tokenURI(nftid.toNumber())
    console.log("uri", uri)
    const meta = await fetch(fix_uri(uri))
    const info = {
        id: nftid.toNumber(),
        uri: uri,
        meta: meta,
    }
    console.log("get simple info", info)

    return info
}
//获取绑定的 地址信息 
async function getBindInfo(pbtId) {
    const list = PBTList.owned[pbtId.toString()]
    const coinTy = await getCoinTypes(pbtId)
    console.log("coinTY", coinTy)
    for (var i = 0; i < coinTy.length; i++) {
        const prefix = coinTyMap[coinTy[i].toString()].toLowerCase()
        console.log("prefix", prefix)
        const xAddress = await bsc.ctrs.pbpuzzlehash.pbtPuzzleHash(pbtId, coinTy[i])
        console.log("xAddr", xAddress)
        const depAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[0]), prefix)
        const withAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[1]), prefix)
        const addrInfo = {
            depositeAddr: depAddress.toString(),
            withdrawAddr: withAddress.toString()
        }
        console.log("addrINfo", addrInfo)
        const pbxs = {}
        pbxs[coinTy[i].toString()] = addrInfo
        console.log("PBxs", pbxs)
        list.pbxs = pbxs
        PBTList.owned[pbtId.toString()] = list
        return pbxs
    }


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
    console.log("PBT/PBX list =", PBTList.owned)
    return await getBriefInfo(coin, bsc.addr)
}
//获取market list
async function getMarketList(coin) {
    if (coin == "PBT") PBTList.selling = await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
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
    //获取 PBT 的绑定信息 pbxs{coinTypes：{depositAddr:"",withdrawAddr:""}}
    if (addr == bsc.addr) {
        list = PBTList.owned
        const arrmKeys = Object.keys(list)
        for (let i = 0; i < arrmKeys[i]; i++) {
            const idx = arrmKeys[i]
            const minfo = list[idx]
            if (!"pbxs" in minfo) {
                const bindinfo = await getBindInfo(idx)
                minfo.pbxs = bindinfo
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
    console.log("PBT list detail info=", PBTList.owned)
    return await getUserTokenList(coin, bsc.addr)
}
async function getSaleList(coin) {
    if (coin == "PBT") PBTList.selling = await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
    return await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
}

function getMySaleList(coin) {
    let msList = {}
    if (coin == "PBT") {
        const slist = PBTList.selling
        const slistKeys = Object.keys(slist)
        for (let i = 0; i < slistKeys.length; i++) {
            if (slist[slistKeys[i]].market.seller == "-self") {
                const key = slist[slistKeys[i]].id.toString()
                msList[key] = slist[slistKeys[i]]
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