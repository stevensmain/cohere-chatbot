import React, { useEffect, useRef, useState } from 'react'
import { EXAMPLES } from './mock/examples'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState<string>('')
  const container = useRef<HTMLUListElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const DOMAIN = import.meta.env.VITE_COHERE_DOMAIN as string
    const ENDPOINT_CLASSIFY = import.meta.env.VITE_ENDPOINT_CLASSIFY as string
    const API_KEY = import.meta.env.VITE_API_KEY as string

    setMessages((messages) =>
      messages.concat({ id: String(Date.now()), type: 'user', text: question })
    )

    fetch(DOMAIN + ENDPOINT_CLASSIFY, {
      method: 'POST',
      headers: {
        Authorization: `BEARER ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'embed-english-v2.0',
        inputs: [question],
        examples: EXAMPLES
      })
    })
      .then((response) => response.json())
      .then(({ classifications }) => {
        const prediction = classifications[0].prediction
        const id = String(Date.now())

        setMessages((messages) =>
          messages.concat({ id, type: 'bot', text: prediction })
        )
      })
      .finally(() => setQuestion(''))
      .catch((error) => {
        console.log(error)
        throw new Error(error)
      })
  }

  useEffect(() => {
    container.current?.scrollTo({
      behavior: 'smooth',
      top: container.current?.scrollHeight
    })
  }, [messages])

  return (
    <>
      <header className="w-full flex py-5 px-10">
        <h1 className="text-xl tracking-wider font-semibold">
          Co:here Chatbot
        </h1>
      </header>
      <main>
        <div className="flex flex-col gap-4 max-w-xl mx-auto border border-gray-400 p-4 rounded-sm">
          <ul
            className="flex flex-col gap-3 h-[300px] overflow-y-auto"
            ref={container}
          >
            {messages.map((message) => (
              <li
                key={message.id}
                className={`${
                  message.type === 'bot'
                    ? 'bg-slate-500 text-left self-start rounded-bl-none'
                    : 'bg-blue-500 text-right self-end rounded-br-none'
                } rounded-2xl p-3 w-fit max-w-[80%]`}
              >
                <p className="text-base text-white">{message.text}</p>
              </li>
            ))}
          </ul>
          <form className="flex items-center" onSubmit={handleSubmit}>
            <input
              className="border border-gray-400 py-2 px-4 flex-1 rounded-lg rounded-r-none"
              type="text"
              placeholder="Hacer una pregunta"
              onChange={(event) => setQuestion(event.target.value)}
              value={question}
            />
            <button className="px-4 py-2 border border-blue-500 bg-blue-500 rounded-lg rounded-l-none">
              Enviar
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default App
