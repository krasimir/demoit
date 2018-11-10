const useEffect = React.useEffect;
const useState = React.useState;

const withAnswer = Component => function (props) {
  const [ answer, setAnswer ] = useState(null);
  
  useEffect(() => {
    setTimeout(() => setAnswer(42), 1000);
  }, []);
  
  return <Component {...props } answer={ answer }/>;
}

const WrappedTitle = withAnswer(function Title({ answer }) {
  return <h1>Answer: { answer ? answer : '...' }</h1>;
});
function Header() {
 	return <header><WrappedTitle /></header>; 
}
function App() {
  return <Header />;
}

ReactDOM.render(<App />, document.querySelector('.output'));