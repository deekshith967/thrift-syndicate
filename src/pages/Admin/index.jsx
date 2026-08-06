import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getFilteredProducts
} from '../../data/productService';
import {
  useOrders,
  updateOrderStatus,
  deleteOrder
} from '../../data/orderService';
import ProductForm from '../../components/admin/ProductForm';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
  AlertCircle,
  Eye,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  // Reactive single source of truth product list & orders list
  const productList = useProducts();
  const orderList = useOrders();

  // Navigation tab state: 'overview' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState('orders');

  // Product Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Order Search & Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Metrics
  const metrics = useMemo(() => {
    const totalProducts = productList.length;
    const inStockProducts = productList.filter((p) => p.inStock).length;
    const totalValue = productList.reduce((sum, p) => sum + p.price, 0);
    const totalOrders = orderList.length;
    const pendingOrders = orderList.filter((o) => o.status === 'Pending').length;
    const totalRevenue = orderList
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return { totalProducts, inStockProducts, totalValue, totalOrders, pendingOrders, totalRevenue };
  }, [productList, orderList]);

  // Categories list
  const categories = useMemo(() => getProductCategories(productList), [productList]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = getFilteredProducts(productList, {
      category: selectedCategory,
      search: searchQuery,
      sortBy: 'newest'
    });

    if (stockFilter === 'instock') {
      result = result.filter((p) => p.inStock);
    } else if (stockFilter === 'outstock') {
      result = result.filter((p) => !p.inStock);
    }

    return result;
  }, [productList, selectedCategory, searchQuery, stockFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orderList];

    if (statusFilter !== 'All') {
      result = result.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          (o.customer.email && o.customer.email.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orderList, statusFilter, orderSearch]);

  // Product Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handle Create Product
  const handleCreateProduct = (data) => {
    addProduct(data);
    setIsFormOpen(false);
  };

  // Handle Update Product
  const handleUpdateProduct = (data) => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, data);
    setEditingProduct(null);
  };

  // Handle Delete Product
  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setDeletingProductId(null);
  };

  // Status color helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col lg:flex-row text-[#111111] font-sans pt-16">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#111111] text-[#FFFFFF] p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-400" />
          <span className="font-display font-extrabold uppercase text-sm">Syndicate Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-64 bg-[#111111] text-white p-6 flex flex-col justify-between shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] z-20 ${
        sidebarOpen ? 'block' : 'hidden lg:flex'
      }`}>
        <div className="space-y-8">
          
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            <div className="bg-white text-black p-2 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg uppercase tracking-tight">Admin Console</h2>
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Thrift Syndicate</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'overview' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'orders' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <span>Orders</span>
              </div>
              {metrics.pendingOrders > 0 && (
                <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {metrics.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'products' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Package size={18} />
              <span>Product Catalog</span>
            </button>
          </nav>
        </div>

        {/* Back to Store CTA */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <Link
            to="/"
            className="w-full border border-neutral-700 hover:bg-neutral-900 text-neutral-300 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink size={14} />
          </Link>
          <p className="text-[10px] text-neutral-500 text-center">Daba Gardens, Visakhapatnam</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#111111]">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'orders' ? 'Customer Orders' : 'Manage Products'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {activeTab === 'orders' ? 'Monitor, update status, and manage customer orders.' : 'Add, edit, filter, and monitor your vintage product inventory.'}
            </p>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag size={18} className="text-neutral-800" />
            </div>
            <p className="font-display font-black text-3xl text-[#111111]">{metrics.totalOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
              <AlertCircle size={18} className="text-amber-500" />
            </div>
            <p className="font-display font-black text-3xl text-amber-600">{metrics.pendingOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Order Revenue</span>
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <p className="font-display font-black text-3xl text-emerald-700">₹{metrics.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Catalog</span>
              <Package size={18} className="text-neutral-800" />
            </div>
            <p className="font-display font-black text-3xl text-[#111111]">{metrics.totalProducts}</p>
          </div>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'overview' ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-bold text-xl uppercase">Quick Store & Orders Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-neutral-500">Recent Customer Orders</h4>
                <div className="space-y-2">
                  {orderList.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">#{order.id} - {order.customer.fullName}</p>
                        <p className="text-[10px] text-neutral-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="font-bold text-neutral-900 text-xs mt-0.5">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-neutral-500">Quick Shortcuts</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full bg-[#111111] text-white p-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-sm hover:bg-black transition-all"
                  >
                    <span>Manage Orders Table</span>
                    <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full border border-neutral-300 text-neutral-900 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <span>Manage Products Catalog</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          /* Orders Table View */
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
            
            {/* Orders Toolbar */}
            <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F8F8F8]">
              
              {/* Search Orders */}
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search order ID, customer name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none text-neutral-800"
                >
                  <option value="All">Status: All</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 border-b border-neutral-200 text-[11px] font-extrabold uppercase text-neutral-500 tracking-wider">
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500 font-medium">
                        No customer orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                        
                        {/* Order ID */}
                        <td className="py-4 px-6 font-mono font-bold text-neutral-900">
                          #{order.id}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <p className="font-bold text-neutral-900">{order.customer.fullName}</p>
                          <p className="text-[10px] text-neutral-500">{order.customer.phone}</p>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-neutral-600 font-medium">
                          {order.date}
                        </td>

                        {/* Payment Method */}
                        <td className="py-4 px-4 uppercase font-bold text-neutral-700 text-[10px]">
                          {order.paymentMethod === 'cod' ? 'COD / Pickup' : order.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                        </td>

                        {/* Total Amount */}
                        <td className="py-4 px-4 font-display font-black text-sm text-[#111111]">
                          ₹{order.total.toLocaleString()}
                        </td>

                        {/* Status Select dropdown */}
                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 bg-neutral-100 hover:bg-[#111111] hover:text-white px-3 py-1.5 rounded-xl font-bold text-neutral-800 transition-colors text-[11px]"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* Products Table View */
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
            
            {/* Table Filters & Toolbar */}
            <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F8F8F8]">
              
              {/* Live Search */}
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search product by name, brand, category..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
              </div>

              {/* Category & Stock Filter Selectors */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none text-neutral-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>Category: {cat}</option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none text-neutral-800"
                >
                  <option value="all">Stock: All</option>
                  <option value="instock">In Stock</option>
                  <option value="outstock">Out of Stock</option>
                </select>
              </div>

            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 border-b border-neutral-200 text-[11px] font-extrabold uppercase text-neutral-500 tracking-wider">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Brand / Size</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-500 font-medium">
                        No products found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                        
                        {/* Image & Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-xl border border-neutral-200 shrink-0"
                            />
                            <div>
                              <p className="font-display font-bold text-sm text-[#111111] line-clamp-1">{product.name}</p>
                              <span className="text-[10px] font-mono text-neutral-400">ID: {product.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 font-semibold text-neutral-700">
                          {product.category}
                        </td>

                        {/* Brand / Size */}
                        <td className="py-4 px-4">
                          <p className="font-bold text-neutral-800">{product.brand}</p>
                          <span className="text-[10px] text-neutral-500">Size: {product.size}</span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <p className="font-display font-black text-sm text-[#111111]">₹{product.price.toLocaleString()}</p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] text-neutral-400 line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            product.inStock ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(product.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-neutral-200 flex items-center justify-between text-xs bg-neutral-50">
                <span className="text-neutral-500 font-semibold">
                  Page {currentPage} of {totalPages} ({filteredProducts.length} items total)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-2 border rounded-xl bg-white text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-2 border rounded-xl bg-white text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Order Details Modal Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 my-8" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-6 bg-[#111111] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Order Details</span>
                <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-emerald-400">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Status Update Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-neutral-500 font-medium">Placed on: {selectedOrder.date}</span>
                  <p className="text-neutral-800 font-bold mt-0.5">Current Status: <strong className="uppercase">{selectedOrder.status}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-700">Change Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const updated = updateOrderStatus(selectedOrder.id, e.target.value);
                      setSelectedOrder(updated);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-xs border focus:outline-none ${getStatusBadge(selectedOrder.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
                <div className="space-y-1.5">
                  <span className="font-bold uppercase text-neutral-400 text-[10px] flex items-center gap-1">
                    <User size={12} /> Customer Info
                  </span>
                  <p className="font-bold text-neutral-900 text-sm">{selectedOrder.customer.fullName}</p>
                  <p className="text-neutral-600 flex items-center gap-1"><Phone size={12} /> {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.email && (
                    <p className="text-neutral-600 flex items-center gap-1"><Mail size={12} /> {selectedOrder.customer.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold uppercase text-neutral-400 text-[10px] flex items-center gap-1">
                    <MapPin size={12} /> Shipping Address
                  </span>
                  <p className="text-neutral-800 font-medium">{selectedOrder.customer.address}</p>
                  <p className="text-neutral-600">{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Purchased Vintage Products ({selectedOrder.items.length})
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <img src={product.image || product.images?.[0]} alt={product.name} className="w-12 h-14 object-cover rounded-xl border border-neutral-200 shrink-0" />
                        <div>
                          <p className="font-display font-bold text-xs text-neutral-900">{product.name}</p>
                          <span className="text-[10px] text-neutral-500">Size: {product.size} • Qty: {quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-xs text-neutral-900">₹{(product.price * quantity).toLocaleString()}</p>
                        <span className="text-[10px] text-neutral-400 font-mono">₹{product.price.toLocaleString()} each</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-neutral-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-neutral-900">
                    {selectedOrder.deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${selectedOrder.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-neutral-200">
                  <span>Total Amount Paid:</span>
                  <span className="font-display text-base">₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-neutral-200 flex justify-between gap-3">
                <a
                  href={`https://wa.me/91${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedOrder.customer.fullName)},%20this%20is%20Thrift%20Syndicate%20regarding%20Order%20%23${selectedOrder.id}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Contact Customer</span>
                </a>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close Details
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      {(isFormOpen || editingProduct) && (
        <ProductForm
          initialProduct={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl space-y-4 text-center border border-neutral-200 shadow-2xl">
            <AlertCircle size={40} className="mx-auto text-rose-500" />
            <h4 className="font-display font-extrabold text-lg uppercase text-[#111111]">Delete Vintage Product?</h4>
            <p className="text-xs text-neutral-600">
              Are you sure you want to delete product <strong>#{deletingProductId}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
