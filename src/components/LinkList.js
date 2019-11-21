import React from "react";
import Link from "./Link";
import { useQuery } from "urql";
import gql from "graphql-tag";

// const linksToRender = [
//   {
//     id: "1",
//     description: "Prisma turns your database into a GraphQL API 😎",
//     url: "https://www.prismagraphql.com"
//   },
//   {
//     id: "2",
//     description: "The best GraphQL client",
//     url: "https://formidable.com/open-source/urql/"
//   }
// ];

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const LinkList = () => {
  const [result] = useQuery({ query: FEED_QUERY });
  console.log("RES", result);
  const { data, fetching, error } = result;
  console.log("DATA", data);
  if (fetching) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  const linksToRender = data.feed.links;

  return (
    <div>
      {linksToRender.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};

export default LinkList;
