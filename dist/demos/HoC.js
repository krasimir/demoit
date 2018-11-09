// React higher-order component

var enhanceComponent = (Component) =>
  class Enhance extends React.Component {
    render() {
      return (
        <Component {...this.props} />
      )
    }
  };

var OriginalTitle = () => <h1>Hello world</h1>;
var EnhancedTitle = enhanceComponent(OriginalTitle);

class App extends React.Component {
  render() {
    return (
      <section>
	      <EnhancedTitle />
      </section>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('.output'));