// React hooks: using `useState`

const useState = React.useState;
const App = function () {
  const [ count, change ] = useState(0);
  
  return (
  	<section>
      <button onClick={ () => change(count + 1) }>
        Click me
      </button>
      <p>{ count }</p>
    </section>
  )
}