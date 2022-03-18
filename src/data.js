import market from "./market";
import {
    ethers
} from "ethers";
import pbwallet from "pbwallet"
import keeper from "pbweb-nftkeeper";
let bsc = {}
let myList = {}
let marketList = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
}

const tokenDecimals = {}

async function connect(commit) {
    bsc = await market.connect(commit)
    console.log("bsc in connect", bsc)
    if (bsc) {
        commit("setBsc", bsc)
        // keeper.startKeeper(bsc, commit, marketList, myList)
        // const cnt = await keeper.preload(bsc, commit, myList)
        // console.log('user owns', cnt.toString(), 'PBT')
        return bsc
    }
    return false
}

async function tokenSymbol(ctraddr) {
    ctraddr = ethers.utils.getAddress(ctraddr)
    for (var k in ptAddrs) {
        if (ethers.utils.getAddress(ptAddrs[k]) == ctraddr) {
            return k
        }
    }
    const symbol = await pbwallet.erc20_contract(ctraddr).symbol()
    ptAddrs[symbol] = ctraddr
    return symbol
}

async function formatToken(ctraddr, val) {
    ctraddr = ethers.utils.getAddress(ctraddr)
    if (ctraddr == ethers.constants.AddressZero) {
        return ethers.utils.formatUnits(val)
    }
    if (!(ctraddr in tokenDecimals)) {
        tokenDecimals[ctraddr] = await pbwallet.erc20_contract(ctraddr).decimals()
    }
    return ethers.utils.formatUnits(val, tokenDecimals[ctraddr])
}

function fix_uri(uri) {
    if (uri.startsWith('ipfs:')) {
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else {
        return uri
    }
}
async function getCoinTypes(pid) {
    const id = ethers.BigNumber.from(pid)
    const cointype = await bsc.ctrs.pbpuzzlehash.pbtCoinTypes(id)
    return cointype
}
async function nftBriefInfo(id) {
    console.log("id", id, id.toNumber())
    const uri = await bsc.ctrs.pbt.tokenURI(id.toNumber())
    const meta = await fetch(fix_uri(uri))
    const img = await meta.json()
    meta['image'] = await fix_uri(String(img.image))
    const info = {
        id: id.toNumber(),
        uri: uri,
        meta: meta,
    }
    return info
}
async function loadMarketinfo(id) {
    const pbt = bsc.ctrs.pbt
    const sinfo = await bsc.ctrs.pbmarket.getSaleInfo(pbt.address, Number(id))
    const info = {}
    info.priceToken = sinfo[0]
    info.ptName = await tokenSymbol(sinfo[0])
    info.price = await formatToken(sinfo[0], sinfo[1])
    info.desc = sinfo[2]
    info.seller = sinfo[3]
    info.owner = 'market'
    return info
}

async function loadPbxs(pbtid) {
    const cointy = await getCoinTypes(pbtid)
    const pbxs = {}
    for (var i = 0; i < cointy.length; i++) {
        const ct = parseInt(cointy[i])
        const winfo = pbwallet.wcoin_info(ct)
        console.log("winfo", winfo)
        const xAddress = await bsc.ctrs.pbpuzzlehash.pbtPuzzleHash(pbtid, ct)
        const depAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[0]), winfo.prefix)
        const withAddress = window.ChiaUtils.puzzle_hash_to_address(String(xAddress[1]), winfo.prefix)
        const addrInfo = {
            depositAddr: String(depAddress),
            withdrawAddr: String(withAddress)
        }
        pbxs[String(ct)] = addrInfo
    }
    return pbxs
}

async function loadlist_brief(addr) {
    console.log("bsc in loadlist_b", bsc)
    const cnt = await bsc.ctrs.pbt.balanceOf(addr)
    const briefList = {}
    for (let i = 0; i < cnt; i++) {
        const idx = await bsc.ctrs.pbt.tokenOfOwnerByIndex(addr, i)
        console.log("idx", idx)
        const info = await nftBriefInfo(idx)
        const key = String(idx)
        briefList[key] = info
    }
    return briefList
}
async function loadMyList_brief(store) {
    myList = await loadlist_brief(bsc.addr)
    store.commit("setMylist", myList)
    return myList
}
async function loadMarketList_brief(store) {
    marketList = await loadlist_brief(bsc.ctrs.pbmarket.address)
    store.commit("setMarketlist", marketList)
    return marketList
}


async function loadUserlist_detail(store, myList) { //只读一个
    const current = store.state.current
    if (current.pbtId in myList) {
        const id = String(current.pbtId)
        if (!('pbxs' in myList[id])) {
            myList[id]['pbxs'] = await loadPbxs(id)
            console.log("myList__D", myList)
            return myList
        }
    }
    for (let i in myList) {
        if ('pbxs' in myList[i]) continue
        myList[i]['pbxs'] = await loadPbxs(i)
        console.log("myList__D", myList)
        return myList
    }
    return false
}
async function loadMarketlistDetail(store, marketList) {
    const current = store.state.current
    if (current.pbtId in marketList) {
        const id = String(current.pbtId)
        if (!('market' in marketList[id])) {
            marketList[id]['market'] = await loadMarketinfo(id)
            console.log("marketlist__D", marketList)
            return marketList
        }
    }
    for (let i in marketList) {
        if ('market' in marketList[i]) continue
        marketList[i]['market'] = await loadMarketinfo(i)
        console.log("marketlist__D", marketList)
        return marketList
    }
    return false
}

async function loadmylist_detail(myList, store) {
    while (true) {
        myList = await loadUserlist_detail(store, myList)
        if (!myList) {
            break
        }
        console.log("myList__D in load_d", myList)

        store.commit("setMylist", myList)
    }
}
async function loadmarketlist_detail(marketList, store) {
    while (true) {
        marketList = await loadMarketlistDetail(store, marketList)
        if (!marketList) {
            break
        }
        let mklist_useful = {}
        let mySaleList = {}
        for (let i in marketList) {
            if ('market' in marketList[i]) {
                if (marketList[i].market['price'] != '0.0') {
                    mklist_useful[i] = marketList[i]
                }
                console.log("list", mklist_useful)
            }
        }
        for (let i in marketList) {
            if ('market' in marketList[i]) {
                if (marketList[i].market['seller'] == '-self') {
                    mySaleList[i] = marketList[i]
                }
            }
        }
        console.log("loadMarketlist_datail-list_useful = ", mklist_useful, mySaleList)
        store.commit("setMarketlist", mklist_useful)
        store.commit("setMySalelist", mySaleList)
    }
}

async function loadAlllists_brief(store) {
    await loadMyList_brief(store)
    await loadMarketList_brief(store)
}
async function loadAlllists_detail(store) {
    await loadmarketlist_detail(marketList, store)
    await loadmylist_detail(myList, store)
    const commit = store.commit
    keeper.startKeeper(bsc, commit, marketList, myList)
    // const cnt = await keeper.preload(commit, myList)
    // console.log('user owns', cnt.toString(), 'PBT')

}
export default {
    loadAlllists_brief: loadAlllists_brief,
    loadAlllists_detail: loadAlllists_detail,
    connect: connect
}