import * as React from 'react'
import { Context, Group, Store } from './type'

export const CommandContext = React.createContext<Context>(undefined)
export const StoreContext = React.createContext<Store>(undefined)
export const GroupContext = React.createContext<Group>(undefined)

export const useCommand = () => React.useContext(CommandContext)
export const useStore = () => React.useContext(StoreContext)
