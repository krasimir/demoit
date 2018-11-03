import React, {useState, useRef} from 'react'

function Login({submit, children}) {
  const username = useRef(null)
  const password = useRef(null)
  const [valid, setValidity] = useState(null)
  const [pending, setPending] = useState(false)
  const handleSubmit = () => {
    if (username.current.value !== '' && password.current.value !== '') {
      setValidity(true)
      setPending(true)
      submit(username.current.value, password.current.value)
    } else {
      setValidity(false)
    }
  }

  return children(
    pending,
    valid,
    handleSubmit,
    <input placeholder="username" ref={username} />,
    <input placeholder="password" ref={password} type="password" />,
  )
}

export default function LoginForm({submit}) {
  return (
    <Login submit={submit}>
      {(pending, valid, handleSubmit, input, password) =>
        pending ? (
          <p>Logging in ...</p>
        ) : (
          <div>
            {valid === false && <p>Please fill all the fields!</p>}
            <label>Username: {input}</label>
            <label>Password: {password}</label>
            <button onClick={handleSubmit}>login</button>
          </div>
        )
      }
    </Login>
  )
}

/*
export default function LoginForm({submit}) {
  const username = useRef(null)
  const password = useRef(null)
  const [valid, setValidity] = useState(null)
  const [pending, setPending] = useState(false)
  const handleSubmit = () => {
    if (username.current.value !== '' && password.current.value !== '') {
      setValidity(true)
      setPending(true)
      submit(username.current.value, password.current.value)
    } else {
      setValidity(false)
    }
  }

  if (pending) {
    return <p>Logging in ...</p>
  }

  return (
    <div>
      {valid === false && <p>Please fill all the fields!</p>}
      <label>
        Username:
        <input placeholder="username" ref={username} />
      </label>
      <label>
        Password
        <input placeholder="password" ref={password} type="password" />
      </label>
      <button onClick={handleSubmit}>login</button>
    </div>
  )
}
*/
