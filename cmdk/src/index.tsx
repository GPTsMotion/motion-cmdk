import { Empty, List, Loading } from './components/list'
import { Input } from './components/input'
import { Separator } from './components/separator'
import { Group } from './components/group'
import { Item } from './components/item'
import { Dialog } from './components/dialog'
import { Command } from './components/command'

const pkg = Object.assign(Command, {
  List,
  Item,
  Input,
  Group,
  Separator,
  Dialog,
  Empty,
  Loading,
})

export { pkg as Command }
