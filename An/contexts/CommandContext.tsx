import { createContext, useContext } from 'react'
import type { Command } from '../types'

interface CommandContextType {
  executeCommand: (command: Command) => void
}

export const CommandContext = createContext<CommandContextType>({
  executeCommand: () => {},
})

export const useCommand = () => useContext(CommandContext)