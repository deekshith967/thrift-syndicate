import React, { createContext, useContext, useState, useEffect } from 'react';

const CUSTOMER_AUTH_KEY = 'thrift_syndicate_customer_auth_v1';
const CUSTOMERS_DB_KEY = 'thrift_syndicate_customers_v1';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_AUTH_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && !Array.isArray(parsed.addresses)) {
        parsed.addresses = [];
      }
      return parsed;
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
   * Helper to update a customer in the permanent DB
   */
  const updateCustomerInDb = (updatedCustomer) => {
    const existing = getRegisteredCustomers();
    const index = existing.findIndex(
      (c) => String(c.id).toLowerCase() === String(updatedCustomer.id).toLowerCase() ||
             String(c.email).toLowerCase() === String(updatedCustomer.email).toLowerCase()
    );

    let nextDb;
    if (index > -1) {
      nextDb = [...existing];
      nextDb[index] = {
        ...nextDb[index],
        ...updatedCustomer,
        // preserve password in DB
        password: nextDb[index].password
      };
    } else {
      nextDb = [...existing, updatedCustomer];
    }

    try {
      localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(nextDb));
    } catch (err) {
      console.error('Error updating customer DB:', err);
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
      addresses: [],
      createdAt: new Date().toISOString()
    };

    const updatedCustomers = [...existingCustomers, newCustomer];

    try {
      localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Error saving customer to DB:', err);
      return { success: false, message: 'Failed to save customer. Storage error.' };
    }

    const sessionData = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      addresses: [],
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
      addresses: Array.isArray(matchedCustomer.addresses) ? matchedCustomer.addresses : [],
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

  /**
   * Update customer profile (Full Name & Phone Number)
   */
  const updateProfile = ({ name, phone }) => {
    if (!customer) return { success: false, message: 'No active session.' };

    const trimmedName = String(name || '').trim();
    const trimmedPhone = String(phone || '').trim();

    if (!trimmedName) {
      return { success: false, message: 'Full name is required.' };
    }

    if (!trimmedPhone) {
      return { success: false, message: 'Valid phone number is required.' };
    }

    const updated = {
      ...customer,
      name: trimmedName,
      phone: trimmedPhone
    };

    setCustomer(updated);
    updateCustomerInDb(updated);

    return { success: true, customer: updated };
  };

  /**
   * Add a new saved address
   */
  const addAddress = (addressData) => {
    if (!customer) return { success: false, message: 'No active session.' };

    const currentAddresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const isFirst = currentAddresses.length === 0;
    const shouldBeDefault = isFirst || !!addressData.isDefault;

    const newAddress = {
      id: `addr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      fullName: String(addressData.fullName || customer.name).trim(),
      phone: String(addressData.phone || customer.phone).trim(),
      addressLine1: String(addressData.addressLine1 || '').trim(),
      addressLine2: String(addressData.addressLine2 || '').trim(),
      city: String(addressData.city || '').trim(),
      state: String(addressData.state || '').trim(),
      pincode: String(addressData.pincode || '').trim(),
      isDefault: shouldBeDefault
    };

    let nextAddresses = currentAddresses.map((a) =>
      shouldBeDefault ? { ...a, isDefault: false } : a
    );
    nextAddresses = [newAddress, ...nextAddresses];

    const updated = {
      ...customer,
      addresses: nextAddresses
    };

    setCustomer(updated);
    updateCustomerInDb(updated);

    return { success: true, address: newAddress, customer: updated };
  };

  /**
   * Update an existing saved address
   */
  const updateAddress = (addressId, addressData) => {
    if (!customer) return { success: false, message: 'No active session.' };

    const currentAddresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const shouldBeDefault = !!addressData.isDefault;

    const nextAddresses = currentAddresses.map((addr) => {
      if (addr.id === addressId) {
        return {
          ...addr,
          fullName: String(addressData.fullName || addr.fullName).trim(),
          phone: String(addressData.phone || addr.phone).trim(),
          addressLine1: String(addressData.addressLine1 || addr.addressLine1).trim(),
          addressLine2: String(addressData.addressLine2 || addr.addressLine2).trim(),
          city: String(addressData.city || addr.city).trim(),
          state: String(addressData.state || addr.state).trim(),
          pincode: String(addressData.pincode || addr.pincode).trim(),
          isDefault: shouldBeDefault || addr.isDefault
        };
      }
      return shouldBeDefault ? { ...addr, isDefault: false } : addr;
    });

    const updated = {
      ...customer,
      addresses: nextAddresses
    };

    setCustomer(updated);
    updateCustomerInDb(updated);

    return { success: true, customer: updated };
  };

  /**
   * Delete a saved address
   */
  const deleteAddress = (addressId) => {
    if (!customer) return { success: false, message: 'No active session.' };

    const currentAddresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const target = currentAddresses.find((a) => a.id === addressId);
    let nextAddresses = currentAddresses.filter((a) => a.id !== addressId);

    // If deleted address was default and others remain, make first one default
    if (target?.isDefault && nextAddresses.length > 0) {
      nextAddresses[0] = { ...nextAddresses[0], isDefault: true };
    }

    const updated = {
      ...customer,
      addresses: nextAddresses
    };

    setCustomer(updated);
    updateCustomerInDb(updated);

    return { success: true, customer: updated };
  };

  /**
   * Set an address as default
   */
  const setDefaultAddress = (addressId) => {
    if (!customer) return { success: false, message: 'No active session.' };

    const currentAddresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const nextAddresses = currentAddresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    const updated = {
      ...customer,
      addresses: nextAddresses
    };

    setCustomer(updated);
    updateCustomerInDb(updated);

    return { success: true, customer: updated };
  };

  const value = {
    customer,
    isLoggedIn,
    login,
    logout,
    register,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
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
