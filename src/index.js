import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

import {
  Provider,
  Client,
  dedupExchange,
  fetchExchange,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { cacheExchange } from "@urql/exchange-graphcache";
import { FEED_QUERY } from "./components/LinkList";
import { getToken } from "./token";

const cache = cacheExchange({
  updates: {
    Mutation: {
      post: ({ post }, _args, cache) => {
        const variables = { first: 10, skip: 0, orderBy: "createdAt_DESC" };
        cache.updateQuery({ query: FEED_QUERY, variables }, data => {
          if (data !== null) {
            data.feed.links.unshift(post);
            data.feed.count++;
            return data;
          } else {
            return null;
          }
        });
      }
    },
    Subscription: {
      newLink: ({ newLink }, _args, cache) => {
        const variables = { first: 10, skip: 0, orderBy: "createdAt_DESC" };
        cache.updateQuery({ query: FEED_QUERY, variables }, data => {
          if (data !== null) {
            data.feed.links.unshift(newLink);
            data.feed.count++;
            return data;
          } else {
            return null;
          }
        });
      }
    }
  }
});

const subscriptionClient = new SubscriptionClient("ws://localhost:4000", {
  reconnect: true,
  connectionParams: {
    authToken: getToken()
  }
});

const client = new Client({
  url: "http://localhost:4000",
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" }
    };
  },
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

ReactDOM.render(
  <BrowserRouter>
    <Provider value={client}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
