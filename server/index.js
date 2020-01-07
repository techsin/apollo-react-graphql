// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });

// app.post('/api/world', (req, res) => {
//   console.log(req.body);
//   res.send(
//     `I received your POST request. This is what you sent me: ${req.body.post}`,
//   );
// });

// app.listen(port, () => console.log(`Listening on port ${port}`));


const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: Author
  }

  type Author {
  	id: ID
    name: String
    books: Int
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    authors: [Author!]!
  }

  type Mutation {
  	changeName(id: Int!, name: String!): Author
  }
`;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 1,
  },
  {
    title: 'BOOK OF THE YEAR',
    author: 1,
  },
  {
    title: 'Jurassic Park',
    author: 2,
  },
];

const authors = [
{
	id:1, name: 'abc'
},
{
	id: 2, name: 'xyz'
}
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors.map(({name, id}) => {
    	return {name: name, books: books.filter(x => x.author == id).length}
    })
  },
  Mutation: {
  	changeName: async (_ , {id, name}, {dataSources}) => {
  		authors.find(x => x.id == id).name = name;
  		return authors.find(x => x.id == id);
  	}
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, tracing: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});