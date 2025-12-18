import { NavLink, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();

  // Open Categories menu for all category routes
  const isCategoryOpen =  location.pathname.startsWith("/categories/");

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <NavLink to="/" className="brand-link text-center">
        <i className="nav-icon fas fa-money-bill-alt"></i>
        <span className="brand-text font-weight-light ml-2">My money</span>
      </NavLink>

      {/* Sidebar */}
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Dashboard</p>
              </NavLink>
            </li>

            {/* Main Transaction */}
            <li className="nav-item">
              <NavLink
                to="/main-transaction"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="nav-icon fas fa-money-check-alt" />
                <p>Main transaction</p>
              </NavLink>
            </li>

            {/* Categories (Parent ONLY UI) */}
            <li
              className={`nav-item has-treeview ${isCategoryOpen ? "menu-is-opening menu-open" : ""
                }`}
            >
              {/* Parent is NOT a NavLink */}
              <div className={`nav-link ${isCategoryOpen ? "active" : ""}`}>
                <i className="nav-icon fas fa-th" />
                <p>
                  Categories
                  <i className="right fas fa-angle-left" />
                </p>
              </div>

              {/* Sub Menus */}
              <ul className={`nav nav-treeview`}>
                <li className="nav-item">
                  <NavLink
                    to="/categories/expenses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Expense Categories</p>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/categories/income"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Income Categories</p>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Menu;
