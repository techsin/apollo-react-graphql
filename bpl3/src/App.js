import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql, useMutation } from '@apollo/client';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GetAuhtors/>
      </header>
    </div>
  );
}

const GET_AUTHORS = gql`
  {
    authors {
      id
      name
      books
    }
  }
`;

const CHANGE_NAME = gql`
  mutation AuthorUpdate($id: Int!, $name: String!) {
    changeName(id: $id, name: $name) {
      id
      name
    }
  }
`;


function GetAuhtors() {
  const { loading, error, data } = useQuery(GET_AUTHORS);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;



  return data.authors.map(({ name, books, id }) => (
      <AuthorEle name={name} books={books} id={id}/>
  ));
}

function AuthorEle({name, books, id}) {
    const {inputName, setName} = useState(name);
    const [addTodo, { data }] = useMutation(CHANGE_NAME);

    const handleClick = () => {
       addTodo(id, inputName);
       setName('');
    }

    return (
    <div key={name}>
      <p>
        {name}: {books}
      </p>
      <input value={inputName} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleClick} />
    </div>
    );

}

export default App;
