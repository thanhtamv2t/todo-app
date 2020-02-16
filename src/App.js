import React, { useState } from "react";
import uuid from "uuid";
// import "./App.scss";
import styles from "./App.module.scss";

const App = () => {
  const fromLocal = JSON.parse(localStorage.getItem("todos"));
  const [state, setState] = useState({
    todos: fromLocal || [],
    todo: ""
  });

  const saveLocal = todos => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleInputChange = e => {
    const { value } = e.target;
    return setState({ ...state, todo: value });
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const { todo, todos } = state;
    if (!todo) return;
    const newTodo = {
      id: uuid(),
      todo,
      completed: false
    };
    saveLocal([...todos, newTodo]);
    return setState({ ...state, todo: "", todos: [...todos, newTodo] });
  };

  const handleTodoClick = todo => {
    const { todos } = state;
    const index = todos.findIndex(item => item.id === todo.id);
    todos[index].completed = !todos[index].completed;
    saveLocal(todos);
    return setState({ ...state, todos });
  };

  const handleDeleteTodo = todo => {
    const todos = state.todos.filter(item => item.id !== todo.id);
    saveLocal(todos);
    return setState({ ...state, todos });
  };

  const handleCleanCompleted = () => {
    const todos = state.todos.filter(item => item.completed === false);
    saveLocal(todos);
    return setState({ ...state, todos });
  };

  const renderTodosList = status => {
    const { todos } = state;
    return (
      todos.length > 0 &&
      todos
        .filter(item => item.completed === status)
        .map(item => (
          <li key={item.id}>
            <span onClick={() => handleTodoClick(item)}>{item.todo}</span>
            <button
              className={styles.closeButton}
              onClick={() => handleDeleteTodo(item)}
            >
              <i className="lni-trash"></i>
            </button>
          </li>
        ))
    );
  };

  return (
    <div className={styles.app}>
      <form className={styles.form} onSubmit={e => handleFormSubmit(e)}>
        <input
          type="text"
          placeholder="Enter things to do"
          value={state.todo}
          onChange={e => handleInputChange(e)}
        />
        <button
          type="button"
          className={`
            ${styles.clearButton} ${
            state.todo.length > 0 ? null : styles.hidden
          }
          `}
          onClick={() => setState({ ...state, todo: "" })}
        >
          <i className="lni-close"></i>
        </button>
      </form>
      <div className={styles.row}>
        <div className={styles.col}>
          <h3>Todo</h3>
          <ul className={styles.todoList}>{renderTodosList(false)}</ul>
        </div>
        <div className={styles.col}>
          <h3>Completed</h3>
          <ul className={styles.completedList}>{renderTodosList(true)}</ul>
          <button
            className={`${styles.cleanButton} ${
              state.todos.filter(item => item.completed === true).length > 0
                ? ""
                : styles.hidden
            }`}
            onClick={() => handleCleanCompleted()}
          >
            Clean Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
