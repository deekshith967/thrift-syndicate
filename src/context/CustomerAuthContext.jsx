import React, { createContext, useContext, useState, useEffect } from 'react';

const CUSTOMER_AUTH_KEY = 'thrift_syndicate_customer_auth_v1';
const CUSTOMERS_DB_KEY = 'thrift_syndicate_customers_v1';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Error reading customer auth session:', err);
      return null;
    }
  });

  const isLoggedIn = !!customer;

  // Sync session changes to localStorage
  useEffect(() => {
    try {
      if (customer) {
        localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(customer));
      } else {
        localStorage.removeItem(CUSTOMER_AUTH_KEY);
      }
    } catch (err) {
      console.error('Error persisting customer auth session:', err);
    }
  }, [customer]);

  /**
   * Helper to retrieve all registered customers
   */
  const getRegisteredCustomers = () => {
    try {
      const db = localStorage.getItem(CUSTOMERS_DB_KEY);
      return db ? JSON.parse(db) : [];
    } catch (err) {
      console.error('Error reading customers DB:', err);
      return [];
    }
  };

  /**
   * Register a new customer
   */
  const register = ({ name, email, phone, password }) => {
    const trimmedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const trimmedPhone = String(phone || '').trim();

    if (!trimmedName || !normalizedEmail || !trimmedPhone || !password) {
      return { success: false, message: 'All registration fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const existingCustomers = getRegisteredCustomers();

    // Check duplicate email
    const isDuplicate = existingCustomers.some(
      (c) => String(c.email).toLowerCase() === normalizedEmail
    );

    if (isDuplicate) {
      return {
        success: false,
        message: 'An account with this email already exists. Please log in.'
      };
    }

    const newCustomer = {
      id: `cust-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: trimmedName,
      email: normalizedEmail,
      phone: trimmedPhone,
      password: String(password),
      createdAt: new Date().toISOString()
    };

    const updatedCustomers = [...existingCustomers, newCustomer];

    try {
      localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Error saving customer to DB:', err);
      return { success: false, message: 'Failed to save customer. Storage error.' };
    }

    // Set logged-in customer session (excluding plain password in session state for cleanliness)
    const sessionData = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      createdAt: newCustomer.createdAt
    };

    setCustomer(sessionData);
    return { success: true, customer: sessionData };
  };

  /**
   * Login customer
   */
  const login = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!normalizedEmail || !cleanPassword) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    const existingCustomers = getRegisteredCustomers();
    const matchedCustomer = existingCustomers.find(
      (c) => String(c.email).toLowerCase() === normalizedEmail && String(c.password) === cleanPassword
    );

    if (!matchedCustomer) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      };
    }

    const sessionData = {
      id: matchedCustomer.id,
      name: matchedCustomer.name,
      email: matchedCustomer.email,
      phone: matchedCustomer.phone,
      createdAt: matchedCustomer.createdAt
    };

    setCustomer(sessionData);
    return { success: true, customer: sessionData };
  };

  /**
   * Logout customer
   */
  const logout = () => {
    setCustomer(null);
    try {
      localStorage.removeItem(CUSTOMER_AUTH_KEY);
    } catch (err) {
      console.error('Error clearing customer session:', err);
    }
  };

  const value = {
    customer,
    isLoggedIn,
    login,
    logout,
    register
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
