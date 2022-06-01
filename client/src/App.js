import React from 'react';
import { ApolloProvider, ApolloClient, InMemeryCache, createHttpLink } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import { create } from 'lodash';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',

});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemeryCache(),
});

function App() {
  return (
    <ApolloProvider>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
