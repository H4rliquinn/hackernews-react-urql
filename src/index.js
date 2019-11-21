import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";

import { Provider, Client, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

const cache = cacheExchange({});

const client = new Client({
  url: "http://localhost:4000",
  exchanges: [dedupExchange, cache, fetchExchange]
});

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);
