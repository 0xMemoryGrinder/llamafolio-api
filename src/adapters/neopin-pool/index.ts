import type { Adapter } from '@lib/adapter'

import * as ethereum from './ethereum'
import * as polygon from './polygon'

const adapter: Adapter = {
  id: 'neopin-pool',
  ethereum: ethereum,
  polygon: polygon,
}

export default adapter
