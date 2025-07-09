import React from 'react'

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <button onClick={handleLogout} style={styles.btn}>
      Logout
    </button>
  )
}

export default LogoutButton

const styles = {
  btn: {
    padding: '12px',
    background: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
}
