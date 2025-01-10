import { AxiosError } from 'axios'
import TonCenterV3 from '../src/index'

const apiKey = '0a804e1153b5dec04715342789d68c219845e3f1336da822399d7b180a5b5533'

const client = new TonCenterV3({
    apiKey,
    testnet: true
})

const token = 'kQAIyxof6tfnDvBw5KC-bfUGF3JtkzkHR4cfFB49Ik-FV3RW'
const address = '0QCDEJc7FGObqxBSqgKi4MMysr12FNEXP5WtfJhTU7DXlSHC'
const txHash = '0fedc726e2e9d2d3c4894d5decd6ffbbea9b68ef3f54fe0debc02d3617c6ec62'
const nftCollection = 'kQDNnL2Fi4TqcKiF0i2aeYMwHIhMR_AWqrG7WSkDph0mmL_S'
const nftId = 'kQDiYpnHCz8lP2yHtE0ePShy1dZtlOEZJOr4omdZ_zDOCMD7'

describe('TonCenterV3', () => {
    test('getBalance', async () => {
        const response = await client.getAccountStates([address])
        expect(response.accounts[0].balance).toEqual('99999986')
    })

    test('getAddressBook', async () => {
        const response = await client.getAddressBook([address])
        expect(response[address].user_friendly).toEqual(address)
    })

    test('getMetadata', async () => {
        const response = await client.getMetadata([address])
        expect(response.metadata).not.toBeNull()
    })

    test('getWalletStates', async () => {
        const response = await client.getWalletStates([address])
        expect(response.wallets[0].balance).toEqual('99999986')
    })

    test('getActions', async () => {
        const response = await client.getActions({ tx_hash: [txHash] })
        expect(response.actions[0].type).toEqual('ton_transfer')
    })

    test('getTraces', async () => {
        const response = await client.getTraces({ tx_hash: [txHash] })
        expect(response.traces[0].trace_id).toEqual('D+3HJuLp0tPEiU1d7Nb/u+qbaO8/VP4N68AtNhfG7GI=')
    })

    test('getAddressInformation', async () => {
        const response = await client.getAddressInformation(address)
        expect(response.balance).toEqual('99999986')
    })

    test('getWalletInformation', async () => {
        const response = await client.getWalletInformation(address)
        expect(response.last_transaction_lt).toEqual('29985040000001')
    })

    test('estimateFee', async () => {
        try {
            await client.estimateFee({
                address,
                body: 'test',
                ignore_chksig: true,
                init_code: 'test',
                init_data: 'test'
            })
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>
            expect(error.response?.data.error).toContain('INVALID_BAG_OF_CELLS')
        }
    })

    test('message', async () => {
        try {
            await client.message('string')
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>
            expect(error.response?.data.error).toContain('Incorrect padding')
        }
    })

    test('runMethod', async () => {
        try {
            await client.runGetMethod({
                address,
                method: 'test',
                stack: [{ type: 'test', value: 'test' }]
            })
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>
            expect(error.response?.data.error).toContain('unsupported stack parameter type: test')
        }
    })

    test('getAdjacentTransactions', async () => {
        const response = await client.getAdjacentTransactions(txHash)
        expect(response.transactions[0].trace_id).toEqual(
            'D+3HJuLp0tPEiU1d7Nb/u+qbaO8/VP4N68AtNhfG7GI='
        )
    })

    test('getBlocks', async () => {
        const response = await client.getBlocks({ mc_seqno: 2685560 })
        expect(response.blocks[0].file_hash).toEqual('hhL5aRRs3IX+eoD99I/XAwLm9p32pd4tqHH0N2G9cp0=')
    })

    test('getMasterchainBlockShardState', async () => {
        const response = await client.getMasterchainBlockShardState(2685560)
        expect(response.blocks[0].file_hash).toEqual('hhL5aRRs3IX+eoD99I/XAwLm9p32pd4tqHH0N2G9cp0=')
    })

    test('getMasterchainBlockShards', async () => {
        const response = await client.getMasterchainBlockShards(2685560)
        expect(response.blocks[0].file_hash).toEqual('hhL5aRRs3IX+eoD99I/XAwLm9p32pd4tqHH0N2G9cp0=')
    })

    test('getMasterchainInfo', async () => {
        const response = await client.getMasterchainInfo()
        expect(response.first.shard).toEqual('8000000000000000')
    })

    test('getMessages', async () => {
        const response = await client.getMessages({ destination: address })
        expect(response.messages[0].hash).toEqual('5qmcujlERDJiKcqehWChwAg9Oxv0BArU/fO84Lw33cg=')
    })

    test('getTransactions', async () => {
        const response = await client.getTransactions({ hash: txHash })
        expect(response.transactions[0].hash).toEqual(
            'D+3HJuLp0tPEiU1d7Nb/u+qbaO8/VP4N68AtNhfG7GI='
        )
    })

    test('getTransactionsByMasterchainBlock', async () => {
        const response = await client.getTransactionsByMasterchainBlock({ seqno: 2685560 })
        expect(response.transactions[0].hash).toEqual(
            'Fi2L3gt+CedVefQ1WhRaa9u2V0mimn89+jwNcVJr3iw='
        )
    })

    test('getTransactionsByMessage', async () => {
        const response = await client.getTransactionsByMessage({
            msg_hash: '5qmcujlERDJiKcqehWChwAg9Oxv0BArU/fO84Lw33cg='
        })
        expect(response.transactions[0].hash).toEqual(
            'SJazubHjNVuFMVH+sH2DRpOa+GIQxIESMeUnq9xdjrw='
        )
    })

    test('getJettonBurns', async () => {
        const response = await client.getJettonBurns({ address: [address] })
        expect(response.jetton_burns.length).toBe(0)
    })

    test('getJettonMasters', async () => {
        const response = await client.getJettonMasters({ address: [address] })
        expect(response.jetton_masters.length).toBe(0)
    })

    test('getJettonTransfers', async () => {
        const response = await client.getJettonTransfers({ owner_address: [address] })
        expect(response.jetton_transfers[0].query_id).toEqual('6083770388961033161')
    })

    test('getJettonWallets', async () => {
        const response = await client.getJettonWallets({
            jetton_address: token,
            owner_address: [address]
        })
        expect(response.jetton_wallets[0].balance).toEqual('100000000000')
    })

    test('getNftCollection', async () => {
        const response = await client.getNftCollections({ collection_address: [nftCollection] })
        expect(response.nft_collections[0].collection_content.uri).toEqual(
            'https://s.getgems.io/nft/c/677e3821c9af9379ef55f729/meta.json'
        )
    })

    test('getNftItems', async () => {
        const response = await client.getNftItems({ collection_address: nftCollection })
        expect(response.nft_items[0].content.uri).toEqual(
            'https://s.getgems.io/nft/c/677e3821c9af9379ef55f729/0/meta.json'
        )
    })

    test('getNftTransfers', async () => {
        const response = await client.getNftTransfers({
            collection_address: nftCollection,
            owner_address: [address],
            direction: 'in',
            item_address: [nftId]
        })
        expect(response.nft_transfers[0].trace_id).toEqual(
            'VMRFGQ1yuE6W2cKz5lh6et3RT2xp0gOwMawXLQ1a3+c='
        )
    })

    test('getTopAccountsByBalance', async () => {
        const response = await client.getTopAccountsByBalance()
        expect(response.length).toBeGreaterThan(0)
    })
})
