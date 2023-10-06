export const config = {
  apiUrlCustomer : 'http://localhost:8085/customers/',
  apiUrl: 'http://ui-lib-demo-api.herokuapp.com',
  apiacces: 'http://localhost:8085/api/auth',
  authRoles: {
    sa: ['SA'], // Only Super Admin has access
    admin: ['SA', 'Admin'], // Only SA & Admin has access
    editor: ['SA', 'Admin', 'Editor'], // Only SA & Admin & Editor has access
    user: ['SA', 'Admin', 'Editor', 'User'], // Only SA & Admin & Editor & User has access
    guest: ['SA', 'Admin', 'Editor', 'User', 'Guest'] // Everyone has access
  }
}