import "../../css/common/pageTitle.css";

function PageTitle({ title, description, children }) {
  return (
    <section className="page-title-box">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-title-action">{children}</div>}
    </section>
  );
}

export default PageTitle;
