import * as http from 'http'
import * as express from 'express'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { timeBasedGuid } from './utils'

const isTest = process.env.NODE_ENV === 'test'
const port = process.env.PORT || 4000
export const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(express.static(resolve(__dirname, '..', 'public')))

app.get('/guid', (req, res) => {
  res.json(timeBasedGuid())
})

app.post('/data', (req, res, next) => {
  try {
    res.send(req.body)
  } catch (e) {
    next(e)
  }
})

app.get('/params-example/:anything', (req, res) => {
  res.json(req.params.anything)
})

const server = http.createServer(app)

const main = () => {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`example listening on ${port}`)
  })

  // Docker gives containers 10 seconds to handle SIGTERM
  // before sending SIGKILL. Close all current connections
  // graceully and exit with 0.
  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0)
    })
  })
}

if (!isTest) {
  main()
}
