let orbitInstance
let isLoading = false
const resolverQueue = []

async function initOrbit() {
  console.log('Starting IPFS')
  isLoading = true

  const ipfs = new global.Ipfs({
    repo: '/vitriol/',
    EXPERIMENTAL: { pubsub: true },
    config: {
      Addresses: {
        Swarm: [
          // Use IPFS dev signal server
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          '/dns4/star-signal.cloud.ipfs.team/udp/443/wss/p2p-webrtc-star',
          // Use local signal server
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        ]
      },
    },
    start: true
  })

  ipfs.on('error', (e) => {
    console.error(e)
    consumeQueue(e)
  })

  ipfs.on('ready', async () => {
    console.info("IPFS Started")

    const orbitdb = new global.OrbitDB(ipfs)
    const access = {
      // Give write access to ourselves
      write: [orbitdb.key.getPublic('hex')]
    }
    orbitInstance = { orbitdb, access, ipfs }
    consumeQueue(null, orbitInstance)
  })
}

function consumeQueue(e, instance) {
  for (const resolver of resolverQueue) {
    resolver(e, instance)
  }
}

async function createOrbit(cb) {
  if (orbitInstance) cb(null, orbitInstance)
  if (!isLoading) initOrbit()
  resolverQueue.push(cb)
}

function getOrbit() {
  return new Promise((resolve, reject) => createOrbit((e, instance) => e ? reject(e) : resolve(instance)))
}

export default getOrbit