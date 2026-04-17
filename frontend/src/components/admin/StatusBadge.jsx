const StatusBadge = ({ status }) => {
  const statusConfig = {
    // Order statuses
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    
    // Booking statuses
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    
    // Stock statuses
    'in-stock': { label: 'In Stock', color: 'bg-green-100 text-green-800' },
    'low-stock': { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' },
    'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;