import React, { useState } from "react";
import '../App.css';

function Todo({ todo, index, completeTodo, removeTodo }) {
    return (
        <div
            className="todo box sb1"
            style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
        >
            {todo.text}
            <div>
                <div onClick={() => completeTodo(index)} id="completed"> <i class="fas fa-check"></i></div>
                <div onClick={() => removeTodo(index)} id="remove"><i class="fas fa-times"></i></div>
            </div>
        </div>
    )
}

function TodoForm({ addTodo }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit} id="todo-form">
            <input type="text"
                className="input"
                value={value}
                onChange={e => setValue(e.target.value)} />
        </form>
    );
}

function ToDoList() {

    const [todos, setTodos] = useState([
        {
            text: "Someone get bugspray!",
            isCompleted: false
        },
        {
            text: "I'll get it!",
            isCompleted: false
        },
        {
            text: "Also, pringles",
            isCompleted: false
        }
    ]);

    const addTodo = text => {
        const newTodos = [...todos, { text }];
        setTodos(newTodos);
    };

    const completeTodo = index => {
        const newTodos = [...todos];
        newTodos[index].isCompleted = true;
        setTodos(newTodos);
    };

    const removeTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    return (
        <div className="todo-container">
            <div className="todo-list">
                {todos.map((todo, index) => (
                    <Todo
                        key={index}
                        index={index}
                        todo={todo}
                        completeTodo={completeTodo}
                        removeTodo={removeTodo}
                    />
                ))}
                
            </div>
            <TodoForm addTodo={addTodo} />
        </div>
    );
}

export default ToDoList