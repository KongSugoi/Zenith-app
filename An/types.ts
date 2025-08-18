export type Command =
  | { action: 'SET_CALENDAR'; params?: { date?: string } }
  | { action: 'SHOW_HEALTH_STATS' }

export interface AIResponse {
  reply: string
  command?: Command | null
}