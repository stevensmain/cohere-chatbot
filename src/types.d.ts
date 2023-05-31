interface Message {
  id: string
  type: 'bot' | 'user'
  text: string
}
