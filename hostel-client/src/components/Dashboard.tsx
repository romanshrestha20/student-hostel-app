import React from 'react'
import { useAuth } from '../context/useAuth'

const Dashboard = () => {
    const {user, logout} = useAuth()
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please <a href="/login">log in</a></p>
      )}
    </div>
  )
}

export default Dashboard

