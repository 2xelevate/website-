"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import UserTable from '../../components/UserTable';

export default function Admin() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('https://api.orbit.tf/api/admin/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUsers(data);
            } catch (error: any) {
                setError('Error fetching users');
                console.error('Error fetching users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    async function handleResetPassword(userId: number) {
        try {
            const newPassword = prompt('Enter new password:');
            if (newPassword) {
                await axios.post(`https://api.orbit.tf/api/admin/users/${userId}/reset-password`, { newPassword }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert('Password reset successfully');
            }
        } catch (error: any) {
            console.error('Error resetting password', error);
            alert('Error resetting password');
        }
    }

    async function handleChangeUsername(userId: number) {
        try {
            const newUsername = prompt('Enter new username:');
            if (newUsername) {
                await axios.put(`https://api.orbit.tf/api/admin/users/${userId}/username`, { newUsername }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert('Username updated successfully');
            }
        } catch (error: any) {
            console.error('Error updating username', error);
            alert('Error updating username');
        }
    }

    async function handleAssignRole(userId: number) {
        try {
            const roleName = prompt('Enter the role name to assign:');
            if (roleName) {
                await axios.post('https://api.orbit.tf/api/assign-role', { userId, roleName }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert('Role assigned successfully');
            }
        } catch (error: any) {
            console.error('Error assigning role', error);
            alert('Error assigning role');
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">User Management</h1>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <UserTable 
                            users={users} 
                            onResetPassword={handleResetPassword} 
                            onChangeUsername={handleChangeUsername} 
                            onAssignRole={handleAssignRole} // Add role assignment to the UserTable component
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
