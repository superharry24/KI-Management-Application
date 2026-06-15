import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        width: "100%",
        backgroundColor: "#e0e0e0",
        borderBottom: "1px solid #bbb",
      }}
    >
      <NavItem to="/" label="Home" />
      <NavItem to="/inventory" label="Inventory" />
      <NavItem to="/tasks" label="Tasks" />
      <NavItem to="/events" label="Events" />
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        flex: 1,
        textAlign: "center",
        padding: "14px 0",
        textDecoration: "none",
        color: "black",
        backgroundColor: "#d3d3d3",
        borderRight: "1px solid #bbb",
        transition: "0.2s",
        fontWeight: "500",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#b5b5b5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#d3d3d3";
      }}
    >
      {label}
    </Link>
  );
}