const App = function () {
  const [ count, change ] = useState(0);
  
  return (
  	<section>
      <h1>Counter: { count }</h1>
      <button onClick={ () => change(count + 1) }>
        Click me
      </button>
    </section>
  )
}

ReactDom.render(<App />, document.querySelector('.output'));