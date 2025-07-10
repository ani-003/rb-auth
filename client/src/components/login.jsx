import React, { useState } from 'react'
import axios from 'axios'
import LogoutButton from './Logout'
import AddProductForm from './AddProductForm'
import { jwtDecode } from 'jwt-decode'

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';



const Login = () => {
  const [logEmail, setEmail] = useState('')
  const [logPassword, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token'))


  const handleLogin = async (e) => {
    e.preventDefault()

    if (!logEmail.includes('@') || !logEmail.includes('.')) {
      setMessage('Please enter a valid email address')
      return
    }

    if (logPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      return
    }

    try {
      const res = await axios.post(`${API}/login`, {
        logEmail,
        logPassword
      })

      const { token } = res.data
      localStorage.setItem('token', token)
      setToken(token)
      setMessage('Login successful!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed')
    }
  }

  const handleGetData = async () => {
    try {
      const res = await axios.get(`${API}/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProducts(res.data.products)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to fetch data')
    }
  }

const getRole = () => {
  try {
    return jwtDecode(token).role
  } catch {
    return ''
  }
}


  return (
  <div style={styles.container}>
    {!token ? (
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>
        <input
          type='email'
          placeholder='Email'
          value={logEmail}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={logPassword}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type='submit' style={styles.button}>Login</button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    ) : (
      <div style={styles.form}>
       <h2>Welcome, {getRole()}!</h2>

        <button onClick={handleGetData} style={styles.button}>
          Get Products
        </button>
        {products.length > 0 && (
          <div style={styles.productsBox}>
            <h3>Fetched Products:</h3>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  {product.name} -- ₹{product.price} -- {product.isPublic ? 'Public' : 'Private'}
                </li>
              ))}
            </ul>
          </div>
        )}
        <LogoutButton />
        <AddProductForm token={token} />
      </div>
    )}
  </div>
)

}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '20vw'
  },
  form: {
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '400px'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  message: {
    textAlign: 'center',
    marginTop: '1rem',
    color: 'red'
  },
  productsBox: {
    marginTop: '1rem',
    background: '#f8f8f8',
    padding: '1rem',
    borderRadius: '8px'
  }
}

export default Login
