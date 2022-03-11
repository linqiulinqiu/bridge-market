import market from "./market";
import {
    ethers
} from 'ethers'
import pbwallet from 'pbwallet'
import store from "./store"
import keeper from 'pbweb-nftkeeper'

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

//获取绑定的coin类型
async function getCoinTypes(pbtid) {
    const id = ethers.BigNumber.from(pbtid)
    const cointype = await bsc.ctrs.pbpuzzlehash.pbtCoinTypes(id)
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
        commit("setBsc", bsc)
        await keeper.startKeeper(bsc, commit, PBTList)
        const cnt = await keeper.preload(commit, PBTList)
        console.log('user owns', cnt.toString(), 'PBT')
        return bsc
    }
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
        nft['pbxs'] = info
        PBTList.owned[nft.id.toString()]['pbxs'] = info
        return nft
    }
}

function fix_uri(uri) {
    if (uri.startsWith('ipfs:')) {
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else {
        return uri
    }
}
// 根据nftid 获取 nftinfo
async function getNFTinfo(coin, nftid) {
    const pb = coin2pb(coin)
    const uri = await pb.tokenURI(nftid.toNumber())
    const meta = await fetch(fix_uri(uri))
    const img = await meta.json()
    meta['image'] = await fix_uri(String(img.image))
    const info = {
        id: nftid.toNumber(),
        uri: uri,
        meta: meta,
    }
    return info
}
//获取绑定的 地址信息 
async function getBindInfo(pbtId) {
    const key = pbtId
    const list = PBTList.owned[key]
    const coinTy = await getCoinTypes(key)
    const pbxs = {}
    for (var i = 0; i < coinTy.length; i++) {
        const prefix = coinTyMap[String(coinTy[i])].toLowerCase()
        const xAddress = await bsc.ctrs.pbpuzzlehash.pbtPuzzleHash(pbtId, coinTy[i])
        const depAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[0]), prefix)
        const withAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[1]), prefix)
        const addrInfo = {
            depositAddr: String(depAddress),
            withdrawAddr: String(withAddress)
        }
        pbxs[String(coinTy[i])] = addrInfo
        list.pbxs = pbxs
        PBTList.owned[String(pbtId)] = list
    }
    return pbxs
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
        const key = String(idx)
        BriefList[key] = info
    }
    return BriefList
}
//获取mylist
async function getMyList(coin) {
    if (coin == "PBT") PBTList.owned = await getBriefInfo(coin, bsc.addr)
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
            if (!("pbxs" in minfo)) {
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
    throw new Error('Unsupported coin:' + coin)
}
async function getMyTokenList(coin) {
    if (coin == "PBT") PBTList.owned = await getUserTokenList(coin, bsc.addr)
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
    getMarketNFT: getMarketNFT
}
