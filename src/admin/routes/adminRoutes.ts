import React from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/admin/views/AdminLayout.tsx";
import Dashboard from "@/admin/views/dashboard/Dashboard.tsx";
import Orders from "@/admin/views/orders/Orders.tsx";
import OrderDetails from "@/admin/views/orders/OrderDetails.tsx";
import Users from "@/admin/views/users/Users.tsx";

const adminRoutes = [
	{
		path: "/admin",
		element: React.createElement(AdminLayout),
		children: [
			{ path: "dashboard", element: React.createElement(Dashboard) },
			{ path: "orders", element: React.createElement(Orders) },
			{ path: "orders/:id", element: React.createElement(OrderDetails) },
			{ path: "users", element: React.createElement(Users) },
			{ path: "*", element: React.createElement(Navigate, { to: "/admin/dashboard" }) },
		],
	},
];

export default adminRoutes;
