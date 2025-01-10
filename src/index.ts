import axios from 'axios'
import type {
    AddressBookEntry,
    AccountStatesResponse,
    MetadataEntry,
    WalletSatesResponse,
    ActionsResponse,
    TracesResponse,
    AddressInformationResponse,
    WalletInformationResponse,
    EstimateFeeResponse,
    RunMethodResponse,
    AdjacentTransactionsResponse,
    BlocksResponse,
    MasterchainInfoResponse,
    MessagesResponse,
    TransactionsResponse,
    JettonBurnsResponse,
    JettonMastersResponse,
    JettonTransfersResponse,
    JettonWalletsResponse,
    NftCollectionsResponse,
    NftItemsResponse,
    NftTransfersResponse
} from './response'
import type {
    EstimateFeeRequest,
    RunMethodRequest,
    ActionsRequest,
    BlocksRequest,
    JettonBurnsRequest,
    JettonMastersRequest,
    MessagesRequest,
    TracesRequest,
    TransactionsByMasterchainRequest,
    TransactionsByMessageRequest,
    TransactionsRequest,
    JettonTransfersRequest,
    JettonWalletsRequest,
    NftCollectionsRequest,
    NftItemsRequest,
    NftTransfersRequest
} from './request'

export default class TonCenterV3 {
    private readonly mainnetApi = 'https://toncenter.com/api/v3/'

    private readonly testnetApi = 'https://testnet.toncenter.com/api/v3/'

    private readonly api: URL

    private readonly apiKey: string

    constructor(config: { apiKey: string; testnet?: boolean }) {
        if (!config.apiKey) {
            throw new Error('API key is required')
        }

        this.api = new URL(config.testnet ? this.testnetApi : this.mainnetApi)

        this.apiKey = config.apiKey
    }

