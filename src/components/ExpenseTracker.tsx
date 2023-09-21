'use client'


import {useEffect, useState} from 'react'
import "./ExpenseTracker.css"
const ExpenseTracker = () => {

const [tasks,setTasks]=useState <any[]> ([])

const [text,setText]=useState('')

const [value,setValue]=useState('')
const [loading,setLoading]= useState (false)

useEffect(() => {
  const apiUrl = `http://localhost:8000/tasks`;
  setLoading(true);
  fetch(apiUrl, {
      method: 'GET'
  })
      .then(response => response.json())
      .then(data => {
          setTasks(data);
          setLoading(false)
      })
      .catch(error =>
          setLoading(false)
      );
}, [])



const addTransaction = (e: React.FormEvent) => {
  e.preventDefault();
  if (tasks.length > 0 && value) {
    if (text.trim() === '') {
      alert('Title is Required!');
      return;
    }

    const taskToAdd = { task: text, value: value };
    const apiUrl = 'http://localhost:8000/tasks';
    
    setLoading(true);
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskToAdd)
    })
      .then(response => response.json())
      .then(data => {
        setTasks(prev => {
          return [...prev, data];
        });
        setLoading(false);
        setText('');
        setValue('');
      })
      .catch(error => {
        setLoading(false);
        console.error('Error adding task:', error);
      });
  } else {
    alert('Task and value are required!');
  }
};





const calculateBalance =() => {
  let sum=0;
  for(let i=0; i < tasks.length; i++){
    sum += +tasks[i].value;
  }
  return sum;
}

const calculateIncome = () => {
  let income = 0;
  for(let i = 0; i < tasks.length; i++){
    if(tasks[i].value > 0){
      income += +tasks[i].value};
    }
    return income;
  }

const calculateExpense = () => {
  let expense = 0;
  for(let i = 0; i < tasks.length; i++){
    if(tasks[i].value < 0){
    expense += +tasks[i].value};
  }
  return expense;
}



const deleteExp = (id: any) => {

  const apiUrl = `http://localhost:8000/tasks/${id}`;
  setLoading(true);
  fetch(apiUrl, {
      method: 'DELETE'
  })
      .then(response => response.json())
      .then(data => {
         
          setLoading(false)
      })
      .catch(error =>
          setLoading(false)
      );

  setTasks(prev => {
    return prev.filter((transactionList: any) => transactionList.id !== id);
  })
}




  return (




    <>
    <h2>Expense Tracker</h2>

<div className="container">
  <h4>Your Balance</h4>
  <h1 id="balance">$ {calculateBalance()} </h1>

  <div className="inc-exp-container">
    <div>
      <h4>Income</h4>
      <p id="money-plus" className="money plus">${calculateIncome()}</p>
    </div>
    <div>
      <h4>Expense</h4>
      <p id="money-minus" className="money minus">$ {-calculateExpense()} </p>
    </div>
  </div>

  <h3>History</h3>
  <ul id="list" className="list">
    {tasks.map((task, key)=>
    
    <li className={task.value >0 ? 'plus' :"minus"}>
      {task.task} <span>
        {task.value}</span><button className="delete-btn"  
        onClick={() => deleteExp(task.id)}
        >x</button>
    </li>
    )}
    
  </ul>

  <h3>Add new task</h3>
  <form id="form" onSubmit={addTransaction}>
    <div className="form-control">
      <label htmlFor="text">Text</label>
      <input type="text" id="text" placeholder="Enter text..." value={text}
      onChange={(e)=>setText(e.target.value)}
      />
    </div>
    <div className="form-control">
      <label htmlFor="value"
        >value <br />
        (negative - expense, positive - income)</label>
      <input type="number" id="value" placeholder="Enter value..." value={value}
      onChange={(e)=>setValue(e.target.value)}
      />
    </div>
    <button className="btn">Add Transaction</button>
  </form>
</div>
    </>
  )
}

export default ExpenseTracker