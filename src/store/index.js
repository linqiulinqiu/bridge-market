import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: {},
        bcoin: "XCC",
        mcoin: "PBT",
        baddr: false,
        current: {},
        NFTinfo: false,
        allow: -1,
        myList: {},
        marketList: {},
        mySaleList: {},
        WBalance: 0,
        redeemBalance: "0",
        redeemAllowance: "0",
        mode: '', //bridge or market
        bridgeVisible: false
    },
    mutations: {
        setBsc(state, bsc) {
            state.bsc = bsc
        },
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setBalance(state, balance) {
            state.WBalance = balance
        },
        setCurrent(state, cur) {
            state.current = cur
        },
        setCurrentPbtId(state, pbtId) {
            if (pbtId != state.current.pbtId) {
                state.current.pbtId = pbtId
                state.current = Object.assign({}, state.current);
            }
        },
        setCurrentCoinType(state, coinType) {
            if (coinType != state.current.coinType) {
                state.current.coinType = coinType
                state.current = Object.assign({}, state.current);
            }
        },
        setBcoin(state, bsccoin) {
            state.bcoin = bsccoin
        },
        setMcoin(state, marketcoin) {
            state.mcoin = marketcoin
        },
        setMode(state, mode) {
            state.mode = mode
        },
        setNFTinfo(state, boolean) {
            state.NFTinfo = boolean
        },
        setAllow(state, allow) {
            state.allow = allow
        },
        setMylist(state, list) {
            state.myList = list
        },
        setMarketlist(state, list) {
            // generate MySale, Market, MyBag lists
            state.marketList = list
        },
        setMySalelist(state, list) {
            state.mySaleList = list
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