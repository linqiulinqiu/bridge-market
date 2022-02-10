import market from "./market";
import {
    ethers
} from 'ethers'
import pbwallet from 'pbwallet'
import store from "./store"


//  获取所有的页面数据
// 全局变量设置
console.log("store", store.state)
var bsc = {}
var PBTList = {}
var PBXList = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
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
    const uri = await pb.tokenURI(nftid)
    const meta = await (await fetch(uri)).json()
    const info = {
        id: nftid.toNumber(),
        uri: uri,
        meta: meta,
    }
    // console.log("info", pb, uri, meta, info)
    return info
}
//获取绑定的 pbx 信息 
async function getPBXInfo(pbtId, pbxId) {
    const xAddress = await bsc.ctrs.pbconnect.XAddressList(pbtId)
    // console.log("getPBXinfo", xAddress, xAddress[0].toString())
    const depAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[1].toString(), "xcc")
    const withAddress = window.ChiaUtils.puzzle_hash_to_address(xAddress[2].toString(), "xcc")
    const info = {
        id: pbxId,
        coinTypes: xAddress[0].toString(),
        depositAddr: depAddress.toString(),
        withdrawAddr: withAddress.toString()
    }
    // console.log("add bind pbx info", info);
    return info
}
// 获取商城里的NFT信息
// async function getMarketNFT(coin){}
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
//获取所有 list 信息
async function getUserTokenList(coin, addr) {
    //pb==coin（"PBT"/"PBX"）
    const pb = coin2pb(coin)
    const cnt = await pb.balanceOf(addr)
    // console.log('user', addr, 'has', cnt, 'tokens')
    const list = {}
    for (var i = 0; i < cnt; i++) {
        // 获取 NFT 基础信息 object--key为nftID，value 为 nftInfo

        const idx = await pb.tokenOfOwnerByIndex(addr, i) // idx:BigNumber
        const info = await getNFTinfo(coin, idx)
        const key = idx.toString()
        // console.log("idx", idx)
        //获取商城里的NFT
        if (addr == bsc.ctrs.pbmarket.address) {
            const sinfo = await bsc.ctrs.pbmarket.getSaleInfo(pb.address, idx.toNumber())
            // console.log("sinfo", sinfo)
            info.priceToken = sinfo[0]
            info.ptName = priceName(sinfo[0])
            info.price = ethers.utils.formatEther(sinfo[1])
            info.desc = sinfo[2]
            info.seller = sinfo[3]
            info.owner = 'market'
        }
        //获取 PBT 与 PBX 的绑定信息 pbxs{coinTypes：{id：”“，coinTypes:"",depositAddr:"",withdrawAddr:""}}
        if (pb == bsc.ctrs.pbt) {
            if ('id' in info) {
                const pbxs = await bsc.ctrs.pbconnect.PBXList(idx)

                if (pbxs.length > 0) {
                    const bindlist = {}
                    const cointype = await getCoinTypes(pbxs.toString())
                    const coinTy = cointype.toString()
                    const bindXinfo = await getPBXInfo(idx.toNumber(), pbxs)
                    bindlist[coinTy] = bindXinfo
                    info.pbxs = bindlist
                }
            }
        }
        list[key] = info
        console.log("get user list", list)
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
    console.log("PBT/PBX list =", PBTList, PBXList)
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
        const slist = PBTList.selling
        const slistKeys = Object.keys(slist)
        console.log("obj.key", slistKeys)

        for (let i in slistKeys) {
            console.log("object", slistKeys[i], slist[slistKeys[i]])
            if (slist[slistKeys[i]].seller == "-self") {
                const key = slist[slistKeys[i]].id.toString()
                console.log("key", key)
                msList[key] = slist[slistKeys[i]]
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
    getBsc: getBsc,
    connectW: connectW,
    getMyTokenList: getMyTokenList,
    getSaleList: getSaleList,
    getMySaleList: getMySaleList,
    pbInList: pbInList,
    getNFTinfo: getNFTinfo,
}