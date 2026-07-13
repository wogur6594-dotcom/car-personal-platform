function AdminStatusBadge({ value }) {
  const normalized = String(value).replaceAll(" ", "-");
  return <span className={`admin-status-badge status-${normalized}`}>{value}</span>;
}

export default AdminStatusBadge;
