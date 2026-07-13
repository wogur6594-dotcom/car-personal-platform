function AdminPageHeader({ title, description, children }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="admin-page-actions">{children}</div>}
    </div>
  );
}

export default AdminPageHeader;
