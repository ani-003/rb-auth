import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AddProductForm = ({ token }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  if (!token) return null

  const { role } = jwtDecode(token)
  if (role !== 'admin' && role !== 'seller') return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          isPublic
        })
      })

      const data = await res.json()
      setMessage(data.message)
      setSuccess(res.ok)
    } catch (err) {
      setMessage('Request failed')
      setSuccess(false)
    }
  }

  const styles = {
    container: {
      maxWidth: 400,
      margin: '30px auto',
      padding: 20,
      border: '1px solid #ccc',
      borderRadius: 10,
      background: '#f9f9f9',
      fontFamily: 'Arial'
    },
    heading: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
      color: '#333'
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 12,
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 14
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 12
    },
    label: {
      marginLeft: 8,
      fontSize: 14
    },
    button: {
      width: '100%',
      padding: 10,
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: 5,
      fontSize: 16,
      cursor: 'pointer'
    },
    message: {
      textAlign: 'center',
      marginTop: 15,
      fontWeight: 'bold'
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type='text'
          placeholder='Product Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type='number'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <div style={styles.checkbox}>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label style={styles.label}>Make product public</label>
        </div>
        <button style={styles.button} type='submit'>Add Product</button>
      </form>
      {message && (
        <p style={{ ...styles.message, color: success ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export default AddProductForm
