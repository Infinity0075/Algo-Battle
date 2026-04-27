import { useContext } from 'react'
import BattleContext from './BattleContextCore'

export const useBattle = () => useContext(BattleContext)
