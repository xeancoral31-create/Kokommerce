import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function OrderHistory() {
    const orders = [
        { id: "#KKO-9821", date: "April 12, 2026", items: "Signature Ube Cake, 2x Pandesal", total: "₱1,490.00", status: "Delivered", color: "delivered" },
        { id: "#KKO-9755", date: "April 05, 2026", items: "Wild Yeast Sourdough, Spanish Bread", total: "₱470.00", status: "Delivered", color: "delivered" },
    ];

    return (
        <BuyerLayout>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Order <span>Archives.</span></h1>
                    <p className="text-muted">A chronicle of your culinary journeys with us.</p>
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>ORDER REFERENCE</th>
                            <th>DATE</th>
                            <th>ITEMS PURCHASED</th>
                            <th>TOTAL AMOUNT</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="font-bold text-[#2d2a26]">{order.id}</td>
                                <td className="text-muted">{order.date}</td>
                                <td className="max-w-xs truncate">{order.items}</td>
                                <td className="font-semibold">{order.total}</td>
                                <td>
                                    <span className={`badge status-${order.color}`}>{order.status}</span>
                                </td>
                                <td>
                                    <button className="text-gold font-bold text-sm hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </BuyerLayout>
    );
}
