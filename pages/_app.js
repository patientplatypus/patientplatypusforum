import App, { Container } from "next/app";
import { Provider } from "../services";

import '../styles/root.css'

class MainApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className='mainBody'>
        <Container>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </Container>
      </div>
    );
  }
}

export default MainApp;