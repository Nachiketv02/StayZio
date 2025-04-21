import { useState, useEffect } from 'react';
import UserList from '../../components/Admin/User/UserList';
import UserDetails from '../../components/Admin/User/UserDetails';
import UserForm from '../../components/Admin/User/UserForm';
import { getAllUsers, deleteUser } from '../../services/Admin/AdminApi';
import { SearchIcon, PlusIcon, RefreshIcon } from '../../components/Icon/Icons';
import Pagination from '../../components/Common/Pagination';
import { motion } from 'framer-motion';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, details, add, edit
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, admin, user, host, verified
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  useEffect(() => {
    // Filter and search users
    let result = [...users];
    
    // Apply filter
    if (filter !== 'all') {
      if (filter === 'admin') {
        result = result.filter(user => user.role === 'admin');
      } else if (filter === 'user') {
        result = result.filter(user => user.role === 'user');
      } else if (filter === 'host') {
        result = result.filter(user => user.isHost);
      } else if (filter === 'verified') {
        result = result.filter(user => user.isVerified);
      } else if (filter === 'unverified') {
        result = result.filter(user => !user.isVerified);
      }
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.fullName.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.phone.includes(searchTerm)
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [users, searchTerm, filter]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewMode('details');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setViewMode('edit');
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setViewMode('add');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const handleUserUpdate = () => {
    handleRefresh();
    setViewMode('list');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        handleBackToList();
      } catch (err) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  // Content to display based on viewMode
  const renderContent = () => {
    switch(viewMode) {
      case 'details':
        return (
          <UserDetails 
            user={selectedUser} 
            onBack={handleBackToList}
            onEdit={() => setViewMode('edit')}
            onDelete={() => handleDeleteUser(selectedUser._id)}
          />
        );
      case 'add':
        return (
          <UserForm 
            onBack={handleBackToList}
            onSuccess={handleUserUpdate}
          />
        );
      case 'edit':
        return (
          <UserForm 
            user={selectedUser}
            onBack={handleBackToList}
            onSuccess={handleUserUpdate}
          />
        );
      case 'list':
      default:
        return (
          <>
            <UserList 
              users={currentUsers}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              isLoading={isLoading}
            />
            {filteredUsers.length > 0 && (
              <div className="mt-6">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex space-x-2">
            {viewMode === 'list' && (
              <>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddUser}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add User</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  <RefreshIcon className="w-5 h-5" />
                  <span>Refresh</span>
                </motion.button>
              </>
            )}
            {viewMode !== 'list' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToList}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Back to List
              </motion.button>
            )}
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
            
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="user">Regular Users</option>
              <option value="host">Hosts</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {renderContent()}
      </motion.div>
    </div>
  );
}

export default Users;