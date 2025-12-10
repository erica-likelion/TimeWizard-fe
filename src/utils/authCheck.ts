import { redirect } from '@tanstack/react-router'

export const redirectIfLoggedIn = () => {
  const token = localStorage.getItem('authToken'); 
  
  if (token) {
    throw redirect({
      to: '/main',
    })
  }
}