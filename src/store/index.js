import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: {},
        mcoin: "XCH",
        bcoin: "PBT",
        baddr: false,
        curNFT: {},
        NFTinfo: false,
        allow: -1,
        PBTlists: {},
        PBXlists: {},
        PBTSellingLists: {},
        PBXSellingLists: {},
        PBTMySaleLists: {},
        PBXMySaleLists: {},
        WBalance: 0,
        redeemBalance: "0",
        redeemAllowance: "0"
    },
    mutations: {
        setBsc(state, bsc) {
            state.bsc = bsc
        },
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setBalance(state, balance) {
            state.balance = balance
        },
        setBcoin(state, coin) {
            state.bcoin = coin
        },
        setMcoin(state, coin) {
            state.mcoin = coin
        },
        setCurNFT(state, curNFT) {
            state.curNFT = curNFT
        },
        setNFTinfo(state, boolean) {
            state.NFTinfo = boolean
        },
        setAllow(state, allow) {
            state.allow = allow
        },
        setPBTSellingLists(state, list) {
            state.PBTSellingLists = list
        },
        setPBXSellingLists(state, list) {
            state.PBXSellingLists = list
        },
        setPBTlists(state, list) {
            // generate MySale, Market, MyBag lists
            state.PBTlists = list
        },
        setPBXlists(state, list) {
            // generate MySale, Market, MyBag lists
            state.PBXlists = list
        },
        setPBTMySaleLists(state, list) {
            state.PBTMySaleLists = list
        },
        setPBXMySaleLists(state, list) {
            state.PBXMySaleLists = list
        },
        setRedeemBalance(state, balance) {
            state.redeemBalance = balance
        },
        setRedeemAllowance(state, allowance) {
            state.redeemAllowance = allowance
        },
        setWBalance(state, balance) {
            state.WBalance = balance
        }
    },
    actions: {},
    modules: {}
})