    private createEndpoint(path: string, payload?: Record<string, any>): URL {
        const endpoint = new URL(path, this.api)
        endpoint.searchParams.append('api_key', this.apiKey)
        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        endpoint.searchParams.append(key, item) // eslint-disable-line
                    })
                } else {
                    endpoint.searchParams.append(key, value) // eslint-disable-line
                }
            })
        }
        return endpoint
    }

    async getAccountStates(
        addresses: string[],
        includeBoc: boolean = true
    ): Promise<AccountStatesResponse> {
        const endpoint = this.createEndpoint('accountStates')

        addresses.forEach((address) => {
            endpoint.searchParams.append('address', address)
        })

        endpoint.searchParams.append('include_boc', includeBoc.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getAddressBook(addresses: string[]): Promise<Record<string, AddressBookEntry>> {
        const endpoint = this.createEndpoint('addressBook')

        addresses.forEach((address) => {
            endpoint.searchParams.append('address', address)
        })

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getMetadata(addresses: string[]): Promise<Record<string, MetadataEntry>> {
        const endpoint = this.createEndpoint('metadata')

        addresses.forEach((address) => {
            endpoint.searchParams.append('address', address)
        })

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getWalletStates(addresses: string[]): Promise<WalletSatesResponse> {
        const endpoint = this.createEndpoint('walletStates')

        addresses.forEach((address) => {
            endpoint.searchParams.append('address', address)
        })

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getActions(
        payload: ActionsRequest = {
            limit: 10,
            offset: 0
        }
    ): Promise<ActionsResponse> {
        const endpoint = this.createEndpoint('actions', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getTraces(
        payload: TracesRequest = {
            limit: 10,
            offset: 0
        }
    ): Promise<TracesResponse> {
        const endpoint = this.createEndpoint('traces', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getAddressInformation(
        address: string,
        useV2: boolean = true
    ): Promise<AddressInformationResponse> {
        const endpoint = this.createEndpoint('addressInformation')

        endpoint.searchParams.append('address', address)
        endpoint.searchParams.append('use_v2', useV2.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getWalletInformation(
        address: string,
        useV2: boolean = true
    ): Promise<WalletInformationResponse> {
        const endpoint = this.createEndpoint('walletInformation')

        endpoint.searchParams.append('address', address)
        endpoint.searchParams.append('use_v2', useV2.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async estimateFee(payload: EstimateFeeRequest): Promise<EstimateFeeResponse> {
        const endpoint = this.createEndpoint('estimateFee')

        const response = await axios.post(endpoint.toString(), payload).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async message(boc: string): Promise<{ message_hash: string }> {
        const endpoint = this.createEndpoint('message')

        const response = await axios.post(endpoint.toString(), { boc }).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async runGetMethod(payload: RunMethodRequest): Promise<RunMethodResponse> {
        const endpoint = this.createEndpoint('runGetMethod')

        const response = await axios.post(endpoint.toString(), payload).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getAdjacentTransactions(
        hash: string,
        direction?: 'in' | 'out'
    ): Promise<AdjacentTransactionsResponse> {
        const endpoint = this.createEndpoint('adjacentTransactions')

        endpoint.searchParams.append('hash', hash)

        if (direction) {
            endpoint.searchParams.append('direction', direction)
        }

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getBlocks(payload: BlocksRequest): Promise<BlocksResponse> {
        const endpoint = this.createEndpoint('blocks', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getMasterchainBlockShardState(seqno: number): Promise<BlocksResponse> {
        const endpoint = this.createEndpoint('masterchainBlockShardState')

        endpoint.searchParams.append('seqno', seqno.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getMasterchainBlockShards(
        seqno: number,
        limit = 10,
        offset = 0
    ): Promise<BlocksResponse> {
        const endpoint = this.createEndpoint('masterchainBlockShards')

        endpoint.searchParams.append('seqno', seqno.toString())
        endpoint.searchParams.append('limit', limit.toString())
        endpoint.searchParams.append('offset', offset.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getMasterchainInfo(): Promise<MasterchainInfoResponse> {
        const endpoint = this.createEndpoint('masterchainInfo')

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getMessages(payload: MessagesRequest): Promise<MessagesResponse> {
        const endpoint = this.createEndpoint('messages', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getTransactions(payload: TransactionsRequest): Promise<TransactionsResponse> {
        const endpoint = this.createEndpoint('transactions', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getTransactionsByMasterchainBlock(
        payload: TransactionsByMasterchainRequest
    ): Promise<TransactionsResponse> {
        const endpoint = this.createEndpoint('transactionsByMasterchainBlock', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getTransactionsByMessage(
        payload: TransactionsByMessageRequest
    ): Promise<TransactionsResponse> {
        const endpoint = this.createEndpoint('transactionsByMessage', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getJettonBurns(payload: JettonBurnsRequest): Promise<JettonBurnsResponse> {
        const endpoint = this.createEndpoint('jetton/burns', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getJettonMasters(payload: JettonMastersRequest): Promise<JettonMastersResponse> {
        const endpoint = this.createEndpoint('jetton/masters', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getJettonTransfers(payload: JettonTransfersRequest): Promise<JettonTransfersResponse> {
        const endpoint = this.createEndpoint('jetton/transfers', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getJettonWallets(payload: JettonWalletsRequest): Promise<JettonWalletsResponse> {
        const endpoint = this.createEndpoint('jetton/wallets', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getNftCollections(payload: NftCollectionsRequest): Promise<NftCollectionsResponse> {
        const endpoint = this.createEndpoint('nft/collections', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getNftItems(payload: NftItemsRequest): Promise<NftItemsResponse> {
        const endpoint = this.createEndpoint('nft/items', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getNftTransfers(payload: NftTransfersRequest): Promise<NftTransfersResponse> {
        const endpoint = this.createEndpoint('nft/transfers', payload)

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }

    async getTopAccountsByBalance(
        limit = 10,
        offset = 0
    ): Promise<
        Array<{
            account: string
            balance: string
        }>
    > {
        const endpoint = this.createEndpoint('topAccountsByBalance')

        endpoint.searchParams.append('limit', limit.toString())
        endpoint.searchParams.append('offset', offset.toString())

        const response = await axios.get(endpoint.toString()).then((res) => res.data)

        if ('error' in response) {
            throw new Error(response.error as string)
        }

        return response
    }
}
