import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { signUp, confirmSignUp, fetchUserAttributes } from "aws-amplify/auth";

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    fetchAttr();

  }, []);

  const fetchAttr = async () => {
    const attr = await fetchUserAttributes();
    console.log("attr", attr);
  }



  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: false });
  }


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  const createUser = async () => {

    const username = window.prompt("Enter username")
    const password = window.prompt("Enter password")

    if (!username || !password) throw new Error("No username or password");

    const response = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email: username,
          'custom:role': 'admin',
        }
      }
    });

    if (response.userId) {
      confirmUserSignUp(username);
    }
  }


  const confirmUserSignUp = async (username: string) => {

    const confirmationCode = window.prompt("Enter confirmation code")

    if (!confirmationCode) throw new Error("No confirmation code");

    await confirmSignUp({
      username,
      confirmationCode,
    });
  }

  return (

    <Authenticator>
      {({ signOut, user }) => (
        <main>
          {/* maker the span in a new line */}
          <h1 style={{ textAlign: "center" }}>Welcome to your Todo's <span style={{ display: "block", color: "blue", fontSize: "1.5rem" }}>{user?.signInDetails?.loginId}</span></h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li
                onClick={() => deleteTodo(todo.id)}
                key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
          <button onClick={createUser}>Create User</button>
          {/* <button onClick={confirmUserSignUp}>Confirm User</button> */}
        </main>
      )}
    </Authenticator>
  );
}

export default App;
