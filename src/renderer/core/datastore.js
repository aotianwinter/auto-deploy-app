import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export const serverDB = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/server.db')
})

export const instanceDB = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/instance.db')
})
