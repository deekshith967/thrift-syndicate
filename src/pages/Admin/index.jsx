import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getFilteredProducts,
  getProductById
} from '../../data/productService';
import {
  useOrders,
  updateOrderStatus,
  deleteOrder,
  calculateOrderAnalytics
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
  MessageSquare,
  LogOut,
  Calendar,
  Clock,
  XCircle,
  Tag,
  BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };
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

  // Analytics helper calculations from existing orderService data
  const analytics = useMemo(() => calculateOrderAnalytics(orderList), [orderList]);

  // Product Inventory Metrics
  const productMetrics = useMemo(() => {
    const totalProducts = Array.isArray(productList) ? productList.length : 0;

    const inStockProducts = Array.isArray(productList)
      ? productList.filter((p) => {
          const s = p.stock !== undefined ? Number(p.stock) : (p.inStock ? 5 : 0);
          return s > 0;
        }).length
      : 0;

    const lowStockProducts = Array.isArray(productList)
      ? productList.filter((p) => {
          const s = p.stock !== undefined ? Number(p.stock) : (p.inStock ? 5 : 0);
          return s > 0 && s <= 2;
        }).length
      : 0;

    const outOfStockProducts = Array.isArray(productList)
      ? productList.filter((p) => {
          const s = p.stock !== undefined ? Number(p.stock) : (p.inStock ? 5 : 0);
          return s === 0 || p.inStock === false;
        }).length
      : 0;

    return {
      totalProducts,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [productList]);

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
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col lg:flex-row text-[#111111] font-sans pt-20 lg:pt-24">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#111111] text-[#FFFFFF] p-4 flex items-center justify-between sticky top-20 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-400" />
          <span className="font-display font-extrabold uppercase text-sm">Syndicate Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-64 bg-[#111111] text-white p-6 flex flex-col justify-between shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] z-20 ${
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
              {analytics.pendingOrders > 0 && (
                <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {analytics.pendingOrders}
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

        {/* Back to Store & Logout CTA */}
        <div className="pt-6 border-t border-neutral-800 space-y-2.5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <LogOut size={16} />
            <span>Sign Out Admin</span>
          </button>

          <Link
            to="/"
            className="w-full border border-neutral-700 hover:bg-neutral-900 text-neutral-300 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors block text-center"
          >
            <span>View Public Store</span>
            <ExternalLink size={14} />
          </Link>
          <p className="text-[10px] text-neutral-500 text-center">Daba Gardens, Visakhapatnam</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full overflow-x-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pt-2">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#111111]">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'orders' ? 'Customer Orders' : 'Manage Products'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {activeTab === 'orders' ? 'Monitor, update status, and manage customer orders.' : activeTab === 'overview' ? 'Real-time revenue metrics, order velocity, and inventory status.' : 'Add, edit, filter, and monitor your vintage product inventory.'}
            </p>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* Section 1: Financial & Revenue Analytics Cards */}
        <div className="mb-6 space-y-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">Revenue & Value Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[108px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 truncate">Total Revenue</span>
                <DollarSign size={18} className="text-emerald-600 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-2">
                <p className="font-display font-black text-2xl lg:text-3xl text-emerald-700 leading-none tracking-tight whitespace-nowrap">
                  ₹{analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Today's Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[108px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 truncate">Today's Revenue</span>
                <TrendingUp size={18} className="text-blue-600 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-2">
                <p className="font-display font-black text-2xl lg:text-3xl text-blue-700 leading-none tracking-tight whitespace-nowrap">
                  ₹{analytics.todayRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Current Month Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[108px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 truncate">Current Month Revenue</span>
                <Calendar size={18} className="text-purple-600 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-2">
                <p className="font-display font-black text-2xl lg:text-3xl text-purple-700 leading-none tracking-tight whitespace-nowrap">
                  ₹{analytics.monthRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[108px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 truncate">Average Order Value</span>
                <Sparkles size={18} className="text-amber-500 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-2">
                <p className="font-display font-black text-2xl lg:text-3xl text-[#111111] leading-none tracking-tight whitespace-nowrap">
                  ₹{analytics.averageOrderValue.toLocaleString()}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Order Pipeline & Inventory Metrics Cards */}
        <div className="mb-8 space-y-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">Order Pipeline & Stock Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            
            {/* Total Orders */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Total Orders</span>
                <ShoppingBag size={16} className="text-neutral-800 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-[#111111] leading-none">
                  {analytics.totalOrders}
                </p>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Pending</span>
                <Clock size={16} className="text-amber-500 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-amber-600 leading-none">
                  {analytics.pendingOrders}
                </p>
              </div>
            </div>

            {/* Delivered Orders */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Delivered</span>
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-emerald-600 leading-none">
                  {analytics.deliveredOrders}
                </p>
              </div>
            </div>

            {/* Cancelled Orders */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Cancelled</span>
                <XCircle size={16} className="text-rose-500 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-rose-600 leading-none">
                  {analytics.cancelledOrders}
                </p>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Products</span>
                <Package size={16} className="text-neutral-800 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-[#111111] leading-none">
                  {productMetrics.totalProducts}
                </p>
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Low Stock</span>
                <AlertCircle size={16} className="text-amber-500 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-amber-600 leading-none">
                  {productMetrics.lowStockProducts}
                </p>
              </div>
            </div>

            {/* Out of Stock Products */}
            <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between min-h-[96px] transition-all hover:border-neutral-300">
              <div className="flex items-center justify-between gap-2 text-neutral-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 truncate">Out of Stock</span>
                <X size={16} className="text-rose-500 shrink-0" />
              </div>
              <div className="flex-1 flex items-center pt-1.5">
                <p className="font-display font-black text-xl lg:text-2xl text-rose-600 leading-none">
                  {productMetrics.outOfStockProducts}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            
            {/* Monthly Revenue Summary & Growth Banner */}
            <div className="bg-gradient-to-br from-[#111111] to-[#1c1c1c] text-white p-6 sm:p-7 rounded-3xl border border-neutral-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Monthly Revenue Summary</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    analytics.growthPercentage >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    <TrendingUp size={12} className={analytics.growthPercentage >= 0 ? '' : 'rotate-180'} />
                    {analytics.growthPercentage >= 0 ? `+${analytics.growthPercentage}%` : `${analytics.growthPercentage}%`} MoM Growth
                  </span>
                </div>
                <div className="flex items-baseline gap-4 pt-1">
                  <p className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                    ₹{analytics.monthRevenue.toLocaleString()}
                  </p>
                  <span className="text-xs text-neutral-400 font-medium">Current Month</span>
                </div>
              </div>

              <div className="flex items-center gap-6 divide-x divide-neutral-800 pt-2 md:pt-0">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Previous Month</p>
                  <p className="font-display font-bold text-lg text-neutral-200">
                    ₹{analytics.previousMonthRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="pl-6 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Avg Order Value</p>
                  <p className="font-display font-bold text-lg text-emerald-400">
                    ₹{analytics.averageOrderValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Row: Monthly Revenue Line Chart & Monthly Orders Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Revenue Line Chart */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">Monthly Revenue Trend</h3>
                    <p className="text-[11px] text-neutral-500">Revenue performance over the last 6 months</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                    <TrendingUp size={18} />
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="w-full pt-2">
                  {(() => {
                    const data = analytics.monthlyChartData || [];
                    const maxRev = Math.max(...data.map(d => d.revenue), 1000);
                    const width = 460;
                    const height = 150;
                    const padX = 35;
                    const padY = 25;
                    const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;

                    const points = data.map((d, i) => ({
                      x: padX + i * stepX,
                      y: height - padY - (d.revenue / maxRev) * (height - padY * 2),
                      ...d
                    }));

                    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const areaD = points.length > 0 
                      ? `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`
                      : '';

                    return (
                      <div className="relative">
                        <svg viewBox={`0 0 ${width} ${height + 25}`} className="w-full h-44 overflow-visible">
                          <defs>
                            <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          {[0, 0.5, 1].map((ratio, idx) => {
                            const y = padY + ratio * (height - padY * 2);
                            return (
                              <line
                                key={idx}
                                x1={padX}
                                y1={y}
                                x2={width - padX}
                                y2={y}
                                stroke="#E5E7EB"
                                strokeDasharray="4 4"
                                strokeWidth="1"
                              />
                            );
                          })}

                          {/* Filled Area */}
                          {areaD && <path d={areaD} fill="url(#adminRevenueGrad)" />}

                          {/* Line */}
                          {pathD && (
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {/* Points & Labels */}
                          {points.map((p, i) => (
                            <g key={i} className="group">
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="5"
                                className="fill-white stroke-emerald-600 stroke-[3] transition-all hover:scale-125 cursor-pointer"
                              />
                              <text
                                x={p.x}
                                y={Math.max(14, p.y - 10)}
                                textAnchor="middle"
                                className="text-[9px] font-mono font-bold fill-neutral-800"
                              >
                                {p.revenue > 0 ? `₹${(p.revenue / 1000).toFixed(1)}k` : '₹0'}
                              </text>
                              <text
                                x={p.x}
                                y={height + 15}
                                textAnchor="middle"
                                className="text-[10px] font-bold uppercase fill-neutral-500"
                              >
                                {p.shortLabel}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Monthly Orders Bar Chart */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">Monthly Orders Volume</h3>
                    <p className="text-[11px] text-neutral-500">Order count distribution over the last 6 months</p>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-2 rounded-xl border border-blue-200">
                    <BarChart2 size={18} />
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className="pt-2">
                  {(() => {
                    const data = analytics.monthlyChartData || [];
                    const maxOrders = Math.max(...data.map(d => d.orders), 1);

                    return (
                      <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-44 pt-6 pb-2 border-b border-neutral-200">
                        {data.map((d, i) => {
                          const heightPercent = maxOrders > 0 ? Math.max(12, Math.round((d.orders / maxOrders) * 100)) : 12;
                          return (
                            <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                              <span className="text-[10px] font-mono font-bold text-neutral-700 transition-transform group-hover:-translate-y-0.5">
                                {d.orders}
                              </span>
                              <div
                                style={{ height: `${heightPercent}%` }}
                                className={`w-full max-w-[36px] rounded-t-xl transition-all ${
                                  i === data.length - 1
                                    ? 'bg-neutral-900 group-hover:bg-black shadow-xs'
                                    : 'bg-neutral-300 group-hover:bg-neutral-400'
                                }`}
                                title={`${d.fullLabel}: ${d.orders} orders`}
                              />
                              <span className="text-[10px] font-bold uppercase text-neutral-500 mt-1">
                                {d.shortLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>

            {/* Panels Row: Top Selling Products & Recent Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Top Selling Products Panel (Top 5 ranked by total quantity sold) */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Tag size={18} className="text-neutral-900" />
                    <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                      Top Selling Products
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Top 5 by Units Sold</span>
                </div>

                <div className="space-y-3">
                  {analytics.topSellingProducts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                      No product sales recorded yet. Place orders to see sales ranking.
                    </div>
                  ) : (
                    analytics.topSellingProducts.map((prod, idx) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-neutral-50/70 hover:bg-neutral-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                            idx === 0 ? 'bg-amber-400 text-black shadow-xs' : idx === 1 ? 'bg-neutral-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}>
                            #{idx + 1}
                          </span>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-11 h-12 object-cover rounded-xl border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-display font-bold text-xs text-neutral-900 truncate">{prod.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">₹{prod.price.toLocaleString()} • {prod.category}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-3">
                          <span className="inline-block bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {prod.totalSold} sold
                          </span>
                          <p className="text-[10px] font-mono font-bold text-emerald-700 mt-0.5">
                            ₹{prod.revenueGenerated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Sales Panel (Latest 5 orders) */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-neutral-900" />
                    <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                      Recent Sales
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 hover:text-black hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="space-y-3">
                  {analytics.recentSales.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                      No sales recorded yet.
                    </div>
                  ) : (
                    analytics.recentSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-neutral-50/70 hover:bg-neutral-100/80 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-neutral-900">#{sale.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getStatusBadge(sale.status)}`}>
                              {sale.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-neutral-800">{sale.customerName}</p>
                          <p className="text-[10px] text-neutral-400">{sale.date} • {sale.itemCount} {sale.itemCount === 1 ? 'item' : 'items'}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-display font-black text-sm text-[#111111]">
                            ₹{sale.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
                            product.stock === 0
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : product.stock <= 2
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              product.stock === 0 ? 'bg-rose-600' : product.stock <= 2 ? 'bg-amber-600' : 'bg-emerald-600'
                            }`}></span>
                            {product.stock === 0 ? 'Out of Stock' : product.stock <= 2 ? `Low (${product.stock})` : `In Stock (${product.stock})`}
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
                  {selectedOrder.items.map(({ product = {}, quantity = 1 }, idx) => {
                    const activeProd = product.id ? getProductById(product.id, productList) : null;
                    const displayImg = activeProd?.images?.[0] || activeProd?.image || (product.image && !product.image.startsWith('data:') ? product.image : null) || '/images/hero.png';
                    const itemName = activeProd?.name || product.name || 'Vintage Item';
                    const itemSize = activeProd?.size || product.size || 'Free Size';
                    const itemPrice = Number(activeProd?.price ?? product.price ?? 0);
                    return (
                      <div key={product.id || idx} className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                        <div className="flex items-center gap-3">
                          <img src={displayImg} alt={itemName} className="w-12 h-14 object-cover rounded-xl border border-neutral-200 shrink-0" />
                          <div>
                            <p className="font-display font-bold text-xs text-neutral-900">{itemName}</p>
                            <span className="text-[10px] text-neutral-500">Size: {itemSize} • Qty: {quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-black text-xs text-neutral-900">₹{(itemPrice * quantity).toLocaleString()}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">₹{itemPrice.toLocaleString()} each</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-neutral-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.appliedCoupon && (selectedOrder.couponDiscount > 0 || selectedOrder.appliedCoupon.discountAmount > 0) && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Applied Promo ({selectedOrder.appliedCoupon.code}):</span>
                    <span>-₹{(selectedOrder.couponDiscount || selectedOrder.appliedCoupon.discountAmount).toLocaleString()}</span>
                  </div>
                )}
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
