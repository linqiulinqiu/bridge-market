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
var PBXList = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}
const coinMap = {
    "XCC": '3',
    "XCH": '1',
    "HDD": "2"
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
        console.log("bsc123", bsc)
        return bsc
    }
    console.log("bsc", bsc)
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

    const list = PBTList.owned[pbtId]
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
    if (coin == "PBX") PBXList.owned = await getBriefInfo(coin, bsc.addr)
    console.log("PBT/PBX list =", PBTList, PBXList)
    return await getBriefInfo(coin, bsc.addr)
}
//获取market list
async function getMarketList(coin) {
    if (coin == "PBT") PBTList.selling = await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
    if (coin == "PBX") PBXList.selling = await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
    return await getBriefInfo(coin, bsc.ctrs.pbmarket.address)
}

//获取所有 list 信息
async function getUserTokenList(coin, addr) {
    const pb = coin2pb(coin)
    // 获取 NFT 基础信息 object--key为nftID，value 为 nftInfo
    const list = await getBriefInfo(coin, addr)
    const arrKeys = Object.keys(list)
    //获取商城里的NFT 详细信息
    for (let i = 0; i < arrKeys.length; i++) {
        const idx = arrKeys[i] //key值 string
        const info = list[idx]
        if (addr == bsc.ctrs.pbmarket.address) {
            const minfo = await getMarketNFT(coin, idx)
            info.market = minfo
            store.commit('setPBTSellingLists', list)
        }
        //获取 PBT 与 PBX 的绑定信息 pbxs{coinTypes：{id：”“，coinTypes:"",depositAddr:"",withdrawAddr:""}}
        if (pb == bsc.ctrs.pbt) {
            if ('id' in info) {
                const pbxs = await bsc.ctrs.pbconnect.PBXList(idx)
                if (pbxs.length > 0) {
                    const cointype = await getCoinTypes(pbxs.toString())
                    const coinTy = cointype[0].toString()
                    if (!info.market) {
                        const bindXinfo = await getPBXInfo(Number(idx))
                        if (!'depositeAddr' in info.pbxs[coinTy]) {
                            info.pbxs[coinTy].depositeAddr = bindXinfo.depositeAddr
                        }
                        if (!'withdrawAddr' in info.pbxs[coinTy]) {
                            info.pbxs[coinTy].withdrawAddr = bindXinfo.withdrawAddr
                        }
                        store.commit("setPBTlists", list)
                    }
                }
            }
        }
    }
    return list
}

function coin2pb(coin) {
    if (coin == 'PBT') return bsc.ctrs.pbt
    if (coin == 'PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:' + coin)
}
async function getMyTokenList(coin) {
    if (coin == "PBT") PBTList.owned = await getUserTokenList(coin, bsc.addr)
    if (coin == "PBX") PBXList.owned = await getUserTokenList(coin, bsc.addr)
    console.log("PBT/PBX list detail info=", PBTList)
    return await getUserTokenList(coin, bsc.addr)
}
async function getSaleList(coin) {
    if (coin == "PBT") PBTList.selling = await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
    if (coin == "PBX") PBXList.selling = await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
    return await getUserTokenList(coin, bsc.ctrs.pbmarket.address)
}
async function getMySaleList(coin) {
    let msList = {}
    if (coin == "PBT") {
        const slist = state.PBTSellingLists
        const slistKeys = Object.keys(slist)
        for (let i = 0; i < slistKeys.length; i++) {
            if (slist[slistKeys[i]].seller == "-self") {
                const key = slist[slistKeys[i]].id.toString()
                msList[key] = slist[slistKeys[i]]
                store.commit("setPBTMySaleLists", msList)
                PBTList.mysale = msList
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
}