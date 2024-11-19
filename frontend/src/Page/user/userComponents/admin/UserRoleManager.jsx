import React, { useState, useEffect } from "react";
import axios from "axios";

function UserRoleManager({ userId }) {
    const [role, setRole] = useState("");
    const [availableRoles] = useState(["ROLE_USER", "ROLE_MANAGER", "ROLE_SELLER", "ROLE_ADMIN"]);

    useEffect(() => {
        // 사용자 권한 가져오기
        axios.get(`/admin/users/${userId}/role`).then((response) => {
            setRole(response.data);
        });
    }, [userId]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const saveRole = () => {
        axios.put(`/admin/users/${userId}/role`, { role }).then(() => {
            alert("Role updated successfully!");
        });
    };

    return (
        <div>
            <h3>User Role Management</h3>
            <select value={role} onChange={handleRoleChange}>
                {availableRoles.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <button onClick={saveRole}>Save Role</button>
        </div>
    );
}

export default UserRoleManager;