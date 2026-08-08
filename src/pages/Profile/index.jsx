import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Home,
  Save,
  X
} from 'lucide-react';

export default function CustomerProfile() {
  const {
    customer,
    isLoggedIn,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useCustomerAuth();

  const navigate = useNavigate();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: ''
  });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Address Modal/Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530002',
    isDefault: false
  });
  const [addressError, setAddressError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Protect route: redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn || !customer) {
      navigate('/login', { replace: true });
    } else {
      setProfileForm({
        name: customer.name || '',
        phone: customer.phone || ''
      });
    }
  }, [isLoggedIn, customer, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isLoggedIn || !customer) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // --- Profile Update Handlers ---
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileForm.name.trim()) {
      setProfileError('Full name is required.');
      return;
    }

    if (!profileForm.phone.trim() || profileForm.phone.trim().length < 7) {
      setProfileError('Please enter a valid phone number.');
      return;
    }

    const result = updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim()
    });

    if (result.success) {
      setProfileSuccess('Profile details updated successfully!');
      setIsEditingProfile(false);
      showToast('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } else {
      setProfileError(result.message || 'Failed to update profile.');
    }
  };

  // --- Address Handlers ---
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: customer.name || '',
      phone: customer.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530002',
      isDefault: (customer.addresses || []).length === 0
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setAddressError(null);

    const { fullName, phone, addressLine1, city, state, pincode } = addressForm;

    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setAddressError('Please fill in all required address fields.');
      return;
    }

    if (pincode.trim().length < 5) {
      setAddressError('Please enter a valid postal pincode.');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
      showToast('Address updated successfully!');
    } else {
      addAddress(addressForm);
      showToast('New shipping address saved!');
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
    showToast('Shipping address removed.');
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    showToast('Default shipping address updated.');
  };

  const savedAddresses = Array.isArray(customer.addresses) ? customer.addresses : [];

  return (
    <div className="min-h-[85vh] pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-slide-up">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Profile Header Banner */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-display font-black text-2xl uppercase shadow-sm shrink-0">
                {customer.name?.charAt(0) || 'C'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mt-1 truncate">
                  Welcome, {customer.name}
                </h1>
                <p className="text-xs text-neutral-500 font-mono">
                  Customer ID: {customer.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Edit2 size={13} />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Inline Edit Profile Form */}
          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                  <User size={16} />
                  <span>Update Profile Information</span>
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">Email is permanent</span>
              </div>

              {profileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-rose-600" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                    placeholder="Phone Number"
                  />
                </div>

                {/* Email Read-only */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Email Address (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={customer.email}
                    className="w-full bg-neutral-200/70 border border-neutral-300 text-neutral-500 rounded-xl px-3.5 py-2 text-xs font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            /* Static Profile Details Summary */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                  <Mail size={14} className="text-neutral-700" />
                  <span>Email Address</span>
                </div>
                <p className="font-bold text-neutral-900 truncate">{customer.email}</p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                  <Phone size={14} className="text-neutral-700" />
                  <span>Phone Number</span>
                </div>
                <p className="font-bold text-neutral-900">{customer.phone || 'Not added'}</p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                  <Calendar size={14} className="text-neutral-700" />
                  <span>Member Since</span>
                </div>
                <p className="font-bold text-neutral-900">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Active Member'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Section 2: Saved Shipping Addresses */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-neutral-900" />
                <h2 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                  Saved Shipping Addresses
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage your delivery addresses. The default address will auto-fill your checkout form.
              </p>
            </div>

            <button
              onClick={openNewAddressModal}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all hover:scale-[1.01]"
            >
              <Plus size={15} />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Addresses Grid */}
          {savedAddresses.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-3">
              <Home size={32} className="mx-auto text-neutral-400" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-neutral-800">No saved addresses yet</p>
                <p className="text-xs text-neutral-500">
                  Add a delivery address to speed up your vintage checkout orders.
                </p>
              </div>
              <button
                onClick={openNewAddressModal}
                className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                <Plus size={14} />
                <span>Add First Address</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    addr.isDefault
                      ? 'bg-neutral-50/80 border-emerald-500/50 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-neutral-900">{addr.fullName}</p>
                      {addr.isDefault ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>Default</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-neutral-600 space-y-0.5 leading-relaxed">
                      <p className="font-medium text-neutral-800">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} - <strong className="text-neutral-900 font-mono">{addr.pincode}</strong></p>
                      <p className="text-neutral-500 pt-1 font-mono text-[11px]">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200/60">
                    <button
                      onClick={() => openEditAddressModal(addr)}
                      className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-xl transition-colors"
                      title="Edit Address"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Section 3: Quick Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/collections"
            className="p-5 bg-[#111111] hover:bg-black text-white rounded-3xl text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-xs transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-emerald-400" />
              <div>
                <p className="text-sm">Browse Vintage Catalog</p>
                <p className="text-[10px] text-neutral-400 font-normal normal-case">Explore the latest 90s drops and retro fits</p>
              </div>
            </div>
            <ExternalLink size={16} />
          </Link>

          <Link
            to="/wishlist"
            className="p-5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-900 rounded-3xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-rose-500" />
              <div>
                <p className="text-sm">Saved Wishlist</p>
                <p className="text-[10px] text-neutral-500 font-normal normal-case">Review and move your favorite pieces to cart</p>
              </div>
            </div>
            <ExternalLink size={16} />
          </Link>
        </div>

      </div>

      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-neutral-900" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-neutral-900">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            {addressError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-600" />
                <span>{addressError}</span>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="Recipient's Name"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Flat / House / Building / Street *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="e.g. Door No. 12-4-15, MVP Colony, Sector 5"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Area / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="e.g. Near Siripuram Circle"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="530002"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span>Make this my default shipping address</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
