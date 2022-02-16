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
async function connectW() {
    bsc = await pbwallet.connect(true)
    PBTList = {
        // initial load all owned PBT
        owned: {}, //setPBTlists 
        selling: {}, //setPBTSellingLists
        mysale: {}
    }
    PBXList = {
        // initial load all owned PBX
        owned: {},
        selling: {},
        mysale: {}
    }
    if (bsc) {
        store.commit("setBsc", bsc)
        console.log("bsc123", bsc)
        // getBsc()

        // await listenEvents(commit)
        // await ListenToWCoin(commit)
        return bsc
    }
    console.log("bsc", bsc)
    return false
}
// 在 PBlist.owned 查询 id,key 的信息
function pbInList(key, list) {
    console.log("list", list)
    const arr = Object.keys(list)
    console.log("arr1", arr)
    const k = key.toString()
    const index = arr.includes(k)
    console.log("arr", arr, k, typeof k, index)
    return index
}

// 根据nftid 获取 nftinfo
async function getNFTinfo(coin, nftid) {
    const pb = coin2pb(coin)
    const uri = await pb.tokenURI(nftid.toNumber())
    console.log("uri", uri)
    const meta = await (await fetch(uri)).json()
    console.log("meta", meta)

    const pbxs = {}

    const pbx = await bsc.ctrs.pbconnect.PBXList(nftid)
    console.log("pbx", pbx)
    const coinType = await getCoinTypes(Number(pbx))
    console.log("cointy", coinType)
    const pbxsInfo = {
        id: pbx,
        coinType: coinType
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
    const xAddress = await bsc.ctrs.pbconnect.XAddressList(pbtId)
    const depAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[1].toString(), "xcc")
    const withAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[2].toString(), "xcc")
    const info = {
        depositAddr: depAddress.toString(),
        withdrawAddr: withAddress.toString()
    }
    // console.log("add bind pbx info", info);
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
        console.log('idx', idx)
        const info = await getNFTinfo(coin, idx)
        console.log("info", info)
        const key = idx.toString()
        BriefList[key] = info
    }
    if (addr == bsc.addr) {
        store.commit("setPBTlists", BriefList)
        console.log("store.state.pbtlists", state.PBTlists)
    }
    if (addr == bsc.ctrs.pbmarket.address) {
        store.commit("setPBTSellingLists", BriefList)
        console.log("store.state.pbtlists", state.PBTSellingLists)
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
    //pb==coin（"PBT"/"PBX"）
    const pb = coin2pb(coin)
    // 获取 NFT 基础信息 object--key为nftID，value 为 nftInfo
    const list = await getBriefInfo(coin, addr)
    console.log("list", list)
    const arrKeys = Object.keys(list)
    //获取商城里的NFT 详细信息
    for (let i = 0; i < arrKeys.length; i++) {
        const idx = arrKeys[i] //key值 string
        const info = list[idx]
        console.log("idx-info", idx, info)
        if (addr == bsc.ctrs.pbmarket.address) {
            const minfo = await getMarketNFT(coin, idx)
            info.market = minfo
            console.log("info.market", info)
            store.commit('setPBTSellingLists', list)
        }
        //获取 PBT 与 PBX 的绑定信息 pbxs{coinTypes：{id：”“，coinTypes:"",depositAddr:"",withdrawAddr:""}}
        if (pb == bsc.ctrs.pbt) {
            if ('id' in info) {
                const pbxs = await bsc.ctrs.pbconnect.PBXList(idx)
                if (pbxs.length > 0) {
                    const cointype = await getCoinTypes(pbxs.toString())
                    const coinTy = cointype[0].toString()
                    console.log("cointy", coinTy)
                    const bindXinfo = await getPBXInfo(Number(idx))
                    info.pbxs[coinTy].depositAddr = bindXinfo.depositAddr
                    info.pbxs[coinTy].withdrawAddr = bindXinfo.withdrawAddr
                    store.commit("setPBTlists", list)
                }
            }
        }
    }
    console.log("get user list", list)
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
    console.log("PBT/PBX list detail info=", PBTList, PBXList)
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
        for (let i in slistKeys) {
            if (slist[slistKeys[i]].seller == "-self") {
                const key = slist[slistKeys[i]].id.toString()
                msList[key] = slist[slistKeys[i]]
                store.commit("setPBTMySaleLists", msList)
                PBTList.mysale = msList
                console.log("mysale", slist[slistKeys[i]], msList)
            }
        }
        return msList
    }
}

async function getBsc() {
    const bsc = await connectW()
    return bsc
}
export default {
    getBriefInfo: getBriefInfo,
    getBsc: getBsc,
    connectW: connectW,
    getMyList: getMyList,
    getMarketList: getMarketList,
    getMyTokenList: getMyTokenList,
    getSaleList: getSaleList,
    getMySaleList: getMySaleList,
    pbInList: pbInList,
    getNFTinfo: getNFTinfo,
}