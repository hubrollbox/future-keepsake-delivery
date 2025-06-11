import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <Fragment key={item.path}>
          {index > 0 && <span className="separator">/</span>}
          <Link to={item.path}>{item.label}</Link>
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